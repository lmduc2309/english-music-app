import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {useSongStore} from '@/store/songStore';
import {colors, spacing, fontSize, borderRadius, getLevelColor} from '@/theme';
import {CefrLevel} from '@/types';

const DiscoverScreen = ({navigation}: any) => {
  const [search, setSearch] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<CefrLevel | null>(null);
  const {songs, isLoading, fetchSongs} = useSongStore();

  useEffect(() => {
    fetchSongs({
      level: selectedLevel || undefined,
      search: search || undefined,
    });
  }, [selectedLevel, search]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Discover Songs</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search songs or artists..."
        placeholderTextColor={colors.textMuted}
        value={search}
        onChangeText={setSearch}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters}>
        <TouchableOpacity
          style={[
            styles.filterChip,
            !selectedLevel && styles.filterChipActive,
          ]}
          onPress={() => setSelectedLevel(null)}>
          <Text style={styles.filterText}>All Levels</Text>
        </TouchableOpacity>
        {Object.values(CefrLevel).map(level => (
          <TouchableOpacity
            key={level}
            style={[
              styles.filterChip,
              selectedLevel === level && {backgroundColor: getLevelColor(level)},
            ]}
            onPress={() => setSelectedLevel(level)}>
            <Text style={styles.filterText}>{level}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {isLoading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{marginTop: 40}} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {songs.map(song => (
            <TouchableOpacity
              key={song.id}
              style={styles.songCard}
              onPress={() => navigation.navigate('SongDetail', {songId: song.id})}>
              <View style={[styles.levelDot, {backgroundColor: getLevelColor(song.cefrLevel)}]} />
              <View style={styles.songInfo}>
                <Text style={styles.songTitle}>{song.title}</Text>
                <Text style={styles.songArtist}>{song.artist}</Text>
                <View style={styles.songTags}>
                  <Text style={styles.tag}>{song.cefrLevel}</Text>
                  <Text style={styles.tag}>{song.genre}</Text>
                  <Text style={styles.tag}>{song.totalSentences} lines</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
          <View style={{height: 100}} />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.md},
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '800',
    color: colors.textPrimary,
    paddingTop: spacing.xxl + spacing.md,
    marginBottom: spacing.md,
  },
  searchInput: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    color: colors.textPrimary,
    fontSize: fontSize.md,
    marginBottom: spacing.md,
  },
  filters: {marginBottom: spacing.md, maxHeight: 44},
  filterChip: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
  },
  filterChipActive: {backgroundColor: colors.primary},
  filterText: {color: '#fff', fontWeight: '600', fontSize: fontSize.sm},
  songCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    alignItems: 'center',
  },
  levelDot: {width: 8, height: 40, borderRadius: 4, marginRight: spacing.md},
  songInfo: {flex: 1},
  songTitle: {fontSize: fontSize.lg, fontWeight: '700', color: colors.textPrimary},
  songArtist: {fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2},
  songTags: {flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm},
  tag: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    overflow: 'hidden',
  },
});

export default DiscoverScreen;
