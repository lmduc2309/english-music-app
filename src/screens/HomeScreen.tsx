import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { COLORS, FONTS, SPACING, LEVEL_NAMES } from '../utils/theme';
import { useStore } from '../store';
import { CefrLevel, Song } from '../types';
import SongCard from '../components/SongCard';

const LEVELS = Object.values(CefrLevel);

const HomeScreen = ({ navigation }: any) => {
  const { user, stats, loadStats, songs, loadSongs } = useStore();
  const [refreshing, setRefreshing] = useState(false);
  const [recentSongs, setRecentSongs] = useState<Song[]>([]);

  useEffect(() => { loadStats(); loadSongs(); }, []);
  useEffect(() => { if (songs.length > 0) setRecentSongs(songs.slice(0, 5)); }, [songs]);

  const onRefresh = async () => { setRefreshing(true); await Promise.all([loadStats(), loadSongs()]); setRefreshing(false); };

  return (
    <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.displayName?.split(' ')[0]} 👋</Text>
          <Text style={styles.subGreeting}>Ready to sing and learn?</Text>
        </View>
        <TouchableOpacity style={styles.streakBadge} onPress={() => navigation.navigate('ProfileTab')}>
          <Text style={{ fontSize: 18 }}>🔥</Text>
          <Text style={styles.streakCount}>{stats?.currentStreak || 0}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}><Text style={styles.statValue}>{stats?.totalXp || 0}</Text><Text style={styles.statLabel}>Total XP</Text></View>
        <View style={[styles.statCard, { backgroundColor: COLORS.primary + '22' }]}><Text style={[styles.statValue, { color: COLORS.primary }]}>{stats?.level?.level || 1}</Text><Text style={styles.statLabel}>{stats?.level?.title || 'Beginner'}</Text></View>
        <View style={styles.statCard}><Text style={styles.statValue}>{stats?.achievementsUnlocked || 0}/{stats?.totalAchievements || 0}</Text><Text style={styles.statLabel}>Badges</Text></View>
      </View>

      {stats?.level && (
        <View style={styles.xpBarContainer}>
          <View style={styles.xpBarBg}><View style={[styles.xpBarFill, { width: `${stats.level.progress}%` }]} /></View>
          <Text style={styles.xpText}>{stats.totalXp} / {stats.level.nextLevelXp} XP to next level</Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>Choose your level</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.levelScroll}>
        {LEVELS.map((level) => (
          <TouchableOpacity key={level} style={[styles.levelCard, { borderColor: COLORS[level] + '66' }]} onPress={() => navigation.navigate('SongList', { level })}>
            <Text style={[styles.levelCode, { color: COLORS[level] }]}>{level}</Text>
            <Text style={styles.levelName}>{LEVEL_NAMES[level]}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Popular songs</Text>
      {recentSongs.map((song) => (<SongCard key={song.id} song={song} onPress={() => navigation.navigate('SongDetail', { songId: song.id })} />))}

      <View style={styles.quickActions}>
        <TouchableOpacity style={[styles.quickBtn, { backgroundColor: COLORS.secondary + '22' }]} onPress={() => navigation.navigate('VocabularyTab')}>
          <Text style={{ fontSize: 28, marginBottom: 4 }}>📚</Text><Text style={[styles.quickBtnText, { color: COLORS.secondary }]}>Review Words</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.quickBtn, { backgroundColor: COLORS.accent + '22' }]} onPress={() => navigation.navigate('LeaderboardTab')}>
          <Text style={{ fontSize: 28, marginBottom: 4 }}>🏆</Text><Text style={[styles.quickBtnText, { color: COLORS.accent }]}>Leaderboard</Text>
        </TouchableOpacity>
      </View>
      <View style={{ height: SPACING.xxl }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: SPACING.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: SPACING.xl, marginBottom: SPACING.lg },
  greeting: { color: COLORS.text, fontSize: FONTS.sizes.xl, fontWeight: '700' },
  subGreeting: { color: COLORS.textSecondary, fontSize: FONTS.sizes.sm, marginTop: 2 },
  streakBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: COLORS.warning + '44' },
  streakCount: { color: COLORS.warning, fontWeight: '700', fontSize: FONTS.sizes.md, marginLeft: 4 },
  statsRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  statCard: { flex: 1, backgroundColor: COLORS.card, borderRadius: 12, padding: SPACING.md, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  statValue: { color: COLORS.text, fontSize: FONTS.sizes.xl, fontWeight: '800' },
  statLabel: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs, marginTop: 4 },
  xpBarContainer: { marginBottom: SPACING.lg },
  xpBarBg: { height: 8, backgroundColor: COLORS.surfaceLight, borderRadius: 4, overflow: 'hidden' },
  xpBarFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 4 },
  xpText: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs, marginTop: 4, textAlign: 'center' },
  sectionTitle: { color: COLORS.text, fontSize: FONTS.sizes.lg, fontWeight: '700', marginBottom: SPACING.md, marginTop: SPACING.sm },
  levelScroll: { marginBottom: SPACING.lg },
  levelCard: { backgroundColor: COLORS.card, borderRadius: 12, paddingHorizontal: 20, paddingVertical: 14, marginRight: SPACING.sm, borderWidth: 1, alignItems: 'center', minWidth: 100 },
  levelCode: { fontSize: FONTS.sizes.xl, fontWeight: '800' },
  levelName: { color: COLORS.textSecondary, fontSize: FONTS.sizes.xs, marginTop: 4 },
  quickActions: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.md },
  quickBtn: { flex: 1, borderRadius: 12, padding: SPACING.md, alignItems: 'center' },
  quickBtnText: { fontWeight: '600', fontSize: FONTS.sizes.sm },
});
export default HomeScreen;
