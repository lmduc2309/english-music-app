import {create} from 'zustand';
import {songsAPI, lessonsAPI} from '@/services/api';
import {Song, LessonData, CefrLevel} from '@/types';

interface SongState {
  songs: Song[];
  currentLesson: LessonData | null;
  recommendations: Song[];
  isLoading: boolean;
  fetchSongs: (params?: {level?: string; search?: string}) => Promise<void>;
  fetchLesson: (songId: string) => Promise<void>;
  fetchRecommendations: (level: CefrLevel) => Promise<void>;
}

export const useSongStore = create<SongState>((set) => ({
  songs: [],
  currentLesson: null,
  recommendations: [],
  isLoading: false,

  fetchSongs: async (params) => {
    set({isLoading: true});
    try {
      const {data} = await songsAPI.getAll(params);
      set({songs: data.data, isLoading: false});
    } catch (e) {
      set({isLoading: false});
    }
  },

  fetchLesson: async (songId) => {
    set({isLoading: true});
    try {
      const {data} = await lessonsAPI.getLesson(songId);
      set({currentLesson: data, isLoading: false});
    } catch (e) {
      set({isLoading: false});
    }
  },

  fetchRecommendations: async (level) => {
    try {
      const {data} = await lessonsAPI.getRecommendations(level);
      set({recommendations: data});
    } catch (e) {}
  },
}));
