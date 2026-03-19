import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Animated, ScrollView } from 'react-native';
import { COLORS, FONTS, SPACING, PASS_THRESHOLD } from '../utils/theme';
import { Song, LyricLine, AttemptResult } from '../types';
import { api } from '../services/api';
import ScoreCircle from '../components/ScoreCircle';

type Phase = 'listen' | 'ready' | 'recording' | 'scoring' | 'result';

const PracticeScreen = ({ route, navigation }: any) => {
  const { sessionId, song } = route.params as { sessionId: string; song: Song };
  const lyrics = song.lyrics || [];
  const [lineIdx, setLineIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>('listen');
  const [attemptCount, setAttemptCount] = useState(0);
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [totalXp, setTotalXp] = useState(0);
  const [recTime, setRecTime] = useState(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const timerRef = useRef<NodeJS.Timeout | null>(null);
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

  const startRecording = () => { setPhase('recording'); };

  const stopRecording = async () => {
    setPhase('scoring');
    const durationMs = recTime * 1000;
    try {
      const res = await api.submitAttempt({
        sessionId, lyricLineId: currentLine.id,
        transcribedText: currentLine.text, // demo mode: use original text
        durationMs: Math.max(durationMs, 1000),
        pitchData: Array.from({ length: Math.max(5, Math.floor(durationMs / 100)) }, (_, i) => ({
          time: (i / Math.max(5, Math.floor(durationMs / 100))) * (durationMs / 1000),
          frequency: 180 + Math.random() * 80 + (Math.random() - 0.5) * 30,
        })),
      });
      setResult(res); setAttemptCount(c => c + 1); setPhase('result');
      if (res.session.xpEarned > 0) setTotalXp(xp => xp + res.session.xpEarned);
    } catch { setPhase('ready'); Alert.alert('Error', 'Failed to score. Try again.'); }
  };

  const handleNext = () => {
    if (!result) return;
    if (result.nextAction === 'song_complete') {
      navigation.replace('SessionComplete', { sessionId, song, totalXp, overallScore: result.session.overallScore });
    } else if (result.nextAction === 'next_line') {
      setLineIdx(i => i + 1); setAttemptCount(0); setResult(null); setPhase('listen');
    } else { setResult(null); setPhase('listen'); }
  };

  const handleExit = () => {
    Alert.alert('Leave Practice?', 'Your progress will be saved.', [
      { text: 'Keep Singing', style: 'cancel' },
      { text: 'Leave', style: 'destructive', onPress: async () => { try { await api.abandonSession(sessionId); } catch {} navigation.goBack(); } },
    ]);
  };

  if (!currentLine) return <View style={[styles.container, styles.center]}><Text style={styles.messageText}>No lyrics available</Text></View>;

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleExit}><Text style={styles.exitText}>✕</Text></TouchableOpacity>
        <View style={styles.progressBar}><View style={[styles.progressFill, { width: `${progress}%` }]} /></View>
        <Text style={styles.progressText}>{lineIdx + 1}/{lyrics.length}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.mainContent}>
        <Text style={styles.songTitle}>{song.title}</Text>
        <Text style={styles.songArtist}>{song.artist}</Text>

        <View style={styles.lyricBox}>
          <Text style={styles.lyricLineNumber}>Line {currentLine.lineNumber}</Text>
          <Text style={styles.lyricMainText}>{currentLine.text}</Text>
          {currentLine.phonetic && <Text style={styles.phoneticText}>{currentLine.phonetic}</Text>}
        </View>

        {phase === 'listen' && (
          <View style={styles.phaseContainer}>
            <Text style={{ fontSize: 56, marginBottom: SPACING.md }}>👂</Text>
            <Text style={styles.phaseTitle}>Listen & Read</Text>
            <Text style={styles.phaseHint}>Read the sentence above, then tap to sing</Text>
            {attemptCount > 0 && <Text style={styles.retryHint}>Attempt #{attemptCount + 1}</Text>}
            <TouchableOpacity style={styles.primaryBtn} onPress={() => setPhase('ready')}><Text style={styles.primaryBtnText}>I'm Ready 🎤</Text></TouchableOpacity>
          </View>
        )}

        {phase === 'ready' && (
          <View style={styles.phaseContainer}>
            <Text style={{ fontSize: 56, marginBottom: SPACING.md }}>🎤</Text>
            <Text style={styles.phaseTitle}>Tap & Sing!</Text>
            <TouchableOpacity style={[styles.primaryBtn, styles.recordBtn]} onPress={startRecording}><Text style={styles.primaryBtnText}>Hold to Record</Text></TouchableOpacity>
          </View>
        )}

        {phase === 'recording' && (
          <View style={styles.phaseContainer}>
            <Animated.View style={[styles.recordingCircle, { transform: [{ scale: pulseAnim }] }]}><Text style={styles.recordingDot}>●</Text></Animated.View>
            <Text style={styles.phaseTitle}>Singing...</Text>
            <Text style={styles.timer}>{recTime.toFixed(1)}s</Text>
            <TouchableOpacity style={[styles.primaryBtn, styles.stopBtn]} onPress={stopRecording}><Text style={styles.primaryBtnText}>⏹ Stop</Text></TouchableOpacity>
          </View>
        )}

        {phase === 'scoring' && (
          <View style={[styles.phaseContainer, styles.center]}>
            <Text style={{ fontSize: 56, marginBottom: SPACING.md }}>🎯</Text>
            <Text style={styles.phaseTitle}>Analyzing...</Text>
          </View>
        )}

        {phase === 'result' && result && (
          <View style={styles.resultContainer}>
            <View style={{ marginBottom: SPACING.md }}><ScoreCircle score={result.attempt.totalScore} size={120} label="Total" /></View>
            <View style={[styles.resultBanner, { backgroundColor: result.attempt.passed ? COLORS.success + '22' : COLORS.danger + '22' }]}>
              <Text style={[styles.resultBannerText, { color: result.attempt.passed ? COLORS.success : COLORS.danger }]}>
                {result.attempt.passed ? '✅ Great job! Moving to next line.' : `❌ Need ${PASS_THRESHOLD}% to pass. Try again!`}
              </Text>
            </View>
            <View style={styles.scoresGrid}>
              <ScoreCircle score={result.attempt.pitchScore} size={64} label="Pitch" />
              <ScoreCircle score={result.attempt.pronunciationScore} size={64} label="Pronun." />
              <ScoreCircle score={result.attempt.timingScore} size={64} label="Timing" />
              <ScoreCircle score={result.attempt.wordAccuracyScore} size={64} label="Words" />
            </View>
            {result.attempt.wordDetails?.length > 0 && (
              <View style={styles.wordDetailsBox}>
                <Text style={styles.wordDetailsTitle}>Word-by-word</Text>
                <View style={styles.wordRow}>
                  {result.attempt.wordDetails.map((w, i) => (
                    <View key={i} style={[styles.wordChip, { backgroundColor: w.correct ? COLORS.success + '22' : COLORS.danger + '22' }]}>
                      <Text style={[styles.wordChipText, { color: w.correct ? COLORS.success : COLORS.danger }]}>{w.word || w.expected}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
            {result.attempt.aiFeedback && (
              <View style={styles.feedbackBox}>
                <Text style={styles.feedbackTitle}>🤖 Coach says:</Text>
                <Text style={styles.feedbackText}>{result.attempt.aiFeedback}</Text>
              </View>
            )}
            {result.session.xpEarned > 0 && <Text style={styles.xpEarned}>+{result.session.xpEarned} XP</Text>}
            <TouchableOpacity style={styles.primaryBtn} onPress={handleNext}>
              <Text style={styles.primaryBtnText}>{result.nextAction === 'song_complete' ? '🎉 Song Complete!' : result.nextAction === 'next_line' ? '➡️ Next Line' : '🔄 Try Again'}</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background }, center: { justifyContent: 'center', alignItems: 'center' },
  topBar: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, paddingTop: SPACING.xl, gap: SPACING.md },
  exitText: { color: COLORS.textSecondary, fontSize: 22, fontWeight: '600' },
  progressBar: { flex: 1, height: 6, backgroundColor: COLORS.surfaceLight, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 3 },
  progressText: { color: COLORS.textMuted, fontSize: FONTS.sizes.sm },
  mainContent: { padding: SPACING.md, paddingBottom: SPACING.xxl },
  songTitle: { color: COLORS.textSecondary, fontSize: FONTS.sizes.sm, textAlign: 'center' },
  songArtist: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs, textAlign: 'center', marginBottom: SPACING.md },
  lyricBox: { backgroundColor: COLORS.card, borderRadius: 16, padding: SPACING.lg, marginBottom: SPACING.lg, borderWidth: 1, borderColor: COLORS.primary + '44', alignItems: 'center' },
  lyricLineNumber: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs, marginBottom: 4 },
  lyricMainText: { color: COLORS.text, fontSize: FONTS.sizes.xl, fontWeight: '700', textAlign: 'center', lineHeight: 32 },
  phoneticText: { color: COLORS.primaryLight, fontSize: FONTS.sizes.sm, marginTop: 8 },
  phaseContainer: { alignItems: 'center', paddingVertical: SPACING.lg },
  phaseTitle: { color: COLORS.text, fontSize: FONTS.sizes.xl, fontWeight: '700', marginBottom: 8 },
  phaseHint: { color: COLORS.textSecondary, fontSize: FONTS.sizes.md, textAlign: 'center', marginBottom: SPACING.lg },
  retryHint: { color: COLORS.warning, fontSize: FONTS.sizes.sm, marginBottom: SPACING.md },
  primaryBtn: { backgroundColor: COLORS.primary, borderRadius: 14, paddingVertical: 16, paddingHorizontal: 40, alignItems: 'center', width: '100%', marginTop: SPACING.md },
  primaryBtnText: { color: COLORS.text, fontSize: FONTS.sizes.lg, fontWeight: '800' },
  recordBtn: { backgroundColor: COLORS.secondary }, stopBtn: { backgroundColor: COLORS.danger },
  recordingCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.danger + '33', justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.md },
  recordingDot: { color: COLORS.danger, fontSize: 36 },
  timer: { color: COLORS.text, fontSize: FONTS.sizes.xxl, fontWeight: '700', marginBottom: SPACING.md },
  resultContainer: { alignItems: 'center' },
  resultBanner: { borderRadius: 12, paddingVertical: 12, paddingHorizontal: 20, marginBottom: SPACING.lg, width: '100%' },
  resultBannerText: { textAlign: 'center', fontWeight: '700', fontSize: FONTS.sizes.md },
  scoresGrid: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: SPACING.lg },
  wordDetailsBox: { width: '100%', backgroundColor: COLORS.card, borderRadius: 12, padding: SPACING.md, marginBottom: SPACING.md },
  wordDetailsTitle: { color: COLORS.textSecondary, fontSize: FONTS.sizes.sm, marginBottom: 8 },
  wordRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  wordChip: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
  wordChipText: { fontSize: FONTS.sizes.sm, fontWeight: '600' },
  feedbackBox: { width: '100%', backgroundColor: COLORS.surface, borderRadius: 12, padding: SPACING.md, marginBottom: SPACING.md, borderLeftWidth: 3, borderLeftColor: COLORS.primaryLight },
  feedbackTitle: { color: COLORS.primaryLight, fontSize: FONTS.sizes.sm, fontWeight: '600', marginBottom: 4 },
  feedbackText: { color: COLORS.textSecondary, fontSize: FONTS.sizes.md, lineHeight: 22 },
  xpEarned: { color: COLORS.warning, fontSize: FONTS.sizes.xl, fontWeight: '800', marginBottom: SPACING.sm },
  messageText: { color: COLORS.textSecondary, fontSize: FONTS.sizes.md },
});
export default PracticeScreen;
