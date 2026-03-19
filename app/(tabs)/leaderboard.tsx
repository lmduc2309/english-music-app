import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { COLORS, FONTS, SPACING } from '../../src/utils/theme';
import { LeaderboardEntry } from '../../src/types';
import { api } from '../../src/services/api';

export default function LeaderboardScreen() {
  const [tab, setTab] = useState<'global'|'weekly'>('global');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [myRank, setMyRank] = useState<LeaderboardEntry|null>(null);

  useEffect(() => { load(); }, [tab]);
  const load = async () => { try { const data = tab==='global' ? await api.getGlobalLeaderboard(50) : await api.getWeeklyLeaderboard(50); setEntries(data); const me = await api.getMyRank(); setMyRank(me); } catch {} };

  const medals = ['🥇','🥈','🥉'];
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏆 Leaderboard</Text>
      <View style={styles.tabs}>
        {(['global','weekly'] as const).map(t => (
          <Pressable key={t} style={[styles.tab, tab===t && styles.tabActive]} onPress={() => setTab(t)}>
            <Text style={[styles.tabText, tab===t && styles.tabTextActive]}>{t==='global' ? 'All Time' : 'This Week'}</Text>
          </Pressable>
        ))}
      </View>
      {myRank && <View style={styles.myRank}><Text style={styles.myRankLabel}>Your Rank</Text><Text style={styles.myRankValue}>#{myRank.rank}</Text></View>}
      <FlatList data={entries} keyExtractor={i => i.userId} renderItem={({ item }) => (
        <View style={[styles.row, item.rank <= 3 && styles.topRow]}>
          <Text style={[styles.rank, item.rank <= 3 && { fontSize: 22 }]}>{item.rank <= 3 ? medals[item.rank-1] : `#${item.rank}`}</Text>
          <View style={styles.avatar}><Text style={styles.avatarText}>{item.displayName?.charAt(0)?.toUpperCase()}</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{item.displayName}</Text>
            {(item.currentStreak ?? 0) > 0 && <Text style={styles.streak}>🔥 {item.currentStreak} days</Text>}
          </View>
          <Text style={styles.xp}>{item.totalXp.toLocaleString()} XP</Text>
        </View>
      )} contentContainerStyle={{ paddingBottom: SPACING.xxl }} />
    </View>
  );
}
const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:COLORS.background,padding:SPACING.md},
  title:{color:COLORS.text,fontSize:FONTS.sizes.xxl,fontWeight:'800',textAlign:'center',marginTop:SPACING.xl},
  tabs:{flexDirection:'row',gap:SPACING.sm,marginVertical:SPACING.md},
  tab:{flex:1,padding:10,borderRadius:10,alignItems:'center',backgroundColor:COLORS.surface},
  tabActive:{backgroundColor:COLORS.primary+'33'},tabText:{color:COLORS.textMuted,fontWeight:'600'},tabTextActive:{color:COLORS.primary},
  myRank:{backgroundColor:COLORS.primary+'22',borderRadius:12,padding:SPACING.md,flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:SPACING.md},
  myRankLabel:{color:COLORS.primaryLight,fontWeight:'600'},myRankValue:{color:COLORS.primary,fontSize:FONTS.sizes.xl,fontWeight:'800'},
  row:{flexDirection:'row',alignItems:'center',backgroundColor:COLORS.card,borderRadius:12,padding:SPACING.md,marginBottom:SPACING.sm,borderWidth:1,borderColor:COLORS.border},
  topRow:{borderColor:COLORS.warning+'44'},
  rank:{color:COLORS.textMuted,fontSize:FONTS.sizes.md,fontWeight:'700',width:40},
  avatar:{width:36,height:36,borderRadius:18,backgroundColor:COLORS.surfaceLight,justifyContent:'center',alignItems:'center',marginRight:SPACING.sm},
  avatarText:{color:COLORS.text,fontWeight:'700'},
  name:{color:COLORS.text,fontWeight:'600',fontSize:FONTS.sizes.md},
  streak:{color:COLORS.warning,fontSize:FONTS.sizes.xs},
  xp:{color:COLORS.primaryLight,fontWeight:'700',fontSize:FONTS.sizes.md},
});
