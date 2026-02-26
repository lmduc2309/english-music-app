import client from './client';

export interface AttemptPayload {
  songId: string;
  sentenceId: string;
  userPitchData: number[];
  userDuration: number;
  spokenWords: string[];
}

export const practiceAPI = {
  submitAttempt: (data: AttemptPayload) => client.post('/practice/attempt', data),
  getHistory: (params?: { songId?: string; page?: number }) => client.get('/practice/history', { params }),
  getDailyStats: () => client.get('/practice/daily-stats'),
};
