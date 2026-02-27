import { create } from 'zustand';
import { apiClient } from '../api/client';
import { Achievement } from '../types';

interface AchievementState {
  achievements: Achievement[];
  newlyEarned: Achievement[];
  loading: boolean;
  fetchAchievements: () => Promise<void>;
  checkAchievements: () => Promise<void>;
  clearNewlyEarned: () => void;
}

export const useAchievementStore = create<AchievementState>((set) => ({
  achievements: [],
  newlyEarned: [],
  loading: false,

  fetchAchievements: async () => {
    set({ loading: true });
    try {
      const { data } = await apiClient.get('/achievements');
      set({ achievements: data.achievements, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  checkAchievements: async () => {
    try {
      const { data } = await apiClient.post('/achievements/check');
      if (data.newlyEarned?.length > 0) {
        set((state) => ({
          newlyEarned: [...state.newlyEarned, ...data.newlyEarned],
        }));
      }
    } catch {}
  },

  clearNewlyEarned: () => set({ newlyEarned: [] }),
}));
