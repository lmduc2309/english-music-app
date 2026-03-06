import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {useAuthStore} from '@/store/authStore';
import {achievementsAPI} from '@/services/api';
import {colors, spacing, fontSize, borderRadius, getLevelColor} from '@/theme';
import {Achievement} from '@/types';

const ProfileScreen = () => {
  const {user, logout} = useAuthStore();
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      const {data} = await achievementsAPI.getMine();
      setAchievements(data.map((ua: any) => ({...ua.achievement, unlockedAt: ua.unlockedAt})));
    } catch (e) {}
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Logout', style: 'destructive', onPress: logout},
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.username?.charAt(0)?.toUpperCase() || '?'}
          </Text>
        </View>
        <Text style={styles.username}>{user?.username}</Text>
        <Text style={styles.email}>{user?.email}</Text>

        <View style={[styles.levelPill, {backgroundColor: getLevelColor(user?.currentLevel || 'A1')}]}>
          <Text style={styles.levelPillText}>Level {user?.currentLevel}</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{user?.totalXp || 0}</Text>
          <Text style={styles.statLabel}>Total XP</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>\ud83d\udd25 {user?.currentStreak || 0}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{user?.songsCompleted || 0}</Text>
          <Text style={styles.statLabel}>Songs Done</Text>
        </View>
      </View>

      {/* Achievements */}
      <Text style={styles.sectionTitle}>Achievements</Text>
      {achievements.length > 0 ? (
        achievements.map(a => (
          <View key={a.id} style={styles.achievementCard}>
            <Text style={styles.achievementIcon}>\ud83c\udfc6</Text>
            <View style={styles.achievementInfo}>
              <Text style={styles.achievementName}>{a.name}</Text>
              <Text style={styles.achievementDesc}>{a.description}</Text>
            </View>
            <Text style={styles.achievementXp}>+{a.xpReward} XP</Text>
          </View>
        ))
      ) : (
        <View style={styles.emptyAchievements}>
          <Text style={styles.emptyText}>No achievements yet. Keep singing!</Text>
        </View>
      )}

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <View style={{height: 100}} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.md},
  header: {
    alignItems: 'center',
    paddingTop: spacing.xxl + spacing.xl,
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {fontSize: fontSize.title, fontWeight: '800', color: '#fff'},
  username: {fontSize: fontSize.xxl, fontWeight: '800', color: colors.textPrimary},
  email: {fontSize: fontSize.md, color: colors.textSecondary, marginTop: 4},
  levelPill: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginTop: spacing.md,
  },
  levelPillText: {color: '#fff', fontWeight: '800', fontSize: fontSize.md},
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  statValue: {fontSize: fontSize.xl, fontWeight: '800', color: colors.primary},
  statLabel: {fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 4},
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  achievementIcon: {fontSize: 32, marginRight: spacing.md},
  achievementInfo: {flex: 1},
  achievementName: {fontSize: fontSize.md, fontWeight: '700', color: colors.textPrimary},
  achievementDesc: {fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2},
  achievementXp: {fontSize: fontSize.sm, fontWeight: '700', color: colors.warning},
  emptyAchievements: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {color: colors.textSecondary, fontSize: fontSize.md},
  logoutBtn: {
    backgroundColor: colors.error + '20',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  logoutText: {color: colors.error, fontWeight: '700', fontSize: fontSize.md},
});

export default ProfileScreen;
