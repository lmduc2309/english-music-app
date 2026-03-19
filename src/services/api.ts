import axios, { AxiosInstance } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { User, Song, LyricLine, PracticeSession, AttemptResult, VocabularyItem, Achievement, UserStats, LeaderboardEntry, CefrLevel } from '../types';

const API_BASE_URL = __DEV__
  ? Platform.OS === 'android' ? 'http://10.0.2.2:3000/api/v1' : 'http://localhost:3000/api/v1'
  : 'https://api.singlish.app/api/v1';

const TOKEN_KEY = 'singlish_token';

class ApiService {
  private api: AxiosInstance;
  constructor() {
    this.api = axios.create({ baseURL: API_BASE_URL, timeout: 30000, headers: { 'Content-Type': 'application/json' } });
    this.api.interceptors.request.use(async (config) => { const token = await SecureStore.getItemAsync(TOKEN_KEY); if (token) config.headers.Authorization = `Bearer ${token}`; return config; });
    this.api.interceptors.response.use((res) => res, async (error) => { if (error.response?.status === 401) await SecureStore.deleteItemAsync(TOKEN_KEY); return Promise.reject(error); });
  }
  async register(email: string, password: string, displayName: string, nativeLanguage?: string) { const res = await this.api.post('/auth/register', { email, password, displayName, nativeLanguage }); await SecureStore.setItemAsync(TOKEN_KEY, res.data.accessToken); return res.data as { user: User; accessToken: string }; }
  async login(email: string, password: string) { const res = await this.api.post('/auth/login', { email, password }); await SecureStore.setItemAsync(TOKEN_KEY, res.data.accessToken); return res.data as { user: User; accessToken: string }; }
  async getProfile(): Promise<User> { return (await this.api.get('/auth/profile')).data; }
  async logout() { await SecureStore.deleteItemAsync(TOKEN_KEY); }
  async hasToken(): Promise<boolean> { const t = await SecureStore.getItemAsync(TOKEN_KEY); return !!t; }
  async getSongs(params?: { level?: CefrLevel; genre?: string; search?: string; page?: number }) { return (await this.api.get('/songs', { params })).data as { songs: Song[]; total: number; page: number; totalPages: number }; }
  async getSong(id: string): Promise<Song> { return (await this.api.get(`/songs/${id}`)).data; }
  async getSongLyrics(songId: string): Promise<LyricLine[]> { return (await this.api.get(`/songs/${songId}/lyrics`)).data; }
  async startSession(songId: string): Promise<PracticeSession> { return (await this.api.post('/practice/sessions/start', { songId })).data; }
  async submitAttempt(data: { sessionId: string; lyricLineId: string; transcribedText: string; durationMs: number; pitchData?: { time: number; frequency: number }[] }): Promise<AttemptResult> { return (await this.api.post('/practice/attempts/submit', data)).data; }
  async getSession(sessionId: string): Promise<PracticeSession> { return (await this.api.get(`/practice/sessions/${sessionId}`)).data; }
  async getUserSessions(songId?: string): Promise<PracticeSession[]> { return (await this.api.get('/practice/sessions', { params: songId ? { songId } : {} })).data; }
  async abandonSession(sessionId: string) { return (await this.api.patch(`/practice/sessions/${sessionId}/abandon`)).data; }
  async getVocabulary(page?: number) { return (await this.api.get('/vocabulary', { params: { page } })).data as { items: VocabularyItem[]; total: number; mastered: number; dueForReview: number }; }
  async getReviewWords(limit?: number): Promise<VocabularyItem[]> { return (await this.api.get('/vocabulary/review', { params: { limit } })).data; }
  async reviewWord(wordId: string, quality: number): Promise<VocabularyItem> { return (await this.api.post(`/vocabulary/${wordId}/review`, { quality })).data; }
  async addWord(word: string, songContext: string, songId?: string): Promise<VocabularyItem> { return (await this.api.post('/vocabulary/add', { word, songContext, songId })).data; }
  async getStats(): Promise<UserStats> { return (await this.api.get('/gamification/stats')).data; }
  async getAchievements(): Promise<Achievement[]> { return (await this.api.get('/gamification/achievements')).data; }
  async getGlobalLeaderboard(limit?: number): Promise<LeaderboardEntry[]> { return (await this.api.get('/leaderboard/global', { params: { limit } })).data; }
  async getWeeklyLeaderboard(limit?: number): Promise<LeaderboardEntry[]> { return (await this.api.get('/leaderboard/weekly', { params: { limit } })).data; }
  async getMyRank(): Promise<LeaderboardEntry> { return (await this.api.get('/leaderboard/me')).data; }
}
export const api = new ApiService();
