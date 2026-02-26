import client from './client';

export const authAPI = {
  register: (data: { email: string; username: string; password: string; displayName: string }) =>
    client.post('/auth/register', data),
  login: (data: { email: string; password: string }) => client.post('/auth/login', data),
  getProfile: () => client.get('/auth/profile'),
  updateProfile: (data: any) => client.patch('/auth/profile', data),
};
