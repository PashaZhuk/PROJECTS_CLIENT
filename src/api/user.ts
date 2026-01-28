import api from './axios';

const userApi = {
  getAllUsers: () => api.get('/user/users').then(res => res.data),
  register: (data: any) => api.post('/user/register', data),
  deleteUser: (id: number) => api.delete(`/user/users/${id}`),
  changePw: (data: any) => api.post('/user/change-password', data),
  getAdminStats: () => api.get('/user/admin/stats').then(res => res.data),
// НОВЫЙ: Обновление данных пользователя (для админа: смена роли, почты и т.д.)
  updateUser: (id: number, data: any) => api.put(`/user/users/${id}`, data).then(res => res.data),
  
};

export default userApi