import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {colors, spacing, fontSize, borderRadius, getScoreColor} from '@/theme';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '@/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ScoreResult'>;

const ScoreBar = ({label, score, emoji}: {label: string; score: number; emoji: string}) => (
  <View style={styles.scoreBarContainer}>
    <View style={styles.scoreBarHeader}>
      <Text style={styles.scoreBarLabel}>{emoji} {label}</Text>
      <Text style={[styles.scoreBarValue, {color: getScoreColor(score)}]}>
        {Math.round(score)}%
      </Text>
    </View>
    <View style={styles.scoreBarBg}>
      <View
        style={[
          styles.scoreBarFill,
          {width: `${Math.min(100, score)}%`, backgroundColor: getScoreColor(score)},
        ]}
      />
    </View>
  </View>
);

const ScoreResultScreen = ({route, navigation}: Props) => {
  const {result, sentence} = route.params;
  const {scores, passed, feedback, wordAnalysis, encouragement} = result;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Result header */}
      <View style={styles.header}>
        <Text style={styles.resultEmoji}>{passed ? '\ud83c\udf89' : '\ud83d\udcaa'}</Text>
        <Text style={[styles.totalScore, {color: getScoreColor(scores.total)}]}>
          {Math.round(scores.total)}%
        </Text>
        <Text style={styles.passStatus}>
          {passed ? 'PASSED!' : 'NOT YET - TRY AGAIN'}
        </Text>
        <Text style={styles.encouragement}>{encouragement}</Text>
      </View>

      {/* Score breakdown */}
      <View style={styles.scoresCard}>
        <Text style={styles.cardTitle}>Score Breakdown</Text>
        <ScoreBar label="Pronunciation" score={scores.pronunciation} emoji="\ud83d\udde3\ufe0f" />
        <ScoreBar label="Pitch" score={scores.pitch} emoji="\ud83c\udfb5" />
        <ScoreBar label="Rhythm" score={scores.duration} emoji="\ud83e\udd41" />
      </View>

      {/* Word analysis */}
      {wordAnalysis && wordAnalysis.length > 0 && (
        <View style={styles.wordsCard}>
          <Text style={styles.cardTitle}>Word by Word</Text>
          <View style={styles.wordsGrid}>
            {wordAnalysis.map((word, idx) => (
              <View
                key={idx}
                style={[
                  styles.wordChip,
                  word.isCorrect ? styles.wordCorrect : styles.wordWrong,
                ]}>
                <Text
                  style={[
                    styles.wordText,
                    word.isCorrect ? styles.wordTextCorrect : styles.wordTextWrong,
                  ]}>
                  {word.expected}
                </Text>
                {!word.isCorrect && word.word !== '(missed)' && (
                  <Text style={styles.wordHeard}>You said: "{word.word}"</Text>
                )}
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Feedback */}
      <View style={styles.feedbackCard}>
        <Text style={styles.feedbackText}>{feedback}</Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        {!passed && (
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => navigation.goBack()}>
            <Text style={styles.retryBtnText}>\ud83d\udd01 Try Again</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={() => {
            if (passed) {
              navigation.navigate('Lesson', {songId: sentence.songId});
            } else {
              navigation.goBack();
            }
          }}>
          <Text style={styles.continueBtnText}>
            {passed ? '\u25b6 Next Sentence' : '\ud83d\udd0a Listen Again'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  content: {paddingHorizontal: spacing.md, paddingBottom: 100},
  header: {
    alignItems: 'center',
    paddingTop: spacing.xxl + spacing.xl,
    marginBottom: spacing.xl,
  },
  resultEmoji: {fontSize: 80, marginBottom: spacing.md},
  totalScore: {fontSize: 72, fontWeight: '900'},
  passStatus: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  encouragement: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  scoresCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  scoreBarContainer: {marginBottom: spacing.md},
  scoreBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  scoreBarLabel: {fontSize: fontSize.md, color: colors.textSecondary},
  scoreBarValue: {fontSize: fontSize.md, fontWeight: '700'},
  scoreBarBg: {
    height: 10,
    backgroundColor: colors.surfaceLight,
    borderRadius: 5,
  },
  scoreBarFill: {height: 10, borderRadius: 5},
  wordsCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  wordsGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm},
  wordChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 2,
  },
  wordCorrect: {
    backgroundColor: colors.success + '20',
    borderColor: colors.success,
  },
  wordWrong: {
    backgroundColor: colors.error + '20',
    borderColor: colors.error,
  },
  wordText: {fontSize: fontSize.md, fontWeight: '700'},
  wordTextCorrect: {color: colors.success},
  wordTextWrong: {color: colors.error},
  wordHeard: {fontSize: fontSize.xs, color: colors.error, marginTop: 2},
  feedbackCard: {
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  feedbackText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    lineHeight: 22,
    textAlign: 'center',
  },
  actions: {gap: spacing.md},
  retryBtn: {
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  retryBtnText: {color: colors.textPrimary, fontSize: fontSize.lg, fontWeight: '700'},
  continueBtn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  continueBtnText: {color: '#fff', fontSize: fontSize.lg, fontWeight: '700'},
});

export default ScoreResultScreen;
