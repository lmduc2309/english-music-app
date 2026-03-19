import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { COLORS, FONTS } from '../utils/theme';

interface ScoreCircleProps { score: number; size?: number; strokeWidth?: number; label?: string; showPercent?: boolean; }

const ScoreCircle: React.FC<ScoreCircleProps> = ({ score, size = 80, strokeWidth = 6, label, showPercent = true }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const getColor = () => { if (score >= 80) return COLORS.success; if (score >= 60) return COLORS.warning; return COLORS.danger; };

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <Circle stroke={COLORS.border} fill="none" cx={size/2} cy={size/2} r={radius} strokeWidth={strokeWidth} />
        <Circle stroke={getColor()} fill="none" cx={size/2} cy={size/2} r={radius} strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`} strokeDashoffset={strokeDashoffset}
          strokeLinecap="round" rotation="-90" origin={`${size/2}, ${size/2}`} />
      </Svg>
      <View style={[styles.textContainer, { width: size, height: size }]}>
        <Text style={[styles.score, { color: getColor(), fontSize: size * 0.28 }]}>
          {Math.round(score)}{showPercent && <Text style={styles.percent}>%</Text>}
        </Text>
        {label && <Text style={styles.label}>{label}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { position: 'relative', alignItems: 'center' },
  textContainer: { position: 'absolute', justifyContent: 'center', alignItems: 'center' },
  score: { fontWeight: '700' },
  percent: { fontSize: 12 },
  label: { color: COLORS.textSecondary, fontSize: FONTS.sizes.xs, marginTop: 2 },
});
export default ScoreCircle;
