import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import userApi from '../api/user';
import { broadcastSaved } from '../lib/broadcast';
import type { RegisterInput } from '../types';
import type { AdminStats } from '../types';

// Внутренний тип для пользователя в списке
export interface UserListItem {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  lastSeen: string;
  companyName?: string;
  unp?: string;
  isOnline?: boolean;
  isBlocked?: boolean;
  lockUntil?: string | null;
  failedLoginAttempts?: number;
  twoFactorLockUntil?: string | null;
  twoFactorAttempts?: number;
}

// ---- Queries ----

export const useUsers = (page: number, search: string) => {
  return useQuery({
    queryKey: ['users', page, search],
    queryFn: async () => {
      const response = await userApi.getAllUsers({ page, search }) as any;
      return response.data as {
        users: UserListItem[];
        totalPages: number;
        totalCount: number;
      };
    },
  });
};

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const response = await userApi.getAdminStats() as any;
      return response.data as AdminStats;
    },
    refetchInterval: 30_000, // обновлять каждые 30 секунд
  });
};

// ---- Mutations ----

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RegisterInput) => userApi.register(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => userApi.deleteUser(id),
    onSuccess: (_data, deletedId) => {
      broadcastSaved('user', 'deleted', deletedId);
      // Оптимистично удаляем из кеша
      queryClient.setQueriesData({ queryKey: ['users'] }, (old: any) => {
        if (!old?.users) return old;
        return {
          ...old,
          users: old.users.filter((u: any) => u.id !== deletedId),
          totalCount: Math.max(0, (old.totalCount ?? 0) - 1),
        };
      });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });
};

export const useToggleBlock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => userApi.toggleBlock(id),
    onSuccess: (data, toggledId) => {
      broadcastSaved('user', 'updated', toggledId);
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
