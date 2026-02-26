import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default function WaveformAnimation() {
  const bars = useRef(Array.from({ length: 20 }, () => new Animated.Value(0.3))).current;

  useEffect(() => {
    const animations = bars.map((bar, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(bar, { toValue: 0.3 + Math.random() * 0.7, duration: 200 + Math.random() * 300, useNativeDriver: true }),
          Animated.timing(bar, { toValue: 0.2 + Math.random() * 0.3, duration: 200 + Math.random() * 300, useNativeDriver: true }),
        ])
      )
    );
    animations.forEach(a => a.start());
    return () => animations.forEach(a => a.stop());
  }, []);

  return (
    <View style={styles.container}>
      {bars.map((bar, i) => (
        <Animated.View
          key={i}
          style={[
            styles.bar,
            {
              transform: [{ scaleY: bar }],
              backgroundColor: i % 3 === 0 ? colors.primary : i % 3 === 1 ? colors.secondary : colors.accent,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 60, gap: 3, marginTop: 20 },
  bar: { width: 4, height: 50, borderRadius: 2 },
});
