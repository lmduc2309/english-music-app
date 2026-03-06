import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {useSongStore} from '@/store/songStore';
import {colors, spacing, fontSize, borderRadius, getLevelColor, getScoreColor} from '@/theme';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList, SongSentence} from '@/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Lesson'>;

const LessonScreen = ({route, navigation}: Props) => {
  const {songId} = route.params;
  const {currentLesson, isLoading, fetchLesson} = useSongStore();
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    fetchLesson(songId);
  }, [songId]);

  useEffect(() => {
    if (currentLesson) {
      // Jump to first uncompleted sentence
      const firstUncompleted = currentLesson.sentences.findIndex(
        s => s.isUnlocked && !s.isCompleted,
      );
      if (firstUncompleted >= 0) setCurrentIdx(firstUncompleted);
    }
  }, [currentLesson]);

  if (isLoading || !currentLesson) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading lesson...</Text>
      </View>
    );
  }

  const {song, progress, sentences} = currentLesson;
  const currentSentence = sentences[currentIdx];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.closeBtn}>\u2715</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>{song.title}</Text>
          <Text style={styles.headerSubtitle}>
            {currentIdx + 1} / {sentences.length}
          </Text>
        </View>
        <View style={[styles.levelBadge, {backgroundColor: getLevelColor(song.cefrLevel)}]}>
          <Text style={styles.levelText}>{song.cefrLevel}</Text>
        </View>
      </View>

      {/* Progress dots */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dotsRow}>
        {sentences.map((s, idx) => (
          <TouchableOpacity
            key={s.id}
            onPress={() => s.isUnlocked && setCurrentIdx(idx)}
            style={[
              styles.dot,
              idx === currentIdx && styles.dotActive,
              s.isCompleted && styles.dotCompleted,
              !s.isUnlocked && styles.dotLocked,
            ]}
          />
        ))}
      </ScrollView>

      {/* Current sentence */}
      <View style={styles.sentenceCard}>
        <Text style={styles.sentenceNum}>Line {currentIdx + 1}</Text>
        <Text style={styles.sentenceText}>{currentSentence?.text}</Text>
        {currentSentence?.phonetic && (
          <Text style={styles.phonetic}>{currentSentence.phonetic}</Text>
        )}
        {currentSentence?.teachingNote && (
          <View style={styles.tipBox}>
            <Text style={styles.tipLabel}>\ud83d\udca1 Tip</Text>
            <Text style={styles.tipText}>{currentSentence.teachingNote}</Text>
          </View>
        )}
        {currentSentence?.keyWords && currentSentence.keyWords.length > 0 && (
          <View style={styles.keyWordsRow}>
            {currentSentence.keyWords.map((word, i) => (
              <View key={i} style={styles.keyWordChip}>
                <Text style={styles.keyWordText}>{word}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Score if completed */}
      {currentSentence?.isCompleted && (
        <View style={styles.completedBanner}>
          <Text style={styles.completedText}>
            \u2713 Completed - Best: {Math.round(currentSentence.bestScore || 0)}%
          </Text>
        </View>
      )}

      {/* Action buttons */}
      <View style={styles.actions}>
        {/* Listen button */}
        <TouchableOpacity style={styles.listenBtn}>
          <Text style={styles.listenBtnText}>\ud83d\udd0a Listen</Text>
        </TouchableOpacity>

        {/* Practice button */}
        <TouchableOpacity
          style={[
            styles.practiceBtn,
            !currentSentence?.isUnlocked && styles.btnDisabled,
          ]}
          disabled={!currentSentence?.isUnlocked}
          onPress={() =>
            navigation.navigate('Practice', {
              songId,
              sentenceIndex: currentIdx,
            })
          }>
          <Text style={styles.practiceBtnText}>\ud83c\udfa4 Sing This Line</Text>
        </TouchableOpacity>
      </View>

      {/* Navigation */}
      <View style={styles.navRow}>
        <TouchableOpacity
          style={[styles.navBtn, currentIdx === 0 && styles.btnDisabled]}
          disabled={currentIdx === 0}
          onPress={() => setCurrentIdx(prev => prev - 1)}>
          <Text style={styles.navBtnText}>\u25c0 Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.navBtn,
            (currentIdx >= sentences.length - 1 || !sentences[currentIdx + 1]?.isUnlocked) &&
              styles.btnDisabled,
          ]}
          disabled={
            currentIdx >= sentences.length - 1 ||
            !sentences[currentIdx + 1]?.isUnlocked
          }
          onPress={() => setCurrentIdx(prev => prev + 1)}>
          <Text style={styles.navBtnText}>Next \u25b6</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.md},
  loading: {flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background},
  loadingText: {color: colors.textSecondary, marginTop: spacing.md},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing.xxl + spacing.sm,
    marginBottom: spacing.md,
  },
  closeBtn: {fontSize: 24, color: colors.textSecondary, padding: spacing.sm},
  headerCenter: {flex: 1, alignItems: 'center'},
  headerTitle: {fontSize: fontSize.lg, fontWeight: '700', color: colors.textPrimary},
  headerSubtitle: {fontSize: fontSize.sm, color: colors.textSecondary},
  levelBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  levelText: {color: '#fff', fontSize: fontSize.xs, fontWeight: '700'},
  dotsRow: {marginBottom: spacing.md, maxHeight: 20},
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.surfaceLight,
    marginRight: 6,
  },
  dotActive: {backgroundColor: colors.primary, transform: [{scale: 1.3}]},
  dotCompleted: {backgroundColor: colors.success},
  dotLocked: {opacity: 0.3},
  sentenceCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginBottom: spacing.md,
    minHeight: 200,
  },
  sentenceNum: {fontSize: fontSize.sm, color: colors.textMuted, marginBottom: spacing.sm},
  sentenceText: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 36,
    textAlign: 'center',
  },
  phonetic: {
    fontSize: fontSize.md,
    color: colors.primaryLight,
    textAlign: 'center',
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
  tipBox: {
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  tipLabel: {fontSize: fontSize.sm, fontWeight: '700', color: colors.warning, marginBottom: 4},
  tipText: {fontSize: fontSize.sm, color: colors.textSecondary},
  keyWordsRow: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md, justifyContent: 'center'},
  keyWordChip: {
    backgroundColor: colors.primaryDark,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  keyWordText: {color: colors.primaryLight, fontSize: fontSize.sm, fontWeight: '600'},
  completedBanner: {
    backgroundColor: colors.success + '20',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  completedText: {color: colors.success, fontWeight: '700'},
  actions: {flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md},
  listenBtn: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  listenBtnText: {color: colors.textPrimary, fontSize: fontSize.md, fontWeight: '600'},
  practiceBtn: {
    flex: 2,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  practiceBtnText: {color: '#fff', fontSize: fontSize.lg, fontWeight: '700'},
  btnDisabled: {opacity: 0.4},
  navRow: {flexDirection: 'row', justifyContent: 'space-between'},
  navBtn: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  navBtnText: {color: colors.textSecondary, fontSize: fontSize.md, fontWeight: '600'},
});

export default LessonScreen;
