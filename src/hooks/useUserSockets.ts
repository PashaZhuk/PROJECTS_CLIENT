import { useEffect, useRef } from 'react';
import { getSocket } from '../api/socket';
import { useUserStore } from '../store/useUserStore';
import { useAuthStore } from '../store/useAuthStore';

export const useUserSockets = () => {
  const { fetchUsers, updateUserStatus, updateUserBlockedStatus, setStats } = useUserStore();
  const { user, isAuthenticated } = useAuthStore();
  const hasIdentified = useRef(false);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    const socket = getSocket();
    if (!socket) {
      console.warn('[useUserSockets] Socket not initialized');
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
      setStats(newStats);
    };

    const onUserRegistered = () => {
      if (user.role === 'ADMIN') fetchUsers();
    };

    const onUserOnline = (userId: number) => {
      updateUserStatus(userId, true);
    };

    const onUserOffline = (userId: number) => {
      updateUserStatus(userId, false);
    };

    const onUserBlockedStatusChanged = (data: {
      userId: number;
      isBlocked?: boolean;
      lockUntil?: string | null;
      failedLoginAttempts?: number;
      twoFactorLockUntil?: string | null;
      twoFactorAttempts?: number;
      wasSystemLock?: boolean;
    }) => {
      if (data.isBlocked !== undefined) {
        updateUserBlockedStatus(data.userId, data.isBlocked);
      }
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
  }, [isAuthenticated, user?.id, user?.role, setStats, fetchUsers, updateUserStatus, updateUserBlockedStatus]);
};