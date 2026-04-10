import api from './ky';

const authApi = {
  login: (data: any) => api.post('auth/login', { json: data }).json(),
  logout: (reason: 'manual' | 'inactivity' = 'manual', userId?: string) =>
    api.post('auth/logout', { json: { reason, userId } }).json(),
  profile: () => api.get('auth/profile').json(),
};

export default authApi;
