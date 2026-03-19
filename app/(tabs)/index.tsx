import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { useStore } from '../../src/store';
import { CefrLevel } from '../../src/types';
import { COLORS, FONTS, SPACING, LEVEL_NAMES } from '../../src/utils/theme';
import SongCard from '../../src/components/SongCard';

const LEVELS = Object.values(CefrLevel);

export default function HomeScreen() {
  const { user, stats, loadStats, songs, loadSongs } = useStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { loadStats(); loadSongs(); }, []);

  const onRefresh = async () => { setRefreshing(true); await Promise.all([loadStats(), loadSongs()]); setRefreshing(false); };

  return (
    <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.displayName?.split(' ')[0]} 👋</Text>
          <Text style={styles.sub}>Ready to sing and learn?</Text>
        </View>
        <Pressable style={styles.streakBadge} onPress={() => router.push('/(tabs)/profile')}>
          <Text style={{ fontSize: 18 }}>🔥</Text>
          <Text style={styles.streakCount}>{stats?.currentStreak || 0}</Text>
        </Pressable>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}><Text style={styles.statValue}>{stats?.totalXp || 0}</Text><Text style={styles.statLabel}>Total XP</Text></View>
        <View style={[styles.statCard, { backgroundColor: COLORS.primary + '22' }]}><Text style={[styles.statValue, { color: COLORS.primary }]}>{stats?.level?.level || 1}</Text><Text style={styles.statLabel}>{stats?.level?.title || 'Beginner'}</Text></View>
        <View style={styles.statCard}><Text style={styles.statValue}>{stats?.achievementsUnlocked || 0}/{stats?.totalAchievements || 0}</Text><Text style={styles.statLabel}>Badges</Text></View>
      </View>

      {stats?.level && (
        <View style={styles.xpBarWrap}>
          <View style={styles.xpBarBg}><View style={[styles.xpBarFill, { width: `${stats.level.progress}%` }]} /></View>
          <Text style={styles.xpText}>{stats.totalXp} / {stats.level.nextLevelXp} XP to next level</Text>
        </View>
      )}

      <Text style={styles.section}>Choose your level</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: SPACING.lg }}>
        {LEVELS.map((level) => (
          <Pressable key={level} style={[styles.levelCard, { borderColor: COLORS[level] + '66' }]}
            onPress={() => router.push({ pathname: '/song/list', params: { level } })}>
            <Text style={[styles.levelCode, { color: COLORS[level] }]}>{level}</Text>
            <Text style={styles.levelName}>{LEVEL_NAMES[level]}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <Text style={styles.section}>Popular songs</Text>
      {songs.slice(0, 5).map((song) => (
        <SongCard key={song.id} song={song} onPress={() => router.push(`/song/${song.id}`)} />
      ))}

      <View style={styles.quickRow}>
        <Pressable style={[styles.quickBtn, { backgroundColor: COLORS.secondary + '22' }]} onPress={() => router.push('/(tabs)/vocabulary')}>
          <Text style={{ fontSize: 28 }}>📚</Text><Text style={[styles.quickText, { color: COLORS.secondary }]}>Review Words</Text>
        </Pressable>
        <Pressable style={[styles.quickBtn, { backgroundColor: COLORS.accent + '22' }]} onPress={() => router.push('/(tabs)/leaderboard')}>
          <Text style={{ fontSize: 28 }}>🏆</Text><Text style={[styles.quickText, { color: COLORS.accent }]}>Leaderboard</Text>
        </Pressable>
      </View>
      <View style={{ height: SPACING.xxl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: SPACING.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: SPACING.xl, marginBottom: SPACING.lg },
  greeting: { color: COLORS.text, fontSize: FONTS.sizes.xl, fontWeight: '700' },
  sub: { color: COLORS.textSecondary, fontSize: FONTS.sizes.sm, marginTop: 2 },
  streakBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: COLORS.warning + '44' },
  streakCount: { color: COLORS.warning, fontWeight: '700', fontSize: FONTS.sizes.md, marginLeft: 4 },
  statsRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  statCard: { flex: 1, backgroundColor: COLORS.card, borderRadius: 12, padding: SPACING.md, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  statValue: { color: COLORS.text, fontSize: FONTS.sizes.xl, fontWeight: '800' },
  statLabel: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs, marginTop: 4 },
  xpBarWrap: { marginBottom: SPACING.lg },
  xpBarBg: { height: 8, backgroundColor: COLORS.surfaceLight, borderRadius: 4, overflow: 'hidden' },
  xpBarFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 4 },
  xpText: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs, marginTop: 4, textAlign: 'center' },
  section: { color: COLORS.text, fontSize: FONTS.sizes.lg, fontWeight: '700', marginBottom: SPACING.md, marginTop: SPACING.sm },
  levelCard: { backgroundColor: COLORS.card, borderRadius: 12, paddingHorizontal: 20, paddingVertical: 14, marginRight: SPACING.sm, borderWidth: 1, alignItems: 'center', minWidth: 100 },
  levelCode: { fontSize: FONTS.sizes.xl, fontWeight: '800' },
  levelName: { color: COLORS.textSecondary, fontSize: FONTS.sizes.xs, marginTop: 4 },
  quickRow: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.md },
  quickBtn: { flex: 1, borderRadius: 12, padding: SPACING.md, alignItems: 'center' },
  quickText: { fontWeight: '600', fontSize: FONTS.sizes.sm, marginTop: 4 },
});
