import api from './ky';

const authApi = {
  login: (data: any) => api.post('auth/login', { json: data }).json(),
  logout: (reason: 'manual' | 'inactivity' = 'manual', userId?: string) =>
    api.post('auth/logout', { json: { reason, userId } }).json(),
  profile: () => api.get('auth/profile').json(),
  forgotPassword: (email: string) => api.post('auth/forgot-password', { json: { email } }).json(),
  resetPassword: (token: string, newPassword: string) => api.post('auth/reset-password', { json: { token, newPassword } }).json(),
  
  // 🔥 2FA Methods
  send2FACode: (userId: number) => api.post('auth/2fa/send', { json: { userId } }).json(),
  verify2FACode: (userId: number, code: string) => api.post('auth/2fa/verify', { json: { userId, code } }).json(),
};

export default authApi;