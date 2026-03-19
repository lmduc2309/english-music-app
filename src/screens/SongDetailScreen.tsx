import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { COLORS, FONTS, SPACING } from '../utils/theme';
import { Song } from '../types';
import { api } from '../services/api';
import LevelBadge from '../components/LevelBadge';

const formatTime = (s: number) => `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;

const SongDetailScreen = ({ route, navigation }: any) => {
  const { songId } = route.params;
  const [song, setSong] = useState<Song|null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  useEffect(() => { api.getSong(songId).then(setSong).catch(() => {}).finally(() => setLoading(false)); }, [songId]);

  const startPractice = async () => { if (!song) return; setStarting(true); try { const session = await api.startSession(song.id); navigation.navigate('Practice', { sessionId: session.id, song }); } catch (e) { console.error(e); } setStarting(false); };

  if (loading || !song) return <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}><ActivityIndicator color={COLORS.primary} size="large" /></View>;

  return (
    <View style={styles.container}>
      <ScrollView>
        <Image source={{ uri: song.thumbnailUrl }} style={styles.hero} />
        <View style={{ position: 'absolute', top: 0, width: '100%', height: 220, backgroundColor: 'rgba(0,0,0,0.4)' }} />
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}><Text style={styles.title}>{song.title}</Text><Text style={styles.artist}>{song.artist}</Text></View>
            <LevelBadge level={song.level} size="md" />
          </View>
          <View style={styles.metaRow}>
            {song.genre && <View style={styles.metaChip}><Text style={styles.metaText}>🎸 {song.genre}</Text></View>}
            {song.bpm && <View style={styles.metaChip}><Text style={styles.metaText}>🥁 {song.bpm} BPM</Text></View>}
            <View style={styles.metaChip}><Text style={styles.metaText}>📝 {song.totalLines} lines</Text></View>
          </View>
          <Text style={styles.sectionTitle}>Lyrics to practice</Text>
          {song.lyrics?.map((line, i) => (
            <View key={line.id || i} style={styles.lyricRow}>
              <Text style={styles.lineNum}>{line.lineNumber}</Text>
              <Text style={styles.lyricText}>{line.text}</Text>
              <Text style={styles.timeStamp}>{formatTime(line.startTime)}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.startBtn} onPress={startPractice} disabled={starting}>
          {starting ? <ActivityIndicator color={COLORS.text} /> : <Text style={styles.startBtnText}>🎤 Start Singing</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  hero: { width: '100%', height: 220 },
  content: { padding: SPACING.md },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: SPACING.md },
  title: { color: COLORS.text, fontSize: FONTS.sizes.xxl, fontWeight: '800' },
  artist: { color: COLORS.textSecondary, fontSize: FONTS.sizes.md, marginTop: 4 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.lg },
  metaChip: { backgroundColor: COLORS.surface, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  metaText: { color: COLORS.textSecondary, fontSize: FONTS.sizes.sm },
  sectionTitle: { color: COLORS.text, fontSize: FONTS.sizes.lg, fontWeight: '700', marginBottom: SPACING.md },
  lyricRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  lineNum: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs, width: 24 },
  lyricText: { color: COLORS.text, fontSize: FONTS.sizes.md, flex: 1 },
  timeStamp: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs, marginLeft: SPACING.sm },
  bottomBar: { padding: SPACING.md, backgroundColor: COLORS.surface, borderTopWidth: 1, borderTopColor: COLORS.border },
  startBtn: { backgroundColor: COLORS.primary, borderRadius: 14, padding: SPACING.md, alignItems: 'center' },
  startBtnText: { color: COLORS.text, fontSize: FONTS.sizes.lg, fontWeight: '800' },
});
export default SongDetailScreen;
