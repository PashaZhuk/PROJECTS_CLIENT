import { useEffect, useRef } from 'react';
import { getSocket } from '../api/socket';
import { useUserStore } from '../store/useUserStore';
import { useAuthStore } from '../store/useAuthStore';

export const useUserSockets = () => {
  const { fetchUsers, updateUserStatus, updateUserBlockedStatus, setStats } = useUserStore();
  const { setUserBlocked, setSessionSuperseded, logout, user, isAuthenticated } = useAuthStore();
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

    const onUserBlockedStatusChanged = ({ userId, isBlocked }: { userId: number; isBlocked: boolean }) => {
      updateUserBlockedStatus(userId, isBlocked);
    };

    const onUserBlocked = async () => {
      console.warn('🛑 [Socket] ACCOUNT BLOCKED! Очищаем сессию...');
      await logout();
      setUserBlocked(true);
    };

    const onSessionSuperseded = async () => {
      console.warn('⚠️ [Socket] Session Superseded! Очищаем сессию...');
      await logout();
      setSessionSuperseded(true);
    };

    socket.on('stats_updated', onStatsUpdated);
    socket.on('user:registered', onUserRegistered);
    socket.on('user:online', onUserOnline);
    socket.on('user:offline', onUserOffline);
    socket.on('user:blocked_status_changed', onUserBlockedStatusChanged);
    socket.on('user_blocked', onUserBlocked);
    socket.on('session_superseded', onSessionSuperseded);

    return () => {
      socket.off('stats_updated', onStatsUpdated);
      socket.off('user:registered', onUserRegistered);
      socket.off('user:online', onUserOnline);
      socket.off('user:offline', onUserOffline);
      socket.off('user:blocked_status_changed', onUserBlockedStatusChanged);
      socket.off('user_blocked', onUserBlocked);
      socket.off('session_superseded', onSessionSuperseded);
    };
  }, [isAuthenticated, user?.id, user?.role, setStats, fetchUsers, updateUserStatus, updateUserBlockedStatus, setUserBlocked, setSessionSuperseded, logout]);
};