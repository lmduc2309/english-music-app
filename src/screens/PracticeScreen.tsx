import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Alert,
} from 'react-native';
import {useSongStore} from '@/store/songStore';
import {scoringAPI} from '@/services/api';
import {colors, spacing, fontSize, borderRadius, getScoreColor} from '@/theme';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '@/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Practice'>;

const PracticeScreen = ({route, navigation}: Props) => {
  const {songId, sentenceIndex} = route.params;
  const {currentLesson} = useSongStore();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const sentence = currentLesson?.sentences[sentenceIndex];

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (isRecording) {
      // Pulse animation while recording
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {toValue: 1.2, duration: 800, useNativeDriver: true}),
          Animated.timing(pulseAnim, {toValue: 1, duration: 800, useNativeDriver: true}),
        ]),
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording]);

  const startRecording = async () => {
    setIsRecording(true);
    setRecordingTime(0);

    // TODO: Integrate react-native-audio-recorder-player
    // For now, simulate recording with a timer
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 0.1);
    }, 100);
  };

  const stopRecording = async () => {
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (!sentence) return;

    setIsProcessing(true);
    setAttempts(prev => prev + 1);

    try {
      // TODO: Get actual recognized text from speech-to-text
      // TODO: Get actual pitch data from pitchy library
      // For now, send the expected text for demo purposes
      const {data} = await scoringAPI.evaluate({
        sentenceId: sentence.id,
        recognizedText: sentence.text, // Replace with actual STT result
        userPitchData: sentence.pitchContour || [],
        userDuration: recordingTime,
      });

      navigation.replace('ScoreResult', {
        result: data,
        sentence,
      });
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to evaluate. Please try again.',
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (!sentence) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>Sentence not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Close */}
      <TouchableOpacity
        style={styles.closeBtn}
        onPress={() => navigation.goBack()}>
        <Text style={styles.closeBtnText}>\u2715</Text>
      </TouchableOpacity>

      {/* Sentence to sing */}
      <View style={styles.sentenceArea}>
        <Text style={styles.instruction}>
          {isRecording ? '\ud83c\udfa4 Sing now!' : 'Tap the mic and sing this line'}
        </Text>
        <Text style={styles.sentenceText}>{sentence.text}</Text>
        {sentence.phonetic && (
          <Text style={styles.phonetic}>{sentence.phonetic}</Text>
        )}
      </View>

      {/* Recording timer */}
      {(isRecording || recordingTime > 0) && (
        <Text style={styles.timer}>{recordingTime.toFixed(1)}s</Text>
      )}

      {/* Recording button */}
      <View style={styles.micArea}>
        <Animated.View style={{transform: [{scale: pulseAnim}]}}>
          <TouchableOpacity
            style={[
              styles.micButton,
              isRecording && styles.micButtonRecording,
              isProcessing && styles.micButtonProcessing,
            ]}
            onPress={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}>
            <Text style={styles.micIcon}>
              {isProcessing ? '\u23f3' : isRecording ? '\u23f9' : '\ud83c\udfa4'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
        <Text style={styles.micLabel}>
          {isProcessing
            ? 'Analyzing your voice...'
            : isRecording
            ? 'Tap to stop'
            : 'Tap to record'}
        </Text>
      </View>

      {/* Attempts counter */}
      <Text style={styles.attempts}>Attempts: {attempts}</Text>

      {/* Listen to original */}
      <TouchableOpacity style={styles.listenBtn}>
        <Text style={styles.listenBtnText}>\ud83d\udd0a Listen to Original</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  loading: {flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background},
  loadingText: {color: colors.textSecondary},
  closeBtn: {
    position: 'absolute',
    top: spacing.xxl + spacing.sm,
    right: spacing.md,
    zIndex: 10,
  },
  closeBtnText: {fontSize: 24, color: colors.textSecondary},
  sentenceArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  instruction: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  sentenceText: {
    fontSize: fontSize.title,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 44,
  },
  phonetic: {
    fontSize: fontSize.lg,
    color: colors.primaryLight,
    marginTop: spacing.md,
    fontStyle: 'italic',
  },
  timer: {
    fontSize: fontSize.hero,
    fontWeight: '300',
    color: colors.error,
    marginBottom: spacing.md,
  },
  micArea: {alignItems: 'center', marginBottom: spacing.xl},
  micButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  micButtonRecording: {backgroundColor: colors.error},
  micButtonProcessing: {backgroundColor: colors.surfaceLight},
  micIcon: {fontSize: 40},
  micLabel: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  attempts: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  listenBtn: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    marginBottom: spacing.xxl,
  },
  listenBtnText: {color: colors.textPrimary, fontSize: fontSize.md, fontWeight: '600'},
});

export default PracticeScreen;
