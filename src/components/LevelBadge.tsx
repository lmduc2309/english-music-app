import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { COLORS, FONTS } from '../utils/theme';
import { CefrLevel } from '../types';

interface Props { level: CefrLevel; selected?: boolean; onPress?: () => void; size?: 'sm'|'md'; }

export default function LevelBadge({ level, selected, onPress, size = 'sm' }: Props) {
  const color = COLORS[level] || COLORS.primary;
  const isMd = size === 'md';
  const badge = (
    <View style={[styles.badge, { backgroundColor: color+'22', borderColor: color }, selected && { backgroundColor: color+'44' }, isMd && styles.badgeMd]}>
      <Text style={[styles.text, { color }, isMd && styles.textMd]}>{level}</Text>
    </View>
  );
  return onPress ? <Pressable onPress={onPress}>{badge}</Pressable> : badge;
}
const styles = StyleSheet.create({
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, borderWidth: 1 },
  badgeMd: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8 },
  text: { fontSize: FONTS.sizes.xs, fontWeight: '700' },
  textMd: { fontSize: FONTS.sizes.md },
});
