import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { COLORS, FONTS, SPACING, LEVEL_NAMES } from '../../src/utils/theme';
import { CefrLevel, Song } from '../../src/types';
import { api } from '../../src/services/api';
import SongCard from '../../src/components/SongCard';
import LevelBadge from '../../src/components/LevelBadge';

export default function SongListScreen() {
  const { level } = useLocalSearchParams<{ level: CefrLevel }>();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchSongs = async (query?: string) => { setLoading(true); try { const data = await api.getSongs({ level, search: query }); setSongs(data.songs); } catch {} setLoading(false); };
  useEffect(() => { fetchSongs(); }, [level]);
  useEffect(() => { const t = setTimeout(() => fetchSongs(search || undefined), 400); return () => clearTimeout(t); }, [search]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {level && <LevelBadge level={level} size="md" />}
        <Text style={styles.title}>{level ? LEVEL_NAMES[level] : ''} Songs</Text>
        <Text style={styles.count}>{songs.length} songs</Text>
      </View>
      <TextInput style={styles.search} placeholder="Search songs or artists..." placeholderTextColor={COLORS.textMuted} value={search} onChangeText={setSearch} />
      {loading ? <ActivityIndicator color={COLORS.primary} size="large" style={{ marginTop: 40 }} /> : (
        <FlatList data={songs} keyExtractor={i => i.id}
          renderItem={({ item }) => <SongCard song={item} onPress={() => router.push(`/song/${item.id}`)} />}
          ListEmptyComponent={<Text style={styles.empty}>No songs found for this level yet.</Text>}
          contentContainerStyle={{ padding: SPACING.md }} />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { alignItems: 'center', paddingTop: SPACING.xl, paddingBottom: SPACING.md },
  title: { color: COLORS.text, fontSize: FONTS.sizes.xl, fontWeight: '700', marginTop: SPACING.sm },
  count: { color: COLORS.textMuted, fontSize: FONTS.sizes.sm, marginTop: 2 },
  search: { backgroundColor: COLORS.surface, marginHorizontal: SPACING.md, borderRadius: 12, padding: SPACING.md, color: COLORS.text, fontSize: FONTS.sizes.md, borderWidth: 1, borderColor: COLORS.border },
  empty: { color: COLORS.textMuted, textAlign: 'center', marginTop: 40, fontSize: FONTS.sizes.md },
});
