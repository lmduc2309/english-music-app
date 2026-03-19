import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { COLORS, FONTS, SPACING } from '../utils/theme';
import { Song } from '../types';
import LevelBadge from './LevelBadge';

interface Props { song: Song; onPress: () => void; }

export default function SongCard({ song, onPress }: Props) {
  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && { opacity: 0.7 }]} onPress={onPress}>
      <Image source={{ uri: song.thumbnailUrl }} style={styles.thumb} />
      <View style={styles.info}>
        <View style={styles.topRow}>
          <Text style={styles.title} numberOfLines={1}>{song.title}</Text>
          <LevelBadge level={song.level} />
        </View>
        <Text style={styles.artist}>{song.artist}</Text>
        <Text style={styles.meta}>{song.totalLines} lines {song.genre ? `\u00b7 ${song.genre}` : ''}</Text>
      </View>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  card: { flexDirection: 'row', backgroundColor: COLORS.card, borderRadius: 12, padding: SPACING.sm, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  thumb: { width: 72, height: 72, borderRadius: 8, backgroundColor: COLORS.surfaceLight },
  info: { flex: 1, marginLeft: SPACING.md, justifyContent: 'center' },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { color: COLORS.text, fontSize: FONTS.sizes.md, fontWeight: '600', flex: 1, marginRight: SPACING.sm },
  artist: { color: COLORS.textSecondary, fontSize: FONTS.sizes.sm, marginTop: 2 },
  meta: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs, marginTop: 4 },
});
