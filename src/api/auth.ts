import api from './ky';   

const authApi = {
  login: (data: any) => api.post('auth/login', { json: data }).json(),
  logout: (reason: 'manual' | 'inactivity' = 'manual', userId?: string) =>
    api.post('auth/logout', { json: { reason, userId } }).json(),
  profile: () => api.get('auth/profile').json(),
  
  // 🔥 НОВЫЕ МЕТОДЫ
  forgotPassword: (email: string) => 
    api.post('auth/forgot-password', { json: { email } }).json(),
    
  resetPassword: (token: string, newPassword: string) => 
    api.post('auth/reset-password', { json: { token, newPassword } }).json(),
};

export default authApi;