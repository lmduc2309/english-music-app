import client from './client';

export const leaderboardAPI = {
  getGlobal: (page?: number) => client.get('/leaderboard', { params: { page } }),
  getByLevel: (level: string) => client.get(`/leaderboard/level/${level}`),
  getMyRank: () => client.get('/leaderboard/me'),
};
