import api from './ky';
import type { LoginInput } from '../types';

const authApi = {
  login: (data: LoginInput) => api.post('auth/login', { json: data }).json(),
  logout: (reason: 'manual' | 'inactivity' = 'manual', userId?: string) =>
    api.post('auth/logout', { json: { reason, userId } }).json(),
  profile: () => api.get('auth/profile').json(),
  refresh: () => api.post('auth/refresh').json(),
  forgotPassword: (email: string) => api.post('auth/forgot-password', { json: { email } }).json(),
  resetPassword: (token: string, newPassword: string) => api.post('auth/reset-password', { json: { token, newPassword } }).json(),
  
  // 🔥 2FA Methods
  send2FACode: (userId: number) => api.post('auth/2fa/send', { json: { userId } }).json(),
  verify2FACode: (userId: number, code: string) => api.post('auth/2fa/verify', { json: { userId, code } }).json(),
};

export default authApi;