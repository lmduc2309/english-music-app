import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';
import { User, UserStats, Song, CefrLevel } from '../types';

interface AppState {
  user: User | null; isAuthenticated: boolean; isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>; loadUser: () => Promise<void>;
  stats: UserStats | null; loadStats: () => Promise<void>;
  songs: Song[]; selectedLevel: CefrLevel | null;
  loadSongs: (level?: CefrLevel, search?: string) => Promise<void>;
  currentSessionId: string | null; setCurrentSession: (id: string | null) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null, isAuthenticated: false, isLoading: true,
  login: async (email, password) => { const { user } = await api.login(email, password); set({ user, isAuthenticated: true }); },
  register: async (email, password, displayName) => { const { user } = await api.register(email, password, displayName); set({ user, isAuthenticated: true }); },
  logout: async () => { await api.logout(); set({ user: null, isAuthenticated: false, stats: null }); },
  loadUser: async () => { try { const token = await AsyncStorage.getItem('token'); if (token) { const user = await api.getProfile(); set({ user, isAuthenticated: true, isLoading: false }); } else { set({ isLoading: false }); } } catch { set({ isLoading: false, isAuthenticated: false }); } },
  stats: null, loadStats: async () => { try { const stats = await api.getStats(); set({ stats }); } catch {} },
  songs: [], selectedLevel: null,
  loadSongs: async (level?, search?) => { try { const { songs } = await api.getSongs({ level, search }); set({ songs, selectedLevel: level || null }); } catch {} },
  currentSessionId: null, setCurrentSession: (id) => set({ currentSessionId: id }),
}));
