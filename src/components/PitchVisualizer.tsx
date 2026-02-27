import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors } from '../theme/colors';

interface Props {
  /** Live pitch values from user mic (0-100 normalized) */
  userPitch: number[];
  /** Reference pitch from the song (0-100 normalized) */
  referencePitch: number[];
  /** Number of visible bars */
  barCount?: number;
  /** Height of the visualizer */
  height?: number;
}

/**
 * PitchVisualizer — side-by-side animated pitch bars.
 * Shows reference pitch (blue) vs user pitch (green/red based on match).
 */
const PitchVisualizer: React.FC<Props> = ({
  userPitch,
  referencePitch,
  barCount = 20,
  height = 120,
}) => {
  const animValues = useRef<Animated.Value[]>(
    Array.from({ length: barCount }, () => new Animated.Value(0))
  ).current;

  // Resample array to barCount
  const resample = (arr: number[], target: number): number[] => {
    if (!arr.length) return new Array(target).fill(0);
    const result: number[] = [];
    const ratio = (arr.length - 1) / (target - 1);
    for (let i = 0; i < target; i++) {
      const idx = i * ratio;
      const lo = Math.floor(idx);
      const hi = Math.min(Math.ceil(idx), arr.length - 1);
      result.push(arr[lo] * (1 - (idx - lo)) + arr[hi] * (idx - lo));
    }
    return result;
  };

  useEffect(() => {
    const sampledUser = resample(userPitch, barCount);
    const animations = animValues.map((val, i) =>
      Animated.spring(val, {
        toValue: Math.max(0.04, sampledUser[i] / 100),
        useNativeDriver: false,
        tension: 60,
        friction: 8,
      })
    );
    Animated.parallel(animations).start();
  }, [userPitch]);

  const sampledRef = resample(referencePitch, barCount);

  return (
    <View style={[styles.container, { height }]}>
      {/* Reference pitch (background) */}
      <View style={StyleSheet.absoluteFill}>
        <View style={styles.row}>
          {sampledRef.map((val, i) => (
            <View
              key={`ref-${i}`}
              style={[
                styles.refBar,
                {
                  height: Math.max(4, (val / 100) * height),
                  marginHorizontal: 1,
                },
              ]}
            />
          ))}
        </View>
      </View>

      {/* User pitch (animated foreground) */}
      <View style={styles.row}>
        {animValues.map((animVal, i) => {
          const refVal = sampledRef[i];
          const userVal = userPitch.length > 0 ? (userPitch[Math.round((i / barCount) * (userPitch.length - 1))] || 0) : 0;
          const diff = Math.abs(userVal - refVal);
          const barColor = userPitch.length === 0
            ? colors.primary
            : diff < 15
            ? colors.success
            : diff < 30
            ? colors.warning
            : colors.error;

          return (
            <Animated.View
              key={`user-${i}`}
              style={[
                styles.userBar,
                {
                  height: animVal.interpolate({
                    inputRange: [0, 1],
                    outputRange: [4, height],
                  }),
                  backgroundColor: barColor,
                  marginHorizontal: 1,
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    padding: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: '100%',
    justifyContent: 'center',
  },
  refBar: {
    width: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  userBar: {
    width: 6,
    borderRadius: 3,
  },
});

export default PitchVisualizer;
