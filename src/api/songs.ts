import client from './client';

export const songsAPI = {
  getSongs: (params?: { level?: string; genre?: string; search?: string; page?: number }) =>
    client.get('/songs', { params }),
  getSongById: (id: string) => client.get(`/songs/${id}`),
  getSentences: (songId: string) => client.get(`/songs/${songId}/sentences`),
  getLevels: () => client.get('/songs/levels'),
};
