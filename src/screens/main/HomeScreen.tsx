import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuthStore } from '../../stores/authStore';
import { songsAPI } from '../../api/songs';
import { practiceAPI } from '../../api/practice';
import { colors, levelColors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen({ navigation }: any) {
  const { user } = useAuthStore();
  const [featuredSongs, setFeaturedSongs] = useState<any[]>([]);
  const [dailyStats, setDailyStats] = useState<any>(null);

  useEffect(() => {
    songsAPI.getSongs({ level: user?.currentLevel, limit: 5 }).then(r => setFeaturedSongs(r.data.songs)).catch(() => {});
    practiceAPI.getDailyStats().then(r => setDailyStats(r.data)).catch(() => {});
  }, []);

  const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={typography.bodySmall}>Welcome back,</Text>
            <Text style={typography.h2}>{user?.displayName || 'Singer'} 🎵</Text>
          </View>
          <View style={styles.streakBadge}>
            <Text style={styles.streakEmoji}>🔥</Text>
            <Text style={styles.streakText}>{user?.currentStreak || 0}</Text>
          </View>
        </View>

        <View style={styles.dailyCard}>
          <Text style={[typography.h3, { marginBottom: 12 }]}>Today's Practice</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{dailyStats?.sentencesPassed || 0}</Text>
              <Text style={styles.statLabel}>Sentences</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{dailyStats?.averageScore || 0}%</Text>
              <Text style={styles.statLabel}>Avg Score</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{dailyStats?.xpEarned || 0}</Text>
              <Text style={styles.statLabel}>XP Earned</Text>
            </View>
          </View>
        </View>

        <Text style={[typography.h3, { marginTop: 24, marginBottom: 12, paddingHorizontal: 20 }]}>Choose Level</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.levelRow}>
          {levels.map(level => (
            <TouchableOpacity
              key={level}
              style={[styles.levelChip, { backgroundColor: levelColors[level] + '22', borderColor: levelColors[level] }]}
              onPress={() => navigation.navigate('SongList', { level })}
            >
              <Text style={[styles.levelChipText, { color: levelColors[level] }]}>{level}</Text>
              {user?.currentLevel === level && <View style={[styles.currentDot, { backgroundColor: levelColors[level] }]} />}
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={[typography.h3, { marginTop: 24, marginBottom: 12, paddingHorizontal: 20 }]}>Recommended for You</Text>
        {featuredSongs.map((song: any) => (
          <TouchableOpacity key={song._id} style={styles.songCard} onPress={() => navigation.navigate('SongDetail', { songId: song._id })}>
            <Image source={{ uri: song.thumbnailUrl }} style={styles.songThumb} />
            <View style={styles.songInfo}>
              <Text style={typography.body} numberOfLines={1}>{song.title}</Text>
              <Text style={typography.bodySmall}>{song.artist}</Text>
              <View style={styles.songMeta}>
                <View style={[styles.levelTag, { backgroundColor: levelColors[song.level] + '33' }]}>
                  <Text style={[styles.levelTagText, { color: levelColors[song.level] }]}>{song.level}</Text>
                </View>
                <Text style={typography.caption}>{song.genre}</Text>
                <Text style={typography.caption}>{song.totalSentences} lines</Text>
              </View>
            </View>
            <Icon name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        ))}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  streakBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  streakEmoji: { fontSize: 18, marginRight: 4 },
  streakText: { color: colors.warning, fontSize: 18, fontWeight: '700' },
  dailyCard: { backgroundColor: colors.surface, borderRadius: 16, padding: 20, marginHorizontal: 20 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: '700', color: colors.primary },
  statLabel: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
  statDivider: { width: 1, backgroundColor: colors.border },
  levelRow: { paddingHorizontal: 20, gap: 10 },
  levelChip: { borderWidth: 2, borderRadius: 16, paddingHorizontal: 20, paddingVertical: 12, alignItems: 'center' },
  levelChipText: { fontSize: 18, fontWeight: '700' },
  currentDot: { width: 8, height: 8, borderRadius: 4, marginTop: 4 },
  songCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 12, marginHorizontal: 20, marginBottom: 10, padding: 12 },
  songThumb: { width: 60, height: 60, borderRadius: 8 },
  songInfo: { flex: 1, marginLeft: 12 },
  songMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 8 },
  levelTag: { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  levelTagText: { fontSize: 11, fontWeight: '700' },
});
