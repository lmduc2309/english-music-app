import { apiClient } from './client';

export const userAPI = {
  getProfile: () => apiClient.get('/users/profile'),
  updateProfile: (data: { displayName?: string; avatar?: string; preferredGenres?: string[]; dailyGoal?: number }) =>
    apiClient.put('/users/profile', data),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiClient.put('/users/change-password', data),
  getStats: () => apiClient.get('/users/stats'),
};
