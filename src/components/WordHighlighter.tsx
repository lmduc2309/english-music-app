import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

interface WordScore { word: string; correct: boolean; spokenAs?: string; score: number; }
interface Props { words: WordScore[]; }

export default function WordHighlighter({ words }: Props) {
  return (
    <View style={styles.container}>
      {words.map((w, i) => (
        <View key={i} style={styles.wordWrap}>
          <Text style={[
            styles.word,
            w.correct ? styles.correct : styles.incorrect,
          ]}>
            {w.word}
          </Text>
          {!w.correct && w.spokenAs && (
            <Text style={styles.spokenAs}>→ "{w.spokenAs}"</Text>
          )}
          <Text style={[styles.score, w.correct ? styles.correctScore : styles.incorrectScore]}>
            {w.score}%
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6, padding: 8 },
  wordWrap: { alignItems: 'center', padding: 6, borderRadius: 8 },
  word: { fontSize: 20, fontWeight: '700' },
  correct: { color: colors.success },
  incorrect: { color: colors.error, textDecorationLine: 'underline' },
  spokenAs: { fontSize: 10, color: colors.error, marginTop: 2 },
  score: { fontSize: 10, marginTop: 2, fontWeight: '600' },
  correctScore: { color: colors.success },
  incorrectScore: { color: colors.error },
});
