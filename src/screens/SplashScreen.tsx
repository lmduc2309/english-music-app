import React from 'react';
import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';
import {colors, fontSize} from '@/theme';

const SplashScreen = () => (
  <View style={styles.container}>
    <Text style={styles.emoji}>🎵</Text>
    <Text style={styles.title}>English Music</Text>
    <Text style={styles.subtitle}>Learn English Through Songs</Text>
    <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  emoji: {fontSize: 80, marginBottom: 16},
  title: {
    fontSize: fontSize.hero,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    marginBottom: 32,
  },
  loader: {marginTop: 16},
});

export default SplashScreen;
