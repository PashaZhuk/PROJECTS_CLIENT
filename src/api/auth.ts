import api from './ky';

const authApi = {
  login: (data: any) => api.post('auth/login', { json: data }).json(),
  logout: () => api.post('auth/logout').json(),
  profile: () => api.get('auth/profile').json(),
};

export default authApi;