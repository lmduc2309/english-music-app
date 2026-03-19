import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';
import { COLORS, FONTS, SPACING } from '../../src/utils/theme';
import ScoreCircle from '../../src/components/ScoreCircle';
import { Song } from '../../src/types';

export default function PracticeCompleteScreen() {
  const { songJson, totalXp, overallScore } = useLocalSearchParams<{ songJson: string; totalXp: string; overallScore: string }>();
  const song: Song = songJson ? JSON.parse(songJson) : {};
  const score = Number(overallScore) || 0;
  const xp = Number(totalXp) || 0;
  const stars = score >= 95 ? 3 : score >= 85 ? 2 : 1;

  useEffect(() => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); }, []);

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 72, marginBottom: SPACING.md }}>\ud83c\udf89</Text>
      <Text style={styles.title}>Song Complete!</Text>
      <Text style={styles.songName}>{song.title} \u2014 {song.artist}</Text>
      <View style={styles.starsRow}>
        {[1,2,3].map(s => <Text key={s} style={[styles.star, s <= stars ? styles.starActive : styles.starInactive]}>\u2605</Text>)}
      </View>
      <ScoreCircle score={score} size={140} label="Average Score" />
      <View style={styles.xpBox}><Text style={styles.xpLabel}>XP Earned</Text><Text style={styles.xpValue}>+{xp}</Text></View>
      <View style={styles.buttons}>
        <Pressable style={[styles.btn, styles.primaryBtn]} onPress={() => router.replace('/(tabs)')}><Text style={styles.btnText}>Back to Songs</Text></Pressable>
        <Pressable style={[styles.btn, styles.secondaryBtn]} onPress={() => router.replace(`/song/${song.id}`)}><Text style={[styles.btnText, { color: COLORS.primary }]}>Play Again</Text></Pressable>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center', padding: SPACING.lg },
  title: { color: COLORS.text, fontSize: FONTS.sizes.xxl, fontWeight: '800', marginBottom: 4 },
  songName: { color: COLORS.textSecondary, fontSize: FONTS.sizes.md, marginBottom: SPACING.lg },
  starsRow: { flexDirection: 'row', gap: 8, marginBottom: SPACING.xl },
  star: { fontSize: 40 }, starActive: { color: COLORS.warning }, starInactive: { color: COLORS.border },
  xpBox: { backgroundColor: COLORS.warning + '22', borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12, alignItems: 'center', marginTop: SPACING.lg, marginBottom: SPACING.xl },
  xpLabel: { color: COLORS.textSecondary, fontSize: FONTS.sizes.sm },
  xpValue: { color: COLORS.warning, fontSize: FONTS.sizes.xxl, fontWeight: '800' },
  buttons: { width: '100%', gap: SPACING.md },
  btn: { borderRadius: 14, padding: SPACING.md, alignItems: 'center' },
  primaryBtn: { backgroundColor: COLORS.primary },
  secondaryBtn: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.primary },
  btnText: { color: COLORS.text, fontSize: FONTS.sizes.lg, fontWeight: '700' },
});
