import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { songsAPI } from '../../api/songs';
import { colors, levelColors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SongListScreen({ route, navigation }: any) {
  const { level } = route.params || {};
  const [songs, setSongs] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchSongs = async (q?: string) => {
    setLoading(true);
    try {
      const params: any = { limit: 50 };
      if (level) params.level = level;
      if (q) params.search = q;
      const { data } = await songsAPI.getSongs(params);
      setSongs(data.songs);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchSongs(); }, [level]);

  const handleSearch = () => { if (search.trim()) fetchSongs(search.trim()); else fetchSongs(); };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={typography.h2}>{level ? `Level ${level}` : 'All Songs'}</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.searchBar}>
        <Icon name="search" size={20} color={colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search songs or artists..."
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
      </View>

      <FlatList
        data={songs}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.songCard} onPress={() => navigation.navigate('SongDetail', { songId: item._id })}>
            <Image source={{ uri: item.thumbnailUrl }} style={styles.thumb} />
            <View style={styles.info}>
              <Text style={typography.body} numberOfLines={1}>{item.title}</Text>
              <Text style={typography.bodySmall}>{item.artist}</Text>
              <View style={styles.meta}>
                <View style={[styles.levelTag, { backgroundColor: levelColors[item.level] + '33' }]}>
                  <Text style={[styles.levelText, { color: levelColors[item.level] }]}>{item.level}</Text>
                </View>
                <Text style={typography.caption}>{item.totalSentences} lines</Text>
                <Text style={typography.caption}>⭐ {item.averageScore || '-'}</Text>
              </View>
            </View>
            <Icon name="play-circle" size={32} color={colors.primary} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={[typography.body, { textAlign: 'center', marginTop: 40 }]}>No songs found</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 12, marginHorizontal: 20, paddingHorizontal: 14, marginBottom: 16 },
  searchInput: { flex: 1, color: colors.text, fontSize: 16, padding: 12 },
  list: { paddingHorizontal: 20, paddingBottom: 32 },
  songCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 12, padding: 12, marginBottom: 10 },
  thumb: { width: 64, height: 64, borderRadius: 8 },
  info: { flex: 1, marginLeft: 12 },
  meta: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 8 },
  levelTag: { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  levelText: { fontSize: 11, fontWeight: '700' },
});
