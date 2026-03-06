import React, {useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {useSongStore} from '@/store/songStore';
import {colors, spacing, fontSize, borderRadius, getLevelColor} from '@/theme';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '@/types';

type Props = NativeStackScreenProps<RootStackParamList, 'SongDetail'>;

const SongDetailScreen = ({route, navigation}: Props) => {
  const {songId} = route.params;
  const {currentLesson, isLoading, fetchLesson} = useSongStore();

  useEffect(() => {
    fetchLesson(songId);
  }, [songId]);

  if (isLoading || !currentLesson) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const {song, progress, sentences} = currentLesson;

  return (
    <ScrollView style={styles.container}>
      {/* Back button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>{"< Back"}</Text>
      </TouchableOpacity>

      {/* Song header */}
      <View style={styles.header}>
        <View style={[styles.levelBadge, {backgroundColor: getLevelColor(song.cefrLevel)}]}>
          <Text style={styles.levelText}>{song.cefrLevel}</Text>
        </View>
        <Text style={styles.title}>{song.title}</Text>
        <Text style={styles.artist}>{song.artist}</Text>
      </View>

      {/* Progress card */}
      <View style={styles.progressCard}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {width: `${progress.percentComplete}%`},
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {progress.completedSentences}/{progress.totalSentences} sentences completed
        </Text>
        {progress.bestOverallScore > 0 && (
          <Text style={styles.scoreText}>Best: {Math.round(progress.bestOverallScore)}%</Text>
        )}
      </View>

      {/* Start button */}
      <TouchableOpacity
        style={styles.startButton}
        onPress={() => navigation.navigate('Lesson', {songId})}>
        <Text style={styles.startButtonText}>
          {progress.completedSentences > 0 ? 'Continue Lesson' : 'Start Lesson'}
        </Text>
      </TouchableOpacity>

      {/* Vocabulary */}
      {song.vocabulary && song.vocabulary.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Key Vocabulary</Text>
          {song.vocabulary.map((item, idx) => (
            <View key={idx} style={styles.vocabCard}>
              <View style={styles.vocabHeader}>
                <Text style={styles.vocabWord}>{item.word}</Text>
                <Text style={styles.vocabPhonetic}>{item.phonetic}</Text>
              </View>
              <Text style={styles.vocabDef}>{item.definition}</Text>
              <Text style={styles.vocabPos}>{item.partOfSpeech}</Text>
            </View>
          ))}
        </>
      )}

      {/* Sentences preview */}
      <Text style={styles.sectionTitle}>Lyrics ({sentences.length} lines)</Text>
      {sentences.map((sentence, idx) => (
        <View
          key={sentence.id}
          style={[
            styles.sentenceRow,
            sentence.isCompleted && styles.sentenceCompleted,
            !sentence.isUnlocked && styles.sentenceLocked,
          ]}>
          <View style={styles.sentenceIdx}>
            <Text style={styles.sentenceIdxText}>
              {sentence.isCompleted ? '\u2713' : idx + 1}
            </Text>
          </View>
          <View style={styles.sentenceInfo}>
            <Text
              style={[
                styles.sentenceText,
                !sentence.isUnlocked && styles.sentenceLockedText,
              ]}>
              {sentence.isUnlocked ? sentence.text : '\u2022 \u2022 \u2022 \u2022 \u2022 \u2022'}
            </Text>
            {sentence.bestScore > 0 && (
              <Text style={styles.sentenceScore}>Best: {Math.round(sentence.bestScore)}%</Text>
            )}
          </View>
        </View>
      ))}

      <View style={{height: 100}} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.md},
  loading: {flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background},
  backBtn: {paddingTop: spacing.xxl + spacing.sm, marginBottom: spacing.md},
  backText: {color: colors.primary, fontSize: fontSize.md, fontWeight: '600'},
  header: {marginBottom: spacing.lg},
  levelBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
  },
  levelText: {color: '#fff', fontWeight: '800', fontSize: fontSize.sm},
  title: {fontSize: fontSize.title, fontWeight: '800', color: colors.textPrimary},
  artist: {fontSize: fontSize.lg, color: colors.textSecondary, marginTop: 4},
  progressCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.surfaceLight,
    borderRadius: 4,
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: 8,
    backgroundColor: colors.success,
    borderRadius: 4,
  },
  progressText: {fontSize: fontSize.sm, color: colors.textSecondary},
  scoreText: {fontSize: fontSize.sm, color: colors.primary, marginTop: 4},
  startButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  startButtonText: {color: '#fff', fontSize: fontSize.xl, fontWeight: '800'},
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  vocabCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  vocabHeader: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  vocabWord: {fontSize: fontSize.lg, fontWeight: '700', color: colors.primary},
  vocabPhonetic: {fontSize: fontSize.sm, color: colors.textMuted},
  vocabDef: {fontSize: fontSize.md, color: colors.textPrimary, marginTop: 4},
  vocabPos: {fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2, fontStyle: 'italic'},
  sentenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  sentenceCompleted: {borderLeftWidth: 3, borderLeftColor: colors.success},
  sentenceLocked: {opacity: 0.5},
  sentenceIdx: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  sentenceIdxText: {color: colors.textPrimary, fontWeight: '700', fontSize: fontSize.sm},
  sentenceInfo: {flex: 1},
  sentenceText: {fontSize: fontSize.md, color: colors.textPrimary},
  sentenceLockedText: {color: colors.textMuted},
  sentenceScore: {fontSize: fontSize.xs, color: colors.success, marginTop: 4},
});

export default SongDetailScreen;
