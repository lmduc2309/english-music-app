import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, ScrollView, Alert, Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { usePracticeStore, Sentence, AttemptResult } from '../../stores/practiceStore';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScoreCard from '../../components/ScoreCard';
import WordHighlighter from '../../components/WordHighlighter';
import WaveformAnimation from '../../components/WaveformAnimation';

const audioRecorderPlayer = new AudioRecorderPlayer();

export default function PracticeScreen({ route, navigation }: any) {
  const { songId, songTitle } = route.params;
  const {
    sentences, currentIndex, lastResult, loading, mode, attemptCount,
    loadSentences, submitAttempt, setMode, goToNext, resetPractice, isRecording, setRecording,
  } = usePracticeStore();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadSentences(songId);
    return () => {
      resetPractice();
      // Stop recording if screen is unmounted mid-recording
      audioRecorderPlayer.stopRecorder().catch(() => {});
      audioRecorderPlayer.removeRecordBackListener();
    };
  }, [songId]);

  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.3, duration: 600, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording]);

  const currentSentence: Sentence | undefined = sentences[currentIndex];

  const requestMicPermission = async (): Promise<boolean> => {
    const permission = Platform.OS === 'ios'
      ? PERMISSIONS.IOS.MICROPHONE
      : PERMISSIONS.ANDROID.RECORD_AUDIO;

    const status = await check(permission);
    if (status === RESULTS.GRANTED) return true;

    const result = await request(permission);
    return result === RESULTS.GRANTED;
  };

  const startRecording = async () => {
    try {
      const granted = await requestMicPermission();
      if (!granted) {
        return Alert.alert('Permission needed', 'Microphone access is required to analyze your singing.');
      }

      await audioRecorderPlayer.startRecorder();
      audioRecorderPlayer.addRecordBackListener(() => {});
      setRecording(true);
      setMode('sing');
    } catch (err) {
      Alert.alert('Error', 'Could not start recording');
    }
  };

  const stopRecording = async () => {
    if (!currentSentence) return;
    try {
      setRecording(false);
      await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();

      // In production, send audio URI to a speech-to-text + pitch extraction service.
      // For now, simulate with the sentence's own data (placeholder).
      const simulatedSpokenWords = currentSentence.words.map(w => w.text);
      const simulatedPitch = currentSentence.words.map(() => 200 + Math.random() * 100);
      const simulatedDuration = currentSentence.duration + (Math.random() - 0.5) * 2;

      await submitAttempt({
        songId,
        sentenceId: currentSentence._id,
        userPitchData: simulatedPitch,
        userDuration: simulatedDuration,
        spokenWords: simulatedSpokenWords,
      });
    } catch (err) {
      Alert.alert('Error', 'Failed to process recording');
    }
  };

  if (!currentSentence && mode !== 'complete') {
    return (
      <View style={styles.loader}>
        <Text style={typography.body}>Loading sentences...</Text>
      </View>
    );
  }

  if (mode === 'complete') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.completeContainer}>
          <Text style={styles.completeEmoji}>🎉</Text>
          <Text style={typography.h1}>Song Complete!</Text>
          <Text style={[typography.bodySmall, { textAlign: 'center', marginTop: 12 }]}>
            You finished "{songTitle}". Amazing work!
          </Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.primaryBtnText}>Back to Songs</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const progressPct = sentences.length > 0 ? (currentIndex / sentences.length) * 100 : 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="close" size={28} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.progressBarOuter}>
          <View style={[styles.progressBarInner, { width: `${progressPct}%` }]} />
        </View>
        <Text style={typography.caption}>{currentIndex + 1}/{sentences.length}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Sentence Display */}
        <View style={styles.sentenceCard}>
          <Text style={styles.sentenceLabel}>
            {mode === 'listen' ? '🎧 Listen carefully' : mode === 'sing' ? '🎤 Sing this line' : '📊 Your Score'}
          </Text>

          {mode === 'result' && lastResult ? (
            <WordHighlighter words={lastResult.wordScores} />
          ) : (
            <Text style={styles.sentenceText}>{currentSentence!.text}</Text>
          )}

          <Text style={styles.phoneticText}>{currentSentence!.phonetic}</Text>

          {mode === 'listen' && (
            <View style={styles.keyWordsSection}>
              {currentSentence!.words.filter(w => w.isKeyWord).map((w, i) => (
                <View key={i} style={styles.keyWordItem}>
                  <Text style={styles.keyWord}>{w.text}</Text>
                  <Text style={styles.keyWordDef}>{w.definition}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {mode === 'sing' && isRecording && <WaveformAnimation />}
        {mode === 'result' && lastResult && <ScoreCard result={lastResult} attemptNumber={attemptCount} />}
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        {mode === 'listen' && (
          <TouchableOpacity style={styles.primaryBtn} onPress={startRecording}>
            <Icon name="mic" size={24} color="#FFF" />
            <Text style={styles.primaryBtnText}>Start Singing</Text>
          </TouchableOpacity>
        )}

        {mode === 'sing' && (
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity style={[styles.primaryBtn, styles.stopBtn]} onPress={stopRecording}>
              <Icon name="stop" size={24} color="#FFF" />
              <Text style={styles.primaryBtnText}>Stop Recording</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {mode === 'result' && lastResult && (
          <View style={styles.resultActions}>
            {!lastResult.canContinue && (
              <TouchableOpacity style={[styles.actionBtn, styles.retryBtn]} onPress={() => setMode('listen')}>
                <Icon name="refresh" size={20} color={colors.warning} />
                <Text style={[styles.actionBtnText, { color: colors.warning }]}>Try Again</Text>
              </TouchableOpacity>
            )}
            {lastResult.canContinue && (
              <TouchableOpacity style={[styles.actionBtn, styles.nextBtn]} onPress={goToNext}>
                <Text style={[styles.actionBtnText, { color: colors.accent }]}>Next Sentence</Text>
                <Icon name="arrow-forward" size={20} color={colors.accent} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  topBar: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  progressBarOuter: { flex: 1, height: 6, backgroundColor: colors.surfaceLight, borderRadius: 3, overflow: 'hidden' },
  progressBarInner: { height: '100%', backgroundColor: colors.accent, borderRadius: 3 },
  content: { flexGrow: 1, padding: 20 },
  sentenceCard: { backgroundColor: colors.surface, borderRadius: 20, padding: 24, alignItems: 'center' },
  sentenceLabel: { fontSize: 16, color: colors.textSecondary, marginBottom: 16 },
  sentenceText: { fontSize: 24, fontWeight: '700', color: colors.text, textAlign: 'center', lineHeight: 34 },
  phoneticText: { fontSize: 14, color: colors.textMuted, marginTop: 8, textAlign: 'center', fontStyle: 'italic' },
  keyWordsSection: { marginTop: 16, width: '100%' },
  keyWordItem: { flexDirection: 'row', paddingVertical: 6, gap: 8 },
  keyWord: { color: colors.primary, fontWeight: '700', fontSize: 14 },
  keyWordDef: { color: colors.textMuted, fontSize: 14, flex: 1 },
  bottomActions: { padding: 20, paddingBottom: 36 },
  primaryBtn: { flexDirection: 'row', backgroundColor: colors.primary, borderRadius: 16, padding: 18, alignItems: 'center', justifyContent: 'center', gap: 10 },
  primaryBtnText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  stopBtn: { backgroundColor: colors.error },
  resultActions: { flexDirection: 'row', gap: 12 },
  actionBtn: { flex: 1, flexDirection: 'row', borderRadius: 14, padding: 16, alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 2 },
  retryBtn: { borderColor: colors.warning },
  nextBtn: { borderColor: colors.accent },
  actionBtnText: { fontSize: 16, fontWeight: '700' },
  completeContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  completeEmoji: { fontSize: 80, marginBottom: 24 },
});
