import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SPACING } from '../utils/theme';
import ScoreCircle from '../components/ScoreCircle';

const SessionCompleteScreen = ({ route, navigation }: any) => {
  const { song, totalXp, overallScore } = route.params;
  const stars = overallScore >= 95 ? 3 : overallScore >= 85 ? 2 : 1;

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 72 }}>🎉</Text>
      <Text style={styles.title}>Song Complete!</Text>
      <Text style={styles.songName}>{song.title} — {song.artist}</Text>
      <View style={styles.starsRow}>
        {[1,2,3].map(s => <Text key={s} style={[styles.star, s <= stars ? styles.starActive : styles.starInactive]}>\u2605</Text>)}
      </View>
      <ScoreCircle score={overallScore} size={140} label="Average Score" />
      <View style={styles.xpBox}><Text style={styles.xpLabel}>XP Earned</Text><Text style={styles.xpValue}>+{totalXp}</Text></View>
      <View style={styles.buttons}>
        <TouchableOpacity style={[styles.btn, styles.primaryBtn]} onPress={() => navigation.popToTop()}>
          <Text style={styles.btnText}>Back to Songs</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.secondaryBtn]} onPress={() => navigation.replace('SongDetail', { songId: song.id })}>
          <Text style={[styles.btnText, { color: COLORS.primary }]}>Play Again</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
export default SessionCompleteScreen;
