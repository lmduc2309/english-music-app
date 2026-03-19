import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { COLORS, FONTS, SPACING } from '../../src/utils/theme';
import { VocabularyItem } from '../../src/types';
import { api } from '../../src/services/api';

export default function VocabularyScreen() {
  const [tab, setTab] = useState<'review'|'all'>('review');
  const [reviewWords, setReviewWords] = useState<VocabularyItem[]>([]);
  const [allWords, setAllWords] = useState<VocabularyItem[]>([]);
  const [stats, setStats] = useState({ total: 0, mastered: 0, dueForReview: 0 });
  const [current, setCurrent] = useState<VocabularyItem|null>(null);
  const [showDef, setShowDef] = useState(false);

  useEffect(() => { load(); }, []);
  const load = async () => {
    try {
      const vocab = await api.getVocabulary();
      setAllWords(vocab.items); setStats({ total: vocab.total, mastered: vocab.mastered, dueForReview: vocab.dueForReview });
      const review = await api.getReviewWords(20); setReviewWords(review);
      if (review.length > 0) setCurrent(review[0]);
    } catch {}
  };

  const handleReview = async (quality: number) => {
    if (!current) return;
    try { await api.reviewWord(current.id, quality); const rem = reviewWords.filter(w => w.id !== current.id); setReviewWords(rem); setCurrent(rem[0] || null); setShowDef(false); } catch {}
  };

  return (
    <View style={styles.container}>
      <View style={styles.statsRow}>
        <View style={styles.statBox}><Text style={styles.statNum}>{stats.total}</Text><Text style={styles.statLbl}>Total</Text></View>
        <View style={styles.statBox}><Text style={[styles.statNum, { color: COLORS.success }]}>{stats.mastered}</Text><Text style={styles.statLbl}>Mastered</Text></View>
        <View style={styles.statBox}><Text style={[styles.statNum, { color: COLORS.warning }]}>{stats.dueForReview}</Text><Text style={styles.statLbl}>To Review</Text></View>
      </View>
      <View style={styles.tabs}>
        {(['review','all'] as const).map(t => (
          <Pressable key={t} style={[styles.tab, tab===t && styles.tabActive]} onPress={() => setTab(t)}>
            <Text style={[styles.tabText, tab===t && styles.tabTextActive]}>{t==='review' ? `Review (${reviewWords.length})` : 'All Words'}</Text>
          </Pressable>
        ))}
      </View>
      {tab === 'review' && (current ? (
        <View style={styles.reviewCard}>
          <Text style={styles.word}>{current.word}</Text>
          {current.phonetic && <Text style={styles.phonetic}>{current.phonetic}</Text>}
          {showDef ? (<>
            <Text style={styles.definition}>{current.definition}</Text>
            {current.exampleSentence && <Text style={styles.example}>"{current.exampleSentence}"</Text>}
            {current.songContext && <Text style={styles.context}>🎵 {current.songContext}</Text>}
            <Text style={styles.ratePrompt}>How well did you know it?</Text>
            <View style={styles.rateRow}>
              {[{q:1,l:'Forgot',c:COLORS.danger},{q:3,l:'Hard',c:COLORS.warning},{q:5,l:'Easy',c:COLORS.success}].map(({q,l,c}) => (
                <Pressable key={q} style={[styles.rateBtn,{backgroundColor:c+'22'}]} onPress={() => handleReview(q)}><Text style={[styles.rateBtnText,{color:c}]}>{l}</Text></Pressable>
              ))}
            </View>
          </>) : (
            <Pressable style={styles.showBtn} onPress={() => setShowDef(true)}><Text style={styles.showBtnText}>Tap to reveal definition</Text></Pressable>
          )}
        </View>
      ) : (
        <View style={styles.empty}><Text style={{fontSize:56}}>🎉</Text><Text style={styles.emptyText}>All caught up!</Text></View>
      ))}
      {tab === 'all' && (
        <FlatList data={allWords} keyExtractor={i=>i.id} renderItem={({item}) => (
          <View style={styles.wordRow}>
            <View style={{flex:1}}><Text style={styles.wordText}>{item.word}</Text><Text style={styles.defText}>{item.definition}</Text></View>
            {item.mastered && <Text style={{color:COLORS.success,fontSize:18,fontWeight:'700'}}>✓</Text>}
          </View>
        )} ListEmptyComponent={<Text style={styles.emptyText}>Start singing to build your vocabulary!</Text>} />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:COLORS.background,padding:SPACING.md},
  statsRow:{flexDirection:'row',gap:SPACING.sm,marginTop:SPACING.lg,marginBottom:SPACING.md},
  statBox:{flex:1,backgroundColor:COLORS.card,borderRadius:12,padding:SPACING.md,alignItems:'center'},
  statNum:{color:COLORS.text,fontSize:FONTS.sizes.xl,fontWeight:'800'},
  statLbl:{color:COLORS.textMuted,fontSize:FONTS.sizes.xs,marginTop:2},
  tabs:{flexDirection:'row',gap:SPACING.sm,marginBottom:SPACING.md},
  tab:{flex:1,padding:10,borderRadius:10,alignItems:'center',backgroundColor:COLORS.surface},
  tabActive:{backgroundColor:COLORS.primary+'33'},
  tabText:{color:COLORS.textMuted,fontWeight:'600'},tabTextActive:{color:COLORS.primary},
  reviewCard:{backgroundColor:COLORS.card,borderRadius:16,padding:SPACING.xl,alignItems:'center',borderWidth:1,borderColor:COLORS.border},
  word:{color:COLORS.text,fontSize:FONTS.sizes.xxl,fontWeight:'800'},
  phonetic:{color:COLORS.primaryLight,fontSize:FONTS.sizes.md,marginTop:4},
  definition:{color:COLORS.textSecondary,fontSize:FONTS.sizes.lg,textAlign:'center',marginTop:SPACING.md},
  example:{color:COLORS.textMuted,fontSize:FONTS.sizes.md,fontStyle:'italic',marginTop:SPACING.sm,textAlign:'center'},
  context:{color:COLORS.primaryLight,fontSize:FONTS.sizes.sm,marginTop:SPACING.sm},
  showBtn:{backgroundColor:COLORS.surface,borderRadius:12,padding:SPACING.md,marginTop:SPACING.lg,width:'100%',alignItems:'center'},
  showBtnText:{color:COLORS.primaryLight,fontWeight:'600'},
  ratePrompt:{color:COLORS.textMuted,fontSize:FONTS.sizes.sm,marginTop:SPACING.lg},
  rateRow:{flexDirection:'row',gap:SPACING.sm,marginTop:SPACING.sm,width:'100%'},
  rateBtn:{flex:1,borderRadius:10,padding:12,alignItems:'center'},
  rateBtnText:{fontWeight:'700',fontSize:FONTS.sizes.md},
  empty:{alignItems:'center',paddingTop:SPACING.xxl},
  emptyText:{color:COLORS.textMuted,fontSize:FONTS.sizes.md,textAlign:'center',marginTop:SPACING.md},
  wordRow:{flexDirection:'row',backgroundColor:COLORS.card,borderRadius:10,padding:SPACING.md,marginBottom:SPACING.sm,alignItems:'center',borderWidth:1,borderColor:COLORS.border},
  wordText:{color:COLORS.text,fontWeight:'600',fontSize:FONTS.sizes.md},
  defText:{color:COLORS.textMuted,fontSize:FONTS.sizes.sm,marginTop:2},
});
