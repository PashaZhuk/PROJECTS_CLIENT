import { useEffect, useRef } from 'react';
import { getSocket } from '../api/socket';
import { useAuthStore } from '../store/useAuthStore';
import { queryClient } from '../lib/queryClient';

export const useUserSockets = () => {
  const { user, isAuthenticated } = useAuthStore();
  const hasIdentified = useRef(false);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    const socket = getSocket();
    if (!socket) {
      return;
    }

    if (!hasIdentified.current) {
      socket.emit('identify_user', { userId: user.id, userRole: user.role });
      hasIdentified.current = true;
    }

    if (user.role === 'ADMIN' || user.role === 'MANAGER') {
      socket.emit('subscribe_admin_stats');
    }

    socket.emit('join_self_room', user.id);

    const onStatsUpdated = (newStats: any) => {
      queryClient.setQueryData(['admin-stats'], newStats);
    };

    const onUserRegistered = () => {
      if (user.role === 'ADMIN') {
        queryClient.invalidateQueries({ queryKey: ['users'] });
      }
    };

    const onUserOnline = (userId: number) => {
      updateUserInCache(userId, { isOnline: true });
    };

    const onUserOffline = (userId: number) => {
      updateUserInCache(userId, { isOnline: false });
    };

    const onUserBlockedStatusChanged = (data: {
      userId: number;
      isBlocked?: boolean;
      lockUntil?: string | null;
      failedLoginAttempts?: number;
      twoFactorLockUntil?: string | null;
      twoFactorAttempts?: number;
    }) => {
      const updates: Record<string, any> = {};
      if (data.isBlocked !== undefined) updates.isBlocked = data.isBlocked;
      if (data.lockUntil !== undefined) updates.lockUntil = data.lockUntil;
      if (data.failedLoginAttempts !== undefined) updates.failedLoginAttempts = data.failedLoginAttempts;
      if (data.twoFactorLockUntil !== undefined) updates.twoFactorLockUntil = data.twoFactorLockUntil;
      if (data.twoFactorAttempts !== undefined) updates.twoFactorAttempts = data.twoFactorAttempts;
      updateUserInCache(data.userId, updates);
    };

    const updateUserInCache = (targetUserId: number, updates: Record<string, any>) => {
      queryClient.setQueriesData({ queryKey: ['users'] }, (old: any) => {
        if (!old?.users) return old;
        return {
          ...old,
          users: old.users.map((u: any) =>
            u.id === targetUserId ? { ...u, ...updates } : u
          ),
        };
      });
    };

    socket.on('stats_updated', onStatsUpdated);
    socket.on('user:registered', onUserRegistered);
    socket.on('user:online', onUserOnline);
    socket.on('user:offline', onUserOffline);
    socket.on('user:blocked_status_changed', onUserBlockedStatusChanged);

    return () => {
      socket.off('stats_updated', onStatsUpdated);
      socket.off('user:registered', onUserRegistered);
      socket.off('user:online', onUserOnline);
      socket.off('user:offline', onUserOffline);
      socket.off('user:blocked_status_changed', onUserBlockedStatusChanged);
    };
  }, [isAuthenticated, user?.id, user?.role]);
};
