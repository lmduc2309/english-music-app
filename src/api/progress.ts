import client from './client';

export const progressAPI = {
  getUserProgress: () => client.get('/progress'),
  getSongProgress: (songId: string) => client.get(`/progress/song/${songId}`),
};
