import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SPACING } from '../utils/theme';
import { Song } from '../types';
import LevelBadge from './LevelBadge';

interface SongCardProps { song: Song; onPress: () => void; progress?: { stars: number; bestScore: number }; }

const SongCard: React.FC<SongCardProps> = ({ song, onPress, progress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Image source={{ uri: song.thumbnailUrl }} style={styles.thumbnail} />
      <View style={styles.info}>
        <View style={styles.topRow}>
          <Text style={styles.title} numberOfLines={1}>{song.title}</Text>
          <LevelBadge level={song.level} />
        </View>
        <Text style={styles.artist}>{song.artist}</Text>
        <View style={styles.bottomRow}>
          <Text style={styles.meta}>{song.totalLines} lines</Text>
          {progress && progress.stars > 0 && (
            <Text style={styles.stars}>{'\u2605'.repeat(progress.stars)}{'\u2606'.repeat(3 - progress.stars)} {Math.round(progress.bestScore)}%</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { flexDirection: 'row', backgroundColor: COLORS.card, borderRadius: 12, padding: SPACING.sm, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  thumbnail: { width: 72, height: 72, borderRadius: 8, backgroundColor: COLORS.surfaceLight },
  info: { flex: 1, marginLeft: SPACING.md, justifyContent: 'center' },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { color: COLORS.text, fontSize: FONTS.sizes.md, fontWeight: '600', flex: 1, marginRight: SPACING.sm },
  artist: { color: COLORS.textSecondary, fontSize: FONTS.sizes.sm, marginTop: 2 },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  meta: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs },
  stars: { color: COLORS.warning, fontSize: FONTS.sizes.xs, fontWeight: '600' },
});
export default SongCard;
