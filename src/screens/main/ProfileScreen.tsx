import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../stores/authStore';
import { colors, levelColors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  if (!user) return null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={[typography.h2, { padding: 20, paddingBottom: 16 }]}>Profile</Text>

        {/* Avatar & Name */}
        <View style={styles.avatarSection}>
          <View style={[styles.avatar, { backgroundColor: levelColors[user.currentLevel] }]}>
            <Text style={styles.avatarText}>{user.displayName.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={[typography.h2, { marginTop: 12 }]}>{user.displayName}</Text>
          <Text style={typography.bodySmall}>@{user.username}</Text>
          <View style={[styles.levelBadge, { backgroundColor: levelColors[user.currentLevel] + '33' }]}>
            <Text style={[styles.levelBadgeText, { color: levelColors[user.currentLevel] }]}>Level {user.currentLevel}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statRow}>
            <Text style={styles.statIcon}>⭐</Text>
            <Text style={styles.statLabel}>Total XP</Text>
            <Text style={styles.statVal}>{user.totalXP}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statRow}>
            <Text style={styles.statIcon}>🔥</Text>
            <Text style={styles.statLabel}>Current Streak</Text>
            <Text style={styles.statVal}>{user.currentStreak} days</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statRow}>
            <Text style={styles.statIcon}>🎵</Text>
            <Text style={styles.statLabel}>Songs Completed</Text>
            <Text style={styles.statVal}>{user.songsCompleted}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statRow}>
            <Text style={styles.statIcon}>🎯</Text>
            <Text style={styles.statLabel}>Average Score</Text>
            <Text style={styles.statVal}>{user.averageScore}%</Text>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.settingsCard}>
          <TouchableOpacity style={styles.settingRow}>
            <Ionicons name="notifications-outline" size={22} color={colors.textSecondary} />
            <Text style={styles.settingText}>Notifications</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.settingRow}>
            <Ionicons name="language-outline" size={22} color={colors.textSecondary} />
            <Text style={styles.settingText}>Language</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.settingRow}>
            <Ionicons name="help-circle-outline" size={22} color={colors.textSecondary} />
            <Text style={styles.settingText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color={colors.error} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <View style={{ height: 48 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  avatarSection: { alignItems: 'center', paddingVertical: 16 },
  avatar: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 36, fontWeight: '800', color: '#FFF' },
  levelBadge: { borderRadius: 12, paddingHorizontal: 14, paddingVertical: 4, marginTop: 8 },
  levelBadgeText: { fontWeight: '700', fontSize: 14 },
  statsCard: { backgroundColor: colors.surface, borderRadius: 16, marginHorizontal: 20, padding: 16, marginTop: 16 },
  statRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  statIcon: { fontSize: 20, width: 32 },
  statLabel: { flex: 1, fontSize: 15, color: colors.textSecondary },
  statVal: { fontSize: 16, fontWeight: '700', color: colors.text },
  divider: { height: 1, backgroundColor: colors.border },
  settingsCard: { backgroundColor: colors.surface, borderRadius: 16, marginHorizontal: 20, padding: 16, marginTop: 16 },
  settingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 12 },
  settingText: { flex: 1, fontSize: 15, color: colors.textSecondary },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 24, padding: 16 },
  logoutText: { color: colors.error, fontSize: 16, fontWeight: '600' },
});
