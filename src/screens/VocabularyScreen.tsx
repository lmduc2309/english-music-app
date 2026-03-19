import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SPACING } from '../utils/theme';
import { VocabularyItem } from '../types';
import { api } from '../services/api';

const VocabularyScreen = () => {
  const [tab, setTab] = useState<'review'|'all'>('review');
  const [reviewWords, setReviewWords] = useState<VocabularyItem[]>([]);
  const [allWords, setAllWords] = useState<VocabularyItem[]>([]);
  const [stats, setStats] = useState({ total: 0, mastered: 0, dueForReview: 0 });
  const [currentReview, setCurrentReview] = useState<VocabularyItem|null>(null);
  const [showDef, setShowDef] = useState(false);

  useEffect(() => { load(); }, []);
  const load = async () => {
    try {
      const vocab = await api.getVocabulary();
      setAllWords(vocab.items); setStats({ total: vocab.total, mastered: vocab.mastered, dueForReview: vocab.dueForReview });
      const review = await api.getReviewWords(20); setReviewWords(review);
      if (review.length > 0) setCurrentReview(review[0]);
    } catch {}
  };

  const handleReview = async (quality: number) => {
    if (!currentReview) return;
    try { await api.reviewWord(currentReview.id, quality); const remaining = reviewWords.filter(w => w.id !== currentReview.id); setReviewWords(remaining); setCurrentReview(remaining[0] || null); setShowDef(false); } catch {}
  };

  return (
    <View style={styles.container}>
      <View style={styles.statsRow}>
        <View style={styles.statBox}><Text style={styles.statNum}>{stats.total}</Text><Text style={styles.statLbl}>Total</Text></View>
        <View style={styles.statBox}><Text style={[styles.statNum, { color: COLORS.success }]}>{stats.mastered}</Text><Text style={styles.statLbl}>Mastered</Text></View>
        <View style={styles.statBox}><Text style={[styles.statNum, { color: COLORS.warning }]}>{stats.dueForReview}</Text><Text style={styles.statLbl}>To Review</Text></View>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, tab==='review' && styles.tabActive]} onPress={() => setTab('review')}><Text style={[styles.tabText, tab==='review' && styles.tabTextActive]}>Review ({reviewWords.length})</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tab==='all' && styles.tabActive]} onPress={() => setTab('all')}><Text style={[styles.tabText, tab==='all' && styles.tabTextActive]}>All Words</Text></TouchableOpacity>
      </View>

      {tab === 'review' && (currentReview ? (
        <View style={styles.reviewCard}>
          <Text style={styles.word}>{currentReview.word}</Text>
          {currentReview.phonetic && <Text style={styles.phonetic}>{currentReview.phonetic}</Text>}
          {showDef ? (
            <>
              <Text style={styles.definition}>{currentReview.definition}</Text>
              {currentReview.exampleSentence && <Text style={styles.example}>"{currentReview.exampleSentence}"</Text>}
              {currentReview.songContext && <Text style={styles.context}>🎵 {currentReview.songContext}</Text>}
              <Text style={styles.ratePrompt}>How well did you know it?</Text>
              <View style={styles.rateRow}>
                <TouchableOpacity style={[styles.rateBtn, { backgroundColor: COLORS.danger+'22' }]} onPress={() => handleReview(1)}><Text style={[styles.rateBtnText, { color: COLORS.danger }]}>Forgot</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.rateBtn, { backgroundColor: COLORS.warning+'22' }]} onPress={() => handleReview(3)}><Text style={[styles.rateBtnText, { color: COLORS.warning }]}>Hard</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.rateBtn, { backgroundColor: COLORS.success+'22' }]} onPress={() => handleReview(5)}><Text style={[styles.rateBtnText, { color: COLORS.success }]}>Easy</Text></TouchableOpacity>
              </View>
            </>
          ) : (
            <TouchableOpacity style={styles.showBtn} onPress={() => setShowDef(true)}><Text style={styles.showBtnText}>Tap to reveal definition</Text></TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={styles.emptyState}><Text style={{ fontSize: 56, marginBottom: SPACING.md }}>🎉</Text><Text style={styles.emptyText}>All caught up! No words to review.</Text></View>
      ))}

      {tab === 'all' && (
        <FlatList data={allWords} keyExtractor={i => i.id} renderItem={({ item }) => (
          <View style={styles.wordRow}>
            <View style={{ flex: 1 }}><Text style={styles.wordText}>{item.word}</Text><Text style={styles.defText}>{item.definition}</Text></View>
            {item.mastered && <Text style={styles.masteredBadge}>✓</Text>}
          </View>
        )} ListEmptyComponent={<Text style={styles.emptyText}>Start practicing songs to build your vocabulary!</Text>} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: SPACING.md },
  statsRow: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.lg, marginBottom: SPACING.md },
  statBox: { flex: 1, backgroundColor: COLORS.card, borderRadius: 12, padding: SPACING.md, alignItems: 'center' },
  statNum: { color: COLORS.text, fontSize: FONTS.sizes.xl, fontWeight: '800' },
  statLbl: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs, marginTop: 2 },
  tabs: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  tab: { flex: 1, padding: 10, borderRadius: 10, alignItems: 'center', backgroundColor: COLORS.surface },
  tabActive: { backgroundColor: COLORS.primary + '33' }, tabText: { color: COLORS.textMuted, fontWeight: '600' }, tabTextActive: { color: COLORS.primary },
  reviewCard: { backgroundColor: COLORS.card, borderRadius: 16, padding: SPACING.xl, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  word: { color: COLORS.text, fontSize: FONTS.sizes.xxl, fontWeight: '800' },
  phonetic: { color: COLORS.primaryLight, fontSize: FONTS.sizes.md, marginTop: 4 },
  definition: { color: COLORS.textSecondary, fontSize: FONTS.sizes.lg, textAlign: 'center', marginTop: SPACING.md },
  example: { color: COLORS.textMuted, fontSize: FONTS.sizes.md, fontStyle: 'italic', marginTop: SPACING.sm, textAlign: 'center' },
  context: { color: COLORS.primaryLight, fontSize: FONTS.sizes.sm, marginTop: SPACING.sm, textAlign: 'center' },
  showBtn: { backgroundColor: COLORS.surface, borderRadius: 12, padding: SPACING.md, marginTop: SPACING.lg, width: '100%', alignItems: 'center' },
  showBtnText: { color: COLORS.primaryLight, fontWeight: '600' },
  ratePrompt: { color: COLORS.textMuted, fontSize: FONTS.sizes.sm, marginTop: SPACING.lg },
  rateRow: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.sm, width: '100%' },
  rateBtn: { flex: 1, borderRadius: 10, padding: 12, alignItems: 'center' },
  rateBtnText: { fontWeight: '700', fontSize: FONTS.sizes.md },
  emptyState: { alignItems: 'center', paddingTop: SPACING.xxl },
  emptyText: { color: COLORS.textMuted, fontSize: FONTS.sizes.md, textAlign: 'center' },
  wordRow: { flexDirection: 'row', backgroundColor: COLORS.card, borderRadius: 10, padding: SPACING.md, marginBottom: SPACING.sm, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  wordText: { color: COLORS.text, fontWeight: '600', fontSize: FONTS.sizes.md },
  defText: { color: COLORS.textMuted, fontSize: FONTS.sizes.sm, marginTop: 2 },
  masteredBadge: { color: COLORS.success, fontSize: 18, fontWeight: '700' },
});
export default VocabularyScreen;
