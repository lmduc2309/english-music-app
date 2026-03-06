import React, {useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import {useAuthStore} from '@/store/authStore';
import {useSongStore} from '@/store/songStore';
import {colors, spacing, fontSize, borderRadius, getLevelColor} from '@/theme';
import {CefrLevel, Song} from '@/types';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '@/types';

const LEVELS = Object.values(CefrLevel);

const SongCard = ({song, onPress}: {song: Song; onPress: () => void}) => (
  <TouchableOpacity style={styles.songCard} onPress={onPress}>
    <View style={[styles.levelBadge, {backgroundColor: getLevelColor(song.cefrLevel)}]}>
      <Text style={styles.levelText}>{song.cefrLevel}</Text>
    </View>
    <Text style={styles.songTitle} numberOfLines={1}>{song.title}</Text>
    <Text style={styles.songArtist} numberOfLines={1}>{song.artist}</Text>
    <View style={styles.songMeta}>
      <Text style={styles.metaText}>{Math.floor(song.duration / 60)}:{String(song.duration % 60).padStart(2, '0')}</Text>
      <Text style={styles.metaText}>{song.totalSentences} lines</Text>
    </View>
  </TouchableOpacity>
);

type Props = NativeStackScreenProps<RootStackParamList, 'MainTabs'>;

const HomeScreen = ({navigation}: any) => {
  const {user} = useAuthStore();
  const {songs, recommendations, fetchSongs, fetchRecommendations} = useSongStore();

  useEffect(() => {
    fetchSongs();
    if (user?.currentLevel) {
      fetchRecommendations(user.currentLevel);
    }
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.username}>{user?.username || 'Singer'} 🎵</Text>
        </View>
        <View style={styles.streakBadge}>
          <Text style={styles.streakText}>🔥 {user?.currentStreak || 0}</Text>
        </View>
      </View>

      {/* XP & Level */}
      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user?.currentLevel || 'A1'}</Text>
          <Text style={styles.statLabel}>Level</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user?.totalXp || 0}</Text>
          <Text style={styles.statLabel}>Total XP</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user?.songsCompleted || 0}</Text>
          <Text style={styles.statLabel}>Songs</Text>
        </View>
      </View>

      {/* Level Selector */}
      <Text style={styles.sectionTitle}>Browse by Level</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.levelRow}>
        {LEVELS.map(level => (
          <TouchableOpacity
            key={level}
            style={[styles.levelChip, {backgroundColor: getLevelColor(level)}]}
            onPress={() => fetchSongs({level})}>
            <Text style={styles.levelChipText}>{level}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[styles.levelChip, {backgroundColor: colors.surfaceLight}]}
          onPress={() => fetchSongs()}>
          <Text style={styles.levelChipText}>All</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Recommended */}
      {recommendations.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Recommended for You</Text>
          <FlatList
            horizontal
            data={recommendations}
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            renderItem={({item}) => (
              <SongCard
                song={item}
                onPress={() => navigation.navigate('SongDetail', {songId: item.id})}
              />
            )}
          />
        </>
      )}

      {/* All Songs */}
      <Text style={styles.sectionTitle}>All Songs</Text>
      {songs.map(song => (
        <TouchableOpacity
          key={song.id}
          style={styles.songRow}
          onPress={() => navigation.navigate('SongDetail', {songId: song.id})}>
          <View style={[styles.rowLevel, {backgroundColor: getLevelColor(song.cefrLevel)}]}>
            <Text style={styles.rowLevelText}>{song.cefrLevel}</Text>
          </View>
          <View style={styles.rowInfo}>
            <Text style={styles.rowTitle} numberOfLines={1}>{song.title}</Text>
            <Text style={styles.rowArtist}>{song.artist}</Text>
          </View>
          <Text style={styles.rowSentences}>{song.totalSentences} lines</Text>
        </TouchableOpacity>
      ))}

      <View style={{height: 100}} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.md},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.xxl + spacing.md,
    marginBottom: spacing.lg,
  },
  greeting: {fontSize: fontSize.md, color: colors.textSecondary},
  username: {fontSize: fontSize.xxl, fontWeight: '800', color: colors.textPrimary},
  streakBadge: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  streakText: {fontSize: fontSize.lg, fontWeight: '700', color: colors.warning},
  statsCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  statItem: {flex: 1, alignItems: 'center'},
  statValue: {fontSize: fontSize.xl, fontWeight: '800', color: colors.primary},
  statLabel: {fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 4},
  statDivider: {width: 1, backgroundColor: colors.border},
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  levelRow: {marginBottom: spacing.md},
  levelChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
  },
  levelChipText: {color: '#fff', fontWeight: '700', fontSize: fontSize.md},
  songCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginRight: spacing.md,
    width: 180,
  },
  levelBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
  },
  levelText: {color: '#fff', fontSize: fontSize.xs, fontWeight: '700'},
  songTitle: {fontSize: fontSize.lg, fontWeight: '700', color: colors.textPrimary},
  songArtist: {fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2},
  songMeta: {flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm},
  metaText: {fontSize: fontSize.xs, color: colors.textMuted},
  songRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  rowLevel: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  rowLevelText: {color: '#fff', fontWeight: '800', fontSize: fontSize.sm},
  rowInfo: {flex: 1},
  rowTitle: {fontSize: fontSize.md, fontWeight: '600', color: colors.textPrimary},
  rowArtist: {fontSize: fontSize.sm, color: colors.textSecondary},
  rowSentences: {fontSize: fontSize.xs, color: colors.textMuted},
});

export default HomeScreen;
