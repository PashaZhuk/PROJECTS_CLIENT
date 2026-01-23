import api from './axios';

const userApi = {
  getAllUsers: () => api.get('/user/users').then(res => res.data),
  register: (data: any) => api.post('/user/register', data),
  deleteUser: (id: number) => api.delete(`/user/users/${id}`),
  changePw: (data: any) => api.post('/user/change-password', data),
};

export default userApi