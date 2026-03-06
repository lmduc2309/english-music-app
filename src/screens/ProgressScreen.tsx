import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {progressAPI} from '@/services/api';
import {colors, spacing, fontSize, borderRadius, getScoreColor} from '@/theme';
import {UserProgress, UserStats} from '@/types';

const ProgressScreen = ({navigation}: any) => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsRes, progressRes] = await Promise.all([
        progressAPI.getStats(),
        progressAPI.getAll(),
      ]);
      setStats(statsRes.data);
      setProgress(progressRes.data);
    } catch (e) {}
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Progress</Text>

      {/* Stats overview */}
      {stats && (
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.songsCompleted}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.songsInProgress}</Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalAttempts}</Text>
            <Text style={styles.statLabel}>Attempts</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, {color: getScoreColor(stats.averageScore)}]}>
              {Math.round(stats.averageScore)}%
            </Text>
            <Text style={styles.statLabel}>Avg Score</Text>
          </View>
        </View>
      )}

      {/* Song progress list */}
      <Text style={styles.sectionTitle}>Song History</Text>
      {progress.map(item => (
        <TouchableOpacity
          key={item.id}
          style={styles.progressCard}
          onPress={() => navigation.navigate('SongDetail', {songId: item.songId})}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressTitle} numberOfLines={1}>
              {item.song?.title || 'Song'}
            </Text>
            <Text style={styles.progressSubtitle}>
              {item.isCompleted ? 'Completed' : `${item.lastCompletedSentenceIndex + 1} sentences done`}
            </Text>
          </View>
          <View style={styles.progressScore}>
            <Text style={[styles.progressScoreText, {color: getScoreColor(item.bestOverallScore)}]}>
              {Math.round(item.bestOverallScore)}%
            </Text>
            <Text style={styles.progressAttempts}>{item.totalAttempts} tries</Text>
          </View>
        </TouchableOpacity>
      ))}

      {progress.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>\ud83c\udfb5</Text>
          <Text style={styles.emptyText}>No songs practiced yet!</Text>
          <Text style={styles.emptySubtext}>Start singing to see your progress here.</Text>
        </View>
      )}

      <View style={{height: 100}} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.md},
  loading: {flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background},
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '800',
    color: colors.textPrimary,
    paddingTop: spacing.xxl + spacing.md,
    marginBottom: spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  statValue: {fontSize: fontSize.xxl, fontWeight: '800', color: colors.primary},
  statLabel: {fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 4},
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  progressCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    alignItems: 'center',
  },
  progressInfo: {flex: 1},
  progressTitle: {fontSize: fontSize.md, fontWeight: '600', color: colors.textPrimary},
  progressSubtitle: {fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2},
  progressScore: {alignItems: 'flex-end'},
  progressScoreText: {fontSize: fontSize.xl, fontWeight: '800'},
  progressAttempts: {fontSize: fontSize.xs, color: colors.textMuted},
  emptyState: {alignItems: 'center', paddingVertical: spacing.xxl},
  emptyEmoji: {fontSize: 64, marginBottom: spacing.md},
  emptyText: {fontSize: fontSize.xl, fontWeight: '700', color: colors.textPrimary},
  emptySubtext: {fontSize: fontSize.md, color: colors.textSecondary, marginTop: spacing.sm},
});

export default ProgressScreen;
