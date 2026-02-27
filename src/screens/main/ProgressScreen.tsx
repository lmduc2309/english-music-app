import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { progressAPI } from '../../api/progress';
import { colors, levelColors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProgressScreen() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    progressAPI.getUserProgress().then(r => setData(r.data)).catch(() => {});
  }, []);

  if (!data) return <View style={styles.container} />;

  const { profile, weeklyStats, songProgresses } = data;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={[typography.h2, { padding: 20, paddingBottom: 8 }]}>Your Progress</Text>

        <View style={styles.levelCard}>
          <View style={[styles.levelBadge, { backgroundColor: levelColors[profile.level] }]}>
            <Text style={styles.levelText}>{profile.level}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={typography.h3}>{profile.totalXP} XP</Text>
            <Text style={typography.bodySmall}>Level {profile.level} Singer</Text>
          </View>
          <View style={styles.streakBox}>
            <Text style={styles.streakIcon}>🔥</Text>
            <Text style={styles.streakVal}>{profile.currentStreak}</Text>
            <Text style={styles.streakLabel}>streak</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <StatBox icon="🎵" value={profile.songsCompleted} label="Songs" />
          <StatBox icon="💬" value={profile.sentencesPracticed} label="Sentences" />
          <StatBox icon="⭐" value={`${profile.averageScore}%`} label="Avg Score" />
          <StatBox icon="🏆" value={profile.longestStreak} label="Best Streak" />
        </View>

        <View style={styles.weeklyCard}>
          <Text style={[typography.h3, { marginBottom: 12 }]}>This Week</Text>
          <View style={styles.weeklyRow}>
            <View style={styles.weeklyItem}>
              <Text style={styles.weeklyVal}>{weeklyStats.sentencesPassed}</Text>
              <Text style={styles.weeklyLabel}>Passed</Text>
            </View>
            <View style={styles.weeklyItem}>
              <Text style={styles.weeklyVal}>{weeklyStats.averageScore}%</Text>
              <Text style={styles.weeklyLabel}>Avg Score</Text>
            </View>
            <View style={styles.weeklyItem}>
              <Text style={styles.weeklyVal}>{weeklyStats.xpEarned}</Text>
              <Text style={styles.weeklyLabel}>XP</Text>
            </View>
          </View>
        </View>

        <Text style={[typography.h3, { paddingHorizontal: 20, marginTop: 20, marginBottom: 12 }]}>Song Progress</Text>
        {songProgresses?.map((sp: any) => {
          const song = sp.songId;
          if (!song) return null;
          const pct = song.totalSentences > 0 ? Math.round((sp.completedSentences.length / song.totalSentences) * 100) : 0;
          return (
            <View key={sp._id} style={styles.songProgressCard}>
              <View style={{ flex: 1 }}>
                <Text style={typography.body}>{song.title}</Text>
                <Text style={typography.caption}>{song.artist}</Text>
              </View>
              <View style={styles.miniProgress}>
                <View style={styles.miniBar}>
                  <View style={[styles.miniFill, { width: `${pct}%` }]} />
                </View>
                <Text style={styles.miniPct}>{pct}%</Text>
              </View>
            </View>
          );
        })}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function StatBox({ icon, value, label }: { icon: string; value: any; label: string }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  levelCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 16, padding: 16, marginHorizontal: 20, gap: 14 },
  levelBadge: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  levelText: { color: '#FFF', fontSize: 22, fontWeight: '800' },
  streakBox: { alignItems: 'center' },
  streakIcon: { fontSize: 24 },
  streakVal: { fontSize: 20, fontWeight: '800', color: colors.warning },
  streakLabel: { fontSize: 11, color: colors.textMuted },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, marginTop: 16, gap: 8 },
  statBox: { width: '48%', backgroundColor: colors.surface, borderRadius: 14, padding: 16, alignItems: 'center' },
  statIcon: { fontSize: 24, marginBottom: 4 },
  statValue: { fontSize: 22, fontWeight: '700', color: colors.text },
  statLabel: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  weeklyCard: { backgroundColor: colors.surface, borderRadius: 16, padding: 20, marginHorizontal: 20, marginTop: 16 },
  weeklyRow: { flexDirection: 'row', justifyContent: 'space-around' },
  weeklyItem: { alignItems: 'center' },
  weeklyVal: { fontSize: 22, fontWeight: '700', color: colors.primary },
  weeklyLabel: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
  songProgressCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 12, marginHorizontal: 20, marginBottom: 8, padding: 14 },
  miniProgress: { alignItems: 'flex-end', width: 80 },
  miniBar: { width: 60, height: 6, backgroundColor: colors.surfaceLight, borderRadius: 3, overflow: 'hidden' },
  miniFill: { height: '100%', backgroundColor: colors.accent, borderRadius: 3 },
  miniPct: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
});
