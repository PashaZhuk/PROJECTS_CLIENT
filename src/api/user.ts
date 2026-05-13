import api from './ky';
import type { RegisterInput, ChangePasswordInput, UsersQueryParams } from '../types';

const userApi = {
  getAllUsers: (params?: UsersQueryParams) =>
    api.get('user/users', { searchParams: params }).json(),

  register: (data: RegisterInput) =>
    api.post('auth/register', { json: data }).json(),

  deleteUser: (id: number) =>
    api.delete(`user/users/${id}`).json(),

  changePw: (data: ChangePasswordInput) =>
    api.post('user/change-password', { json: data }).json(),

  getAdminStats: () =>
    api.get('user/admin/stats').json(),

  toggleBlock: (id: number) =>
    api.patch(`user/users/${id}/block`).json<{ isBlocked: boolean }>(),
};

export default userApi;