import { create } from 'zustand';
import { api } from '../services/api';
import { User, UserStats, Song, CefrLevel } from '../types';

interface AppState {
  user: User | null; isAuthenticated: boolean; isLoading: boolean;
  stats: UserStats | null; songs: Song[];
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>; loadUser: () => Promise<void>;
  loadStats: () => Promise<void>; loadSongs: (level?: CefrLevel, search?: string) => Promise<void>;
}

export const useStore = create<AppState>((set) => ({
  user: null, isAuthenticated: false, isLoading: true, stats: null, songs: [],
  login: async (email, password) => { const { user } = await api.login(email, password); set({ user, isAuthenticated: true }); },
  register: async (email, password, displayName) => { const { user } = await api.register(email, password, displayName); set({ user, isAuthenticated: true }); },
  logout: async () => { await api.logout(); set({ user: null, isAuthenticated: false, stats: null, songs: [] }); },
  loadUser: async () => { try { const hasToken = await api.hasToken(); if (hasToken) { const user = await api.getProfile(); set({ user, isAuthenticated: true, isLoading: false }); } else { set({ isLoading: false }); } } catch { set({ isLoading: false, isAuthenticated: false }); } },
  loadStats: async () => { try { const stats = await api.getStats(); set({ stats }); } catch {} },
  loadSongs: async (level?, search?) => { try { const { songs } = await api.getSongs({ level, search }); set({ songs }); } catch {} },
}));
