import { apiClient } from './client';

export const achievementsAPI = {
  getAll: () => apiClient.get('/achievements'),
  getMine: () => apiClient.get('/achievements/mine'),
  check: () => apiClient.post('/achievements/check'),
};
