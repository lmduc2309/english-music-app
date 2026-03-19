import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SPACING } from '../utils/theme';
import { useStore } from '../store';
import { Achievement } from '../types';
import { api } from '../services/api';

const ProfileScreen = ({ navigation }: any) => {
  const { user, stats, loadStats, logout } = useStore();
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => { loadStats(); api.getAchievements().then(setAchievements).catch(() => {}); }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{user?.displayName?.charAt(0)?.toUpperCase() || '?'}</Text></View>
        <Text style={styles.name}>{user?.displayName}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        {stats?.level && <View style={styles.levelBadge}><Text style={styles.levelText}>Lv.{stats.level.level} {stats.level.title}</Text></View>}
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statItem}><Text style={styles.statValue}>{stats?.totalXp || 0}</Text><Text style={styles.statLabel}>Total XP</Text></View>
        <View style={styles.statItem}><Text style={[styles.statValue, { color: COLORS.warning }]}>🔥 {stats?.currentStreak || 0}</Text><Text style={styles.statLabel}>Day Streak</Text></View>
        <View style={styles.statItem}><Text style={styles.statValue}>{stats?.longestStreak || 0}</Text><Text style={styles.statLabel}>Best Streak</Text></View>
        <View style={styles.statItem}><Text style={styles.statValue}>{stats?.achievementsUnlocked || 0}/{stats?.totalAchievements || 0}</Text><Text style={styles.statLabel}>Badges</Text></View>
      </View>

      {stats?.level && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Level Progress</Text>
          <View style={styles.xpBar}><View style={[styles.xpFill, { width: `${stats.level.progress}%` }]} /></View>
          <Text style={styles.xpText}>{stats.totalXp} / {stats.level.nextLevelXp} XP</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        {achievements.map((a) => (
          <View key={a.id} style={[styles.achievementRow, !a.unlocked && styles.achievementLocked]}>
            <View style={styles.achievementIcon}>
              <Text style={{ fontSize: 22, opacity: a.unlocked ? 1 : 0.3 }}>
                {a.category === 'streak' ? '🔥' : a.category === 'songs' ? '🎵' : a.category === 'score' ? '🎯' : a.category === 'vocabulary' ? '📚' : '⭐'}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.achievementName, !a.unlocked && { color: COLORS.textMuted }]}>{a.name}</Text>
              <Text style={styles.achievementDesc}>{a.description}</Text>
            </View>
            <Text style={[styles.achievementXp, !a.unlocked && { color: COLORS.textMuted }]}>+{a.xpReward} XP</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={logout}><Text style={styles.logoutText}>Sign Out</Text></TouchableOpacity>
      <View style={{ height: SPACING.xxl }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { alignItems: 'center', paddingTop: SPACING.xxl, paddingBottom: SPACING.lg },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: COLORS.text, fontSize: 32, fontWeight: '700' },
  name: { color: COLORS.text, fontSize: FONTS.sizes.xl, fontWeight: '700', marginTop: SPACING.md },
  email: { color: COLORS.textMuted, fontSize: FONTS.sizes.sm },
  levelBadge: { backgroundColor: COLORS.primary + '22', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 6, marginTop: SPACING.sm },
  levelText: { color: COLORS.primaryLight, fontWeight: '600', fontSize: FONTS.sizes.sm },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: SPACING.md, gap: SPACING.sm },
  statItem: { flex: 1, minWidth: '45%', backgroundColor: COLORS.card, borderRadius: 12, padding: SPACING.md, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  statValue: { color: COLORS.text, fontSize: FONTS.sizes.xl, fontWeight: '800' },
  statLabel: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs, marginTop: 4 },
  section: { padding: SPACING.md },
  sectionTitle: { color: COLORS.text, fontSize: FONTS.sizes.lg, fontWeight: '700', marginBottom: SPACING.md },
  xpBar: { height: 10, backgroundColor: COLORS.surfaceLight, borderRadius: 5, overflow: 'hidden' },
  xpFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 5 },
  xpText: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs, marginTop: 4, textAlign: 'center' },
  achievementRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderRadius: 12, padding: SPACING.md, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  achievementLocked: { opacity: 0.5 },
  achievementIcon: { width: 40, alignItems: 'center' },
  achievementName: { color: COLORS.text, fontWeight: '600', fontSize: FONTS.sizes.md },
  achievementDesc: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs, marginTop: 2 },
  achievementXp: { color: COLORS.warning, fontWeight: '700', fontSize: FONTS.sizes.sm },
  logoutBtn: { margin: SPACING.md, backgroundColor: COLORS.surface, borderRadius: 12, padding: SPACING.md, alignItems: 'center', borderWidth: 1, borderColor: COLORS.danger + '44' },
  logoutText: { color: COLORS.danger, fontWeight: '600' },
});
export default ProfileScreen;
