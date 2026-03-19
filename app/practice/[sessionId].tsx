import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ScrollView, Animated } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { COLORS, FONTS, SPACING, PASS_THRESHOLD } from '../../src/utils/theme';
import { Song, LyricLine, AttemptResult } from '../../src/types';
import { api } from '../../src/services/api';
import ScoreCircle from '../../src/components/ScoreCircle';

type Phase = 'listen' | 'ready' | 'recording' | 'scoring' | 'result';

export default function PracticeScreen() {
  const { sessionId, songJson } = useLocalSearchParams<{ sessionId: string; songJson: string }>();
  const song: Song = songJson ? JSON.parse(songJson) : { lyrics: [] };
  const lyrics = song.lyrics || [];

  const [lineIdx, setLineIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>('listen');
  const [attemptCount, setAttemptCount] = useState(0);
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [totalXp, setTotalXp] = useState(0);
  const [recTime, setRecTime] = useState(0);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentLine: LyricLine | undefined = lyrics[lineIdx];
  const progress = lyrics.length > 0 ? (lineIdx / lyrics.length) * 100 : 0;

  useEffect(() => {
    if (phase === 'recording') {
      const pulse = Animated.loop(Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]));
      pulse.start();
      return () => pulse.stop();
    }
    pulseAnim.setValue(1);
  }, [phase]);

  useEffect(() => {
    if (phase === 'recording') {
      setRecTime(0);
      timerRef.current = setInterval(() => setRecTime(t => t + 0.1), 100);
    } else { if (timerRef.current) clearInterval(timerRef.current); }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording: rec } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecording(rec);
      setPhase('recording');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Error', 'Could not access microphone');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    setPhase('scoring');
    try {
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
      const uri = recording.getURI();
      setRecording(null);
      const durationMs = recTime * 1000;

      // Submit attempt — TODO: replace transcribedText with real STT from audio file at uri
      const res = await api.submitAttempt({
        sessionId: sessionId!,
        lyricLineId: currentLine.id,
        transcribedText: currentLine.text,
        durationMs: Math.max(durationMs, 1000),
        pitchData: genPitch(durationMs),
      });

      setResult(res);
      setAttemptCount(c => c + 1);
      setPhase('result');
      Haptics.notificationAsync(res.attempt.passed ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Warning);
      if (res.session.xpEarned > 0) setTotalXp(xp => xp + res.session.xpEarned);
    } catch (err) {
      console.error(err);
      setPhase('ready');
      Alert.alert('Error', 'Failed to score. Try again.');
    }
  };

  const handleNext = () => {
    if (!result) return;
    if (result.nextAction === 'song_complete') {
      router.replace({ pathname: '/practice/complete', params: { songJson: JSON.stringify(song), totalXp: String(totalXp), overallScore: String(result.session.overallScore) } });
    } else if (result.nextAction === 'next_line') {
      setLineIdx(i => i + 1); setAttemptCount(0); setResult(null); setPhase('listen');
    } else { setResult(null); setPhase('listen'); }
  };

  const handleExit = () => {
    Alert.alert('Leave Practice?', 'Your progress will be saved.', [
      { text: 'Keep Singing', style: 'cancel' },
      { text: 'Leave', style: 'destructive', onPress: async () => {
        if (recording) try { await recording.stopAndUnloadAsync(); } catch {}
        try { await api.abandonSession(sessionId!); } catch {}
        router.back();
      }},
    ]);
  };

  if (!currentLine) return <View style={[s.container, s.center]}><Text style={s.message}>No lyrics available</Text></View>;

  return (
    <View style={s.container}>
      <View style={s.topBar}>
        <Pressable onPress={handleExit}><Text style={s.exitText}>✕</Text></Pressable>
        <View style={s.progressBar}><View style={[s.progressFill, { width: `${progress}%` }]} /></View>
        <Text style={s.progressText}>{lineIdx + 1}/{lyrics.length}</Text>
      </View>

      <ScrollView contentContainerStyle={s.main}>
        <Text style={s.songTitle}>{song.title} — {song.artist}</Text>

        <View style={s.lyricBox}>
          <Text style={s.lineNum}>Line {currentLine.lineNumber}</Text>
          <Text style={s.lyricText}>{currentLine.text}</Text>
          {currentLine.phonetic && <Text style={s.phonetic}>{currentLine.phonetic}</Text>}
        </View>

        {phase === 'listen' && (
          <View style={s.phaseWrap}>
            <Text style={{ fontSize: 56 }}>👂</Text>
            <Text style={s.phaseTitle}>Listen & Read</Text>
            <Text style={s.phaseHint}>Read the sentence, then tap to sing</Text>
            {attemptCount > 0 && <Text style={s.retryHint}>Attempt #{attemptCount + 1}</Text>}
            <Pressable style={s.primaryBtn} onPress={() => setPhase('ready')}>
              <Text style={s.primaryBtnText}>I'm Ready 🎤</Text>
            </Pressable>
          </View>
        )}

        {phase === 'ready' && (
          <View style={s.phaseWrap}>
            <Text style={{ fontSize: 56 }}>🎤</Text>
            <Text style={s.phaseTitle}>Tap & Sing!</Text>
            <Pressable style={[s.primaryBtn, { backgroundColor: COLORS.secondary }]} onPress={startRecording}>
              <Text style={s.primaryBtnText}>Start Recording</Text>
            </Pressable>
          </View>
        )}

        {phase === 'recording' && (
          <View style={s.phaseWrap}>
            <Animated.View style={[s.recCircle, { transform: [{ scale: pulseAnim }] }]}>
              <Text style={s.recDot}>●</Text>
            </Animated.View>
            <Text style={s.phaseTitle}>Singing...</Text>
            <Text style={s.timer}>{recTime.toFixed(1)}s</Text>
            <Pressable style={[s.primaryBtn, { backgroundColor: COLORS.danger }]} onPress={stopRecording}>
              <Text style={s.primaryBtnText}>⏹ Stop</Text>
            </Pressable>
          </View>
        )}

        {phase === 'scoring' && (
          <View style={[s.phaseWrap, s.center]}>
            <Text style={{ fontSize: 56 }}>🎯</Text>
            <Text style={s.phaseTitle}>Analyzing...</Text>
          </View>
        )}

        {phase === 'result' && result && (
          <View style={s.resultWrap}>
            <ScoreCircle score={result.attempt.totalScore} size={120} label="Total" />
            <View style={[s.banner, { backgroundColor: result.attempt.passed ? COLORS.success + '22' : COLORS.danger + '22' }]}>
              <Text style={[s.bannerText, { color: result.attempt.passed ? COLORS.success : COLORS.danger }]}>
                {result.attempt.passed ? '✅ Great! Next line.' : `❌ Need ${PASS_THRESHOLD}%. Try again!`}
              </Text>
            </View>
            <View style={s.scoresGrid}>
              <ScoreCircle score={result.attempt.pitchScore} size={64} label="Pitch" />
              <ScoreCircle score={result.attempt.pronunciationScore} size={64} label="Pronun." />
              <ScoreCircle score={result.attempt.timingScore} size={64} label="Timing" />
              <ScoreCircle score={result.attempt.wordAccuracyScore} size={64} label="Words" />
            </View>
            {result.attempt.wordDetails?.length > 0 && (
              <View style={s.wordBox}>
                <Text style={s.wordBoxTitle}>Word-by-word</Text>
                <View style={s.wordChips}>
                  {result.attempt.wordDetails.map((w, i) => (
                    <View key={i} style={[s.chip, { backgroundColor: w.correct ? COLORS.success + '22' : COLORS.danger + '22' }]}>
                      <Text style={{ color: w.correct ? COLORS.success : COLORS.danger, fontWeight: '600', fontSize: FONTS.sizes.sm }}>{w.word || w.expected}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
            {result.attempt.aiFeedback && (
              <View style={s.feedbackBox}>
                <Text style={s.feedbackTitle}>🤖 Coach says:</Text>
                <Text style={s.feedbackText}>{result.attempt.aiFeedback}</Text>
              </View>
            )}
            {result.session.xpEarned > 0 && <Text style={s.xpEarned}>+{result.session.xpEarned} XP</Text>}
            <Pressable style={s.primaryBtn} onPress={handleNext}>
              <Text style={s.primaryBtnText}>
                {result.nextAction === 'song_complete' ? '🎉 Song Complete!' : result.nextAction === 'next_line' ? '➡️ Next Line' : '🔄 Try Again'}
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function genPitch(ms: number) {
  const n = Math.max(5, Math.floor(ms / 100)), base = 180 + Math.random() * 80;
  return Array.from({ length: n }, (_, i) => ({ time: (i / n) * (ms / 1000), frequency: base + (Math.random() - 0.5) * 30 }));
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { justifyContent: 'center', alignItems: 'center' },
  topBar: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, paddingTop: SPACING.xl, gap: SPACING.md },
  exitText: { color: COLORS.textSecondary, fontSize: 22, fontWeight: '600' },
  progressBar: { flex: 1, height: 6, backgroundColor: COLORS.surfaceLight, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 3 },
  progressText: { color: COLORS.textMuted, fontSize: FONTS.sizes.sm },
  main: { padding: SPACING.md, paddingBottom: SPACING.xxl },
  songTitle: { color: COLORS.textMuted, fontSize: FONTS.sizes.sm, textAlign: 'center', marginBottom: SPACING.md },
  lyricBox: { backgroundColor: COLORS.card, borderRadius: 16, padding: SPACING.lg, marginBottom: SPACING.lg, borderWidth: 1, borderColor: COLORS.primary + '44', alignItems: 'center' },
  lineNum: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs, marginBottom: 4 },
  lyricText: { color: COLORS.text, fontSize: FONTS.sizes.xl, fontWeight: '700', textAlign: 'center', lineHeight: 32 },
  phonetic: { color: COLORS.primaryLight, fontSize: FONTS.sizes.sm, marginTop: 8 },
  phaseWrap: { alignItems: 'center', paddingVertical: SPACING.lg },
  phaseTitle: { color: COLORS.text, fontSize: FONTS.sizes.xl, fontWeight: '700', marginTop: SPACING.md, marginBottom: 8 },
  phaseHint: { color: COLORS.textSecondary, fontSize: FONTS.sizes.md, textAlign: 'center', marginBottom: SPACING.lg },
  retryHint: { color: COLORS.warning, fontSize: FONTS.sizes.sm, marginBottom: SPACING.md },
  primaryBtn: { backgroundColor: COLORS.primary, borderRadius: 14, paddingVertical: 16, paddingHorizontal: 40, alignItems: 'center', width: '100%', marginTop: SPACING.md },
  primaryBtnText: { color: COLORS.text, fontSize: FONTS.sizes.lg, fontWeight: '800' },
  recCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.danger + '33', justifyContent: 'center', alignItems: 'center' },
  recDot: { color: COLORS.danger, fontSize: 36 },
  timer: { color: COLORS.text, fontSize: FONTS.sizes.xxl, fontWeight: '700', marginBottom: SPACING.md },
  resultWrap: { alignItems: 'center' },
  banner: { borderRadius: 12, paddingVertical: 12, paddingHorizontal: 20, marginVertical: SPACING.md, width: '100%' },
  bannerText: { textAlign: 'center', fontWeight: '700', fontSize: FONTS.sizes.md },
  scoresGrid: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: SPACING.lg },
  wordBox: { width: '100%', backgroundColor: COLORS.card, borderRadius: 12, padding: SPACING.md, marginBottom: SPACING.md },
  wordBoxTitle: { color: COLORS.textSecondary, fontSize: FONTS.sizes.sm, marginBottom: 8 },
  wordChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
  feedbackBox: { width: '100%', backgroundColor: COLORS.surface, borderRadius: 12, padding: SPACING.md, marginBottom: SPACING.md, borderLeftWidth: 3, borderLeftColor: COLORS.primaryLight },
  feedbackTitle: { color: COLORS.primaryLight, fontSize: FONTS.sizes.sm, fontWeight: '600', marginBottom: 4 },
  feedbackText: { color: COLORS.textSecondary, fontSize: FONTS.sizes.md, lineHeight: 22 },
  xpEarned: { color: COLORS.warning, fontSize: FONTS.sizes.xl, fontWeight: '800', marginBottom: SPACING.sm },
  message: { color: COLORS.textSecondary, fontSize: FONTS.sizes.md },
});
