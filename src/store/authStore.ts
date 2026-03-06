import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {authAPI, usersAPI} from '@/services/api';
import {User} from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  login: async (email, password) => {
    try {
      set({isLoading: true, error: null});
      const {data} = await authAPI.login({email, password});
      await AsyncStorage.setItem('accessToken', data.accessToken);
      await AsyncStorage.setItem('refreshToken', data.refreshToken);
      await AsyncStorage.setItem('userId', data.user.id);
      set({user: data.user, isAuthenticated: true, isLoading: false});
    } catch (e: any) {
      set({
        error: e.response?.data?.message || 'Login failed',
        isLoading: false,
      });
      throw e;
    }
  },

  register: async (email, username, password) => {
    try {
      set({isLoading: true, error: null});
      const {data} = await authAPI.register({email, username, password});
      await AsyncStorage.setItem('accessToken', data.accessToken);
      await AsyncStorage.setItem('refreshToken', data.refreshToken);
      await AsyncStorage.setItem('userId', data.user.id);
      set({user: data.user, isAuthenticated: true, isLoading: false});
    } catch (e: any) {
      set({
        error: e.response?.data?.message || 'Registration failed',
        isLoading: false,
      });
      throw e;
    }
  },

  logout: async () => {
    try {
      await authAPI.logout();
    } catch (e) {}
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'userId']);
    set({user: null, isAuthenticated: false});
  },

  loadUser: async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        set({isLoading: false});
        return;
      }
      const {data} = await usersAPI.getProfile();
      set({user: data, isAuthenticated: true, isLoading: false});
    } catch (e) {
      set({isLoading: false});
    }
  },

  clearError: () => set({error: null}),
}));
