import { create } from 'zustand';
import { songsAPI } from '../api/songs';
import { Song, SongProgress, CEFRLevel } from '../types';

interface SongFilters {
  level?: CEFRLevel;
  genre?: string;
  search?: string;
}

interface SongState {
  songs: Song[];
  currentSong: Song | null;
  progress: Record<string, SongProgress>; // songId -> progress
  loading: boolean;
  error: string | null;
  filters: SongFilters;

  fetchSongs: (filters?: SongFilters) => Promise<void>;
  fetchSongById: (songId: string) => Promise<void>;
  fetchProgress: (songId: string) => Promise<SongProgress | null>;
  setFilters: (filters: SongFilters) => void;
  clearCurrentSong: () => void;
}

export const useSongStore = create<SongState>((set, get) => ({
  songs: [],
  currentSong: null,
  progress: {},
  loading: false,
  error: null,
  filters: {},

  fetchSongs: async (filters) => {
    set({ loading: true, error: null });
    try {
      const activeFilters = filters ?? get().filters;
      const { data } = await songsAPI.getAll(activeFilters);
      set({ songs: data.songs, loading: false });
    } catch (err: any) {
      set({ loading: false, error: err.response?.data?.error || 'Failed to load songs' });
    }
  },

  fetchSongById: async (songId) => {
    set({ loading: true, error: null });
    try {
      const { data } = await songsAPI.getById(songId);
      set({ currentSong: data.song, loading: false });
    } catch (err: any) {
      set({ loading: false, error: err.response?.data?.error || 'Failed to load song' });
    }
  },

  fetchProgress: async (songId) => {
    try {
      const { data } = await songsAPI.getProgress(songId);
      const prog: SongProgress = data.progress;
      set((state) => ({ progress: { ...state.progress, [songId]: prog } }));
      return prog;
    } catch {
      return null;
    }
  },

  setFilters: (filters) => {
    set({ filters });
  },

  clearCurrentSong: () => {
    set({ currentSong: null });
  },
}));
