import api from './ky';

const userApi = {
  getAllUsers: (params?: any) => 
    api.get('user/users', { searchParams: params }).json(),
    
  register: (data: any) => 
    api.post('auth/register', { json: data }).json(),
    
  deleteUser: (id: number) => 
    api.delete(`user/users/${id}`).json(),
    
  changePw: (data: any) => 
    api.post('user/change-password', { json: data }).json(),
    
  getAdminStats: () => 
    api.get('user/admin/stats').json(),

  updateUser: (id: number, data: any) => 
    api.put(`user/users/${id}`, { json: data }).json(),
};

export default userApi;