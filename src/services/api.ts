import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:3000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {'Content-Type': 'application/json'},
});

// Request interceptor: attach auth token
api.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle token refresh
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        const userId = await AsyncStorage.getItem('userId');
        if (refreshToken && userId) {
          const {data} = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            userId,
            refreshToken,
          });
          await AsyncStorage.setItem('accessToken', data.accessToken);
          await AsyncStorage.setItem('refreshToken', data.refreshToken);
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(originalRequest);
        }
      } catch (e) {
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'userId']);
      }
    }
    return Promise.reject(error);
  },
);

// Auth
export const authAPI = {
  register: (data: {email: string; username: string; password: string}) =>
    api.post('/auth/register', data),
  login: (data: {email: string; password: string}) =>
    api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
};

// Songs
export const songsAPI = {
  getAll: (params?: {level?: string; genre?: string; search?: string; page?: number}) =>
    api.get('/songs', {params}),
  getById: (id: string) => api.get(`/songs/${id}`),
  getSentences: (id: string) => api.get(`/songs/${id}/sentences`),
  getByLevel: (level: string) => api.get(`/songs/level/${level}`),
};

// Lessons
export const lessonsAPI = {
  getLesson: (songId: string) => api.get(`/lessons/${songId}`),
  getRecommendations: (level: string) => api.get(`/lessons/recommendations/${level}`),
};

// Scoring
export const scoringAPI = {
  evaluate: (data: {
    sentenceId: string;
    recognizedText: string;
    userPitchData?: {time: number; frequency: number}[];
    userDuration: number;
  }) => api.post('/scoring/evaluate', data),
  getHistory: (songId?: string) =>
    api.get('/scoring/history', {params: {songId}}),
};

// Progress
export const progressAPI = {
  getAll: () => api.get('/progress'),
  getStats: () => api.get('/progress/stats'),
  getSong: (songId: string) => api.get(`/progress/${songId}`),
};

// Leaderboard
export const leaderboardAPI = {
  getGlobal: (limit?: number) => api.get('/leaderboard/global', {params: {limit}}),
  getWeekly: (limit?: number) => api.get('/leaderboard/weekly', {params: {limit}}),
  getSong: (songId: string) => api.get(`/leaderboard/song/${songId}`),
};

// Achievements
export const achievementsAPI = {
  getAll: () => api.get('/achievements'),
  getMine: () => api.get('/achievements/mine'),
};

// Users
export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: any) => api.put('/users/profile', data),
};

export default api;
