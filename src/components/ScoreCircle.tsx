import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { COLORS, FONTS } from '../utils/theme';

interface Props { score: number; size?: number; strokeWidth?: number; label?: string; }

export default function ScoreCircle({ score, size = 80, strokeWidth = 6, label }: Props) {
  const radius = (size - strokeWidth) / 2;
  const circ = radius * 2 * Math.PI;
  const offset = circ - (score / 100) * circ;
  const color = score >= 80 ? COLORS.success : score >= 60 ? COLORS.warning : COLORS.danger;
  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <Circle stroke={COLORS.border} fill="none" cx={size/2} cy={size/2} r={radius} strokeWidth={strokeWidth} />
        <Circle stroke={color} fill="none" cx={size/2} cy={size/2} r={radius} strokeWidth={strokeWidth}
          strokeDasharray={`${circ} ${circ}`} strokeDashoffset={offset} strokeLinecap="round" rotation="-90" origin={`${size/2}, ${size/2}`} />
      </Svg>
      <View style={[styles.textWrap, { width: size, height: size }]}>
        <Text style={[styles.score, { color, fontSize: size * 0.28 }]}>{Math.round(score)}%</Text>
        {label && <Text style={styles.label}>{label}</Text>}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { position: 'relative', alignItems: 'center' },
  textWrap: { position: 'absolute', justifyContent: 'center', alignItems: 'center' },
  score: { fontWeight: '700' },
  label: { color: COLORS.textSecondary, fontSize: FONTS.sizes.xs, marginTop: 2 },
});
