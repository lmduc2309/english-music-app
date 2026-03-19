import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { COLORS, FONTS, SPACING } from '../../src/utils/theme';
import { useStore } from '../../src/store';
import { Achievement } from '../../src/types';
import { api } from '../../src/services/api';

const icons: Record<string,string> = { streak:'🔥', songs:'🎵', score:'🎯', vocabulary:'📚', xp:'⭐' };

export default function ProfileScreen() {
  const { user, stats, loadStats, logout } = useStore();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  useEffect(() => { loadStats(); api.getAchievements().then(setAchievements).catch(() => {}); }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{user?.displayName?.charAt(0)?.toUpperCase()||'?'}</Text></View>
        <Text style={styles.name}>{user?.displayName}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        {stats?.level && <View style={styles.levelBadge}><Text style={styles.levelText}>Lv.{stats.level.level} {stats.level.title}</Text></View>}
      </View>
      <View style={styles.statsGrid}>
        {[{v:stats?.totalXp||0,l:'Total XP'},{v:`🔥 ${stats?.currentStreak||0}`,l:'Day Streak',c:COLORS.warning},{v:stats?.longestStreak||0,l:'Best Streak'},{v:`${stats?.achievementsUnlocked||0}/${stats?.totalAchievements||0}`,l:'Badges'}].map((s,i) => (
          <View key={i} style={styles.statItem}><Text style={[styles.statValue,s.c?{color:s.c}:null]}>{s.v}</Text><Text style={styles.statLabel}>{s.l}</Text></View>
        ))}
      </View>
      {stats?.level && (
        <View style={styles.section}><Text style={styles.sectionTitle}>Level Progress</Text>
          <View style={styles.xpBar}><View style={[styles.xpFill,{width:`${stats.level.progress}%`}]}/></View>
          <Text style={styles.xpText}>{stats.totalXp} / {stats.level.nextLevelXp} XP</Text>
        </View>
      )}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        {achievements.map(a => (
          <View key={a.id} style={[styles.achRow,!a.unlocked&&{opacity:0.4}]}>
            <Text style={{fontSize:22,width:40,textAlign:'center'}}>{icons[a.category]||'⭐'}</Text>
            <View style={{flex:1}}><Text style={styles.achName}>{a.name}</Text><Text style={styles.achDesc}>{a.description}</Text></View>
            <Text style={[styles.achXp,!a.unlocked&&{color:COLORS.textMuted}]}>+{a.xpReward}</Text>
          </View>
        ))}
      </View>
      <Pressable style={styles.logoutBtn} onPress={async () => { await logout(); router.replace('/login'); }}>
        <Text style={styles.logoutText}>Sign Out</Text>
      </Pressable>
      <View style={{height:SPACING.xxl}}/>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:COLORS.background},
  header:{alignItems:'center',paddingTop:SPACING.xxl,paddingBottom:SPACING.lg},
  avatar:{width:80,height:80,borderRadius:40,backgroundColor:COLORS.primary,justifyContent:'center',alignItems:'center'},
  avatarText:{color:COLORS.text,fontSize:32,fontWeight:'700'},
  name:{color:COLORS.text,fontSize:FONTS.sizes.xl,fontWeight:'700',marginTop:SPACING.md},
  email:{color:COLORS.textMuted,fontSize:FONTS.sizes.sm},
  levelBadge:{backgroundColor:COLORS.primary+'22',borderRadius:20,paddingHorizontal:16,paddingVertical:6,marginTop:SPACING.sm},
  levelText:{color:COLORS.primaryLight,fontWeight:'600',fontSize:FONTS.sizes.sm},
  statsGrid:{flexDirection:'row',flexWrap:'wrap',padding:SPACING.md,gap:SPACING.sm},
  statItem:{width:'47%',backgroundColor:COLORS.card,borderRadius:12,padding:SPACING.md,alignItems:'center',borderWidth:1,borderColor:COLORS.border},
  statValue:{color:COLORS.text,fontSize:FONTS.sizes.xl,fontWeight:'800'},
  statLabel:{color:COLORS.textMuted,fontSize:FONTS.sizes.xs,marginTop:4},
  section:{padding:SPACING.md},
  sectionTitle:{color:COLORS.text,fontSize:FONTS.sizes.lg,fontWeight:'700',marginBottom:SPACING.md},
  xpBar:{height:10,backgroundColor:COLORS.surfaceLight,borderRadius:5,overflow:'hidden'},
  xpFill:{height:'100%',backgroundColor:COLORS.primary,borderRadius:5},
  xpText:{color:COLORS.textMuted,fontSize:FONTS.sizes.xs,marginTop:4,textAlign:'center'},
  achRow:{flexDirection:'row',alignItems:'center',backgroundColor:COLORS.card,borderRadius:12,padding:SPACING.md,marginBottom:SPACING.sm,borderWidth:1,borderColor:COLORS.border},
  achName:{color:COLORS.text,fontWeight:'600',fontSize:FONTS.sizes.md},
  achDesc:{color:COLORS.textMuted,fontSize:FONTS.sizes.xs,marginTop:2},
  achXp:{color:COLORS.warning,fontWeight:'700',fontSize:FONTS.sizes.sm},
  logoutBtn:{margin:SPACING.md,backgroundColor:COLORS.surface,borderRadius:12,padding:SPACING.md,alignItems:'center',borderWidth:1,borderColor:COLORS.danger+'44'},
  logoutText:{color:COLORS.danger,fontWeight:'600'},
});
