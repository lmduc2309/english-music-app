import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {leaderboardAPI} from '@/services/api';
import {colors, spacing, fontSize, borderRadius} from '@/theme';
import {LeaderboardEntry} from '@/types';

type Tab = 'global' | 'weekly';

const LeaderboardScreen = () => {
  const [activeTab, setActiveTab] = useState<Tab>('global');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, [activeTab]);

  const loadLeaderboard = async () => {
    setIsLoading(true);
    try {
      const {data} = activeTab === 'global'
        ? await leaderboardAPI.getGlobal(50)
        : await leaderboardAPI.getWeekly(50);
      setEntries(data);
    } catch (e) {}
    setIsLoading(false);
  };

  const getRankEmoji = (rank: number) => {
    if (rank === 1) return '\ud83e\udd47';
    if (rank === 2) return '\ud83e\udd48';
    if (rank === 3) return '\ud83e\udd49';
    return `${rank}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>

      {/* Tab selector */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'global' && styles.tabActive]}
          onPress={() => setActiveTab('global')}>
          <Text style={[styles.tabText, activeTab === 'global' && styles.tabTextActive]}>
            \ud83c\udf0d All Time
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'weekly' && styles.tabActive]}
          onPress={() => setActiveTab('weekly')}>
          <Text style={[styles.tabText, activeTab === 'weekly' && styles.tabTextActive]}>
            \ud83d\udcc5 This Week
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{marginTop: 40}} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {entries.map((entry, idx) => (
            <View
              key={entry.userId}
              style={[
                styles.entryCard,
                idx < 3 && styles.topThreeCard,
              ]}>
              <View style={styles.rankCol}>
                <Text style={[styles.rankText, idx < 3 && styles.topThreeRank]}>
                  {getRankEmoji(entry.rank || idx + 1)}
                </Text>
              </View>
              <View style={styles.userCol}>
                <Text style={styles.username}>{entry.username}</Text>
              </View>
              <View style={styles.scoreCol}>
                <Text style={styles.scoreValue}>
                  {entry.totalXp
                    ? `${entry.totalXp} XP`
                    : `${Math.round(entry.weeklyScore || 0)} pts`}
                </Text>
              </View>
            </View>
          ))}
          {entries.length === 0 && (
            <Text style={styles.emptyText}>No rankings yet. Be the first!</Text>
          )}
          <View style={{height: 100}} />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.md},
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '800',
    color: colors.textPrimary,
    paddingTop: spacing.xxl + spacing.md,
    marginBottom: spacing.md,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: 4,
    marginBottom: spacing.lg,
  },
  tab: {flex: 1, paddingVertical: spacing.md, alignItems: 'center', borderRadius: borderRadius.sm},
  tabActive: {backgroundColor: colors.primary},
  tabText: {color: colors.textSecondary, fontWeight: '600', fontSize: fontSize.md},
  tabTextActive: {color: '#fff'},
  entryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  topThreeCard: {borderWidth: 1, borderColor: colors.primary + '40'},
  rankCol: {width: 44, alignItems: 'center'},
  rankText: {fontSize: fontSize.lg, color: colors.textSecondary, fontWeight: '700'},
  topThreeRank: {fontSize: fontSize.xxl},
  userCol: {flex: 1, marginLeft: spacing.md},
  username: {fontSize: fontSize.md, fontWeight: '600', color: colors.textPrimary},
  scoreCol: {alignItems: 'flex-end'},
  scoreValue: {fontSize: fontSize.md, fontWeight: '800', color: colors.primary},
  emptyText: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: fontSize.md,
    marginTop: spacing.xxl,
  },
});

export default LeaderboardScreen;
