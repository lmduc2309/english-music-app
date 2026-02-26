import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { leaderboardAPI } from '../../api/leaderboard';
import { colors, levelColors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../stores/authStore';

export default function LeaderboardScreen() {
  const { user } = useAuthStore();
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [myRank, setMyRank] = useState<any>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const fetchData = async (level?: string | null) => {
    try {
      if (level) {
        const { data } = await leaderboardAPI.getByLevel(level);
        setLeaderboard(data.leaderboard);
      } else {
        const { data } = await leaderboardAPI.getGlobal();
        setLeaderboard(data.leaderboard);
      }
      const { data: rankData } = await leaderboardAPI.getMyRank();
      setMyRank(rankData);
    } catch {}
  };

  useEffect(() => { fetchData(selectedLevel); }, [selectedLevel]);

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={[typography.h2, { padding: 20, paddingBottom: 8 }]}>Leaderboard</Text>

      {/* Level Filter */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterChip, !selectedLevel && styles.filterActive]}
          onPress={() => setSelectedLevel(null)}
        >
          <Text style={[styles.filterText, !selectedLevel && styles.filterTextActive]}>Global</Text>
        </TouchableOpacity>
        {['A1','A2','B1','B2','C1','C2'].map(lvl => (
          <TouchableOpacity
            key={lvl}
            style={[styles.filterChip, selectedLevel === lvl && { backgroundColor: levelColors[lvl] + '33', borderColor: levelColors[lvl] }]}
            onPress={() => setSelectedLevel(lvl)}
          >
            <Text style={[styles.filterText, selectedLevel === lvl && { color: levelColors[lvl] }]}>{lvl}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* My Rank Card */}
      {myRank && (
        <View style={styles.myRankCard}>
          <Text style={styles.myRankLabel}>Your Rank</Text>
          <Text style={styles.myRankValue}>#{selectedLevel ? myRank.levelRank : myRank.globalRank}</Text>
          <Text style={styles.myRankXP}>{myRank.totalXP} XP</Text>
        </View>
      )}

      {/* Leaderboard List */}
      <FlatList
        data={leaderboard}
        keyExtractor={(item) => item._id || item.rank?.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={[styles.row, item.username === user?.username && styles.myRow]}>
            <Text style={styles.rank}>{item.rank <= 3 ? medals[item.rank - 1] : `#${item.rank}`}</Text>
            <View style={styles.userInfo}>
              <Text style={typography.body}>{item.displayName}</Text>
              <Text style={typography.caption}>@{item.username}</Text>
            </View>
            <View style={styles.xpCol}>
              <Text style={styles.xpValue}>{item.totalXP}</Text>
              <Text style={styles.xpLabel}>XP</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  filterRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 6, marginBottom: 12, flexWrap: 'wrap' },
  filterChip: { borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6 },
  filterActive: { backgroundColor: colors.primary + '33', borderColor: colors.primary },
  filterText: { color: colors.textMuted, fontSize: 13, fontWeight: '600' },
  filterTextActive: { color: colors.primary },
  myRankCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary + '22', borderRadius: 14, marginHorizontal: 20, padding: 16, gap: 16, marginBottom: 12 },
  myRankLabel: { color: colors.textSecondary, fontSize: 13 },
  myRankValue: { fontSize: 28, fontWeight: '800', color: colors.primary },
  myRankXP: { fontSize: 16, color: colors.textSecondary, marginLeft: 'auto' },
  list: { paddingHorizontal: 20, paddingBottom: 32 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 12, padding: 14, marginBottom: 8 },
  myRow: { borderWidth: 1, borderColor: colors.primary },
  rank: { fontSize: 20, fontWeight: '700', color: colors.textSecondary, width: 44, textAlign: 'center' },
  userInfo: { flex: 1, marginLeft: 8 },
  xpCol: { alignItems: 'flex-end' },
  xpValue: { fontSize: 18, fontWeight: '700', color: colors.primary },
  xpLabel: { fontSize: 11, color: colors.textMuted },
});
