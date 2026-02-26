import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { songsAPI } from '../../api/songs';
import { progressAPI } from '../../api/progress';
import { colors, levelColors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SongDetailScreen({ route, navigation }: any) {
  const { songId } = route.params;
  const [song, setSong] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      songsAPI.getSongById(songId).then(r => setSong(r.data.song)),
      progressAPI.getSongProgress(songId).then(r => setProgress(r.data.progress)).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, [songId]);

  if (loading || !song) {
    return <View style={styles.loader}><ActivityIndicator size="large" color={colors.primary} /></View>;
  }

  const completedCount = progress?.completedSentences?.length || 0;
  const progressPct = song.totalSentences > 0 ? Math.round((completedCount / song.totalSentences) * 100) : 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Song Cover */}
        <View style={styles.coverSection}>
          <Image source={{ uri: song.thumbnailUrl }} style={styles.cover} />
          <Text style={[typography.h2, { marginTop: 16, textAlign: 'center' }]}>{song.title}</Text>
          <Text style={[typography.bodySmall, { textAlign: 'center' }]}>{song.artist}</Text>
          <View style={styles.tags}>
            <View style={[styles.tag, { backgroundColor: levelColors[song.level] + '33' }]}>
              <Text style={[styles.tagText, { color: levelColors[song.level] }]}>{song.level}</Text>
            </View>
            <View style={[styles.tag, { backgroundColor: colors.surfaceLight }]}>
              <Text style={styles.tagText}>{song.genre}</Text>
            </View>
            <View style={[styles.tag, { backgroundColor: colors.surfaceLight }]}>
              <Text style={styles.tagText}>{Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}</Text>
            </View>
          </View>
        </View>

        {/* Progress */}
        <View style={styles.progressCard}>
          <Text style={typography.h3}>Your Progress</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
          </View>
          <Text style={typography.bodySmall}>{completedCount} / {song.totalSentences} sentences completed ({progressPct}%)</Text>
        </View>

        {/* Description */}
        {song.description && (
          <View style={styles.section}>
            <Text style={typography.h3}>About</Text>
            <Text style={[typography.bodySmall, { marginTop: 8 }]}>{song.description}</Text>
          </View>
        )}

        {/* Key Phrases */}
        {song.language?.keyPhrases?.length > 0 && (
          <View style={styles.section}>
            <Text style={typography.h3}>Key Phrases</Text>
            {song.language.keyPhrases.map((phrase: string, i: number) => (
              <View key={i} style={styles.phraseItem}>
                <Text style={styles.phraseBullet}>💡</Text>
                <Text style={typography.body}>{phrase}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Start Practice Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.startButton} onPress={() => navigation.navigate('Practice', { songId: song._id, songTitle: song.title })}>
          <Ionicons name="mic" size={24} color="#FFF" />
          <Text style={styles.startText}>{progress ? 'Continue Practice' : 'Start Singing'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  header: { padding: 20 },
  coverSection: { alignItems: 'center', paddingHorizontal: 20 },
  cover: { width: 200, height: 200, borderRadius: 16 },
  tags: { flexDirection: 'row', marginTop: 12, gap: 8 },
  tag: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  tagText: { color: colors.text, fontSize: 13, fontWeight: '600' },
  progressCard: { backgroundColor: colors.surface, borderRadius: 16, padding: 20, marginHorizontal: 20, marginTop: 24 },
  progressBar: { height: 8, backgroundColor: colors.surfaceLight, borderRadius: 4, marginVertical: 12, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.accent, borderRadius: 4 },
  section: { paddingHorizontal: 20, marginTop: 24 },
  phraseItem: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8 },
  phraseBullet: { fontSize: 16 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, paddingBottom: 36, backgroundColor: colors.background + 'F0' },
  startButton: { flexDirection: 'row', backgroundColor: colors.primary, borderRadius: 16, padding: 18, alignItems: 'center', justifyContent: 'center', gap: 10 },
  startText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
});
