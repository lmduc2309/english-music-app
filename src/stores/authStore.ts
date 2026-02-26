import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { authAPI } from '../api/auth';

interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  currentLevel: string;
  totalXP: number;
  currentStreak: number;
  songsCompleted: number;
  averageScore: number;
}

interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  loadToken: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; username: string; password: string; displayName: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  loading: false,
  error: null,

  loadToken: async () => {
    const token = await SecureStore.getItemAsync('auth_token');
    if (token) {
      set({ token });
      try {
        const { data } = await authAPI.getProfile();
        set({ user: data.user });
      } catch {
        await SecureStore.deleteItemAsync('auth_token');
        set({ token: null, user: null });
      }
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await authAPI.login({ email, password });
      await SecureStore.setItemAsync('auth_token', data.token);
      set({ token: data.token, user: data.user, loading: false });
    } catch (err: any) {
      set({ loading: false, error: err.response?.data?.error || 'Login failed' });
      throw err;
    }
  },

  register: async (registerData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await authAPI.register(registerData);
      await SecureStore.setItemAsync('auth_token', data.token);
      set({ token: data.token, user: data.user, loading: false });
    } catch (err: any) {
      set({ loading: false, error: err.response?.data?.error || 'Registration failed' });
      throw err;
    }
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('auth_token');
    set({ token: null, user: null });
  },

  refreshProfile: async () => {
    try {
      const { data } = await authAPI.getProfile();
      set({ user: data.user });
    } catch {}
  },
}));
