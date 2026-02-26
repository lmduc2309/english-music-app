import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { AttemptResult } from '../stores/practiceStore';

interface Props { result: AttemptResult; attemptNumber: number; }

const getScoreColor = (score: number) => {
  if (score >= 90) return colors.scorePerfect;
  if (score >= 80) return colors.scoreGreat;
  if (score >= 60) return colors.scoreGood;
  return colors.scoreNeedsWork;
};

const getScoreEmoji = (score: number) => {
  if (score >= 95) return '🌟';
  if (score >= 90) return '⭐';
  if (score >= 80) return '👍';
  if (score >= 60) return '💪';
  return '🔄';
};

export default function ScoreCard({ result, attemptNumber }: Props) {
  const { scores, passed, feedback, xpEarned } = result;

  return (
    <View style={styles.container}>
      {/* Overall Score */}
      <View style={[styles.overallCircle, { borderColor: getScoreColor(scores.overall) }]}>
        <Text style={styles.scoreEmoji}>{getScoreEmoji(scores.overall)}</Text>
        <Text style={[styles.overallScore, { color: getScoreColor(scores.overall) }]}>{scores.overall}%</Text>
        <Text style={styles.overallLabel}>{passed ? 'PASSED!' : 'TRY AGAIN'}</Text>
      </View>

      {/* Score Breakdown */}
      <View style={styles.breakdown}>
        <ScoreRow icon="🎵" label="Pitch" value={scores.pitch} />
        <ScoreRow icon="⏱️" label="Timing" value={scores.duration} />
        <ScoreRow icon="🗣️" label="Pronunciation" value={scores.pronunciation} />
      </View>

      {/* XP Earned */}
      {xpEarned > 0 && (
        <View style={styles.xpBadge}>
          <Text style={styles.xpText}>+{xpEarned} XP</Text>
        </View>
      )}

      {/* Feedback */}
      <View style={styles.feedbackSection}>
        {feedback.map((fb, i) => (
          <Text key={i} style={styles.feedbackText}>{fb}</Text>
        ))}
      </View>

      <Text style={styles.attemptInfo}>Attempt #{attemptNumber}</Text>
    </View>
  );
}

function ScoreRow({ icon, label, value }: { icon: string; label: string; value: number }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowIcon}>{icon}</Text>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.barOuter}>
        <View style={[styles.barInner, { width: `${value}%`, backgroundColor: getScoreColor(value) }]} />
      </View>
      <Text style={[styles.rowValue, { color: getScoreColor(value) }]}>{value}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.surface, borderRadius: 20, padding: 24, marginTop: 20, alignItems: 'center' },
  overallCircle: { width: 120, height: 120, borderRadius: 60, borderWidth: 4, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  scoreEmoji: { fontSize: 24 },
  overallScore: { fontSize: 32, fontWeight: '800' },
  overallLabel: { fontSize: 12, fontWeight: '700', color: colors.textMuted },
  breakdown: { width: '100%', gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rowIcon: { fontSize: 16, width: 24 },
  rowLabel: { fontSize: 14, color: colors.textSecondary, width: 100 },
  barOuter: { flex: 1, height: 8, backgroundColor: colors.surfaceLight, borderRadius: 4, overflow: 'hidden' },
  barInner: { height: '100%', borderRadius: 4 },
  rowValue: { fontSize: 14, fontWeight: '700', width: 40, textAlign: 'right' },
  xpBadge: { backgroundColor: colors.accent + '22', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 8, marginTop: 16 },
  xpText: { color: colors.accent, fontSize: 18, fontWeight: '800' },
  feedbackSection: { marginTop: 16, width: '100%', gap: 6 },
  feedbackText: { fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
  attemptInfo: { marginTop: 12, fontSize: 12, color: colors.textMuted },
});
