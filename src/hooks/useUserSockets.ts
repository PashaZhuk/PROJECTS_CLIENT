import { useEffect } from 'react';
import { socket } from '../api/socket';
import { useUserStore } from '../store/useUserStore';
import { useAuthStore } from '../store/useAuthStore';

export const useUserSockets = () => {
  const { fetchUsers, fetchStats, updateUserStatus, updateUserBlockedStatus } = useUserStore();
  const { setUserBlocked, logout, user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // 1. Входим в персональную комнату ТОЛЬКО если авторизованы
    if (isAuthenticated && user?.id) {
      socket.emit('join_self_room', user.id);
    }

    // ... остальные слушатели (user:registered, user_blocked и т.д.) ...
    socket.on('user:registered', () => {
      fetchUsers();
      fetchStats(true);
    });
    
    // ... (остальной код без изменений) ...
    
    socket.on('user_blocked', () => {
      console.warn('🛑 [Socket] ACCOUNT BLOCKED!');
      setUserBlocked(true);
    });

    return () => {
      socket.off('user:registered');
      socket.off('user_blocked');
      // ... остальные off ...
    };
  }, [isAuthenticated, user?.id, fetchUsers, fetchStats, updateUserStatus, updateUserBlockedStatus, setUserBlocked]);
};