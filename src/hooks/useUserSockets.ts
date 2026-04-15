import { useEffect, useRef } from 'react';
import { socket } from '../api/socket';
import { useUserStore } from '../store/useUserStore';
import { useAuthStore } from '../store/useAuthStore';

export const useUserSockets = () => {
  const { fetchUsers, updateUserStatus, updateUserBlockedStatus, setStats } = useUserStore();
  // 🔥 Импортируем logout для немедленной очистки сессии
  const { setUserBlocked, setSessionSuperseded, logout, user, isAuthenticated } = useAuthStore();
  
  const hasIdentified = useRef(false);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    if (!hasIdentified.current) {
      socket.emit('identify_user', { userId: user.id, userRole: user.role });
      hasIdentified.current = true;
    }

    if (user.role === 'ADMIN' || user.role === 'MANAGER') {
      socket.emit('subscribe_admin_stats');
    }

    socket.emit('join_self_room', user.id);

    socket.on('stats_updated', (newStats) => {
      setStats(newStats);
    });

    socket.on('user:registered', () => {
      if (user.role === 'ADMIN') fetchUsers();
    });

    socket.on('user:online', (userId: number) => {
      updateUserStatus(userId, true);
    });

    socket.on('user:offline', (userId: number) => {
      updateUserStatus(userId, false);
    });

    socket.on('user:blocked_status_changed', ({ userId, isBlocked }) => {
      updateUserBlockedStatus(userId, isBlocked);
    });

    // 🔥 БЛОКИРОВКА: МГНОВЕННАЯ ОЧИСТКА СЕССИИ
    socket.on('user_blocked', async () => {
      console.warn('🛑 [Socket] ACCOUNT BLOCKED! Очищаем сессию...');
      
      // 1. Сразу чистим сессию (куки удалятся ответом сервера authAPI.logout)
      await logout(); 
      
      // 2. Показываем модалку поверх "разлогиненного" состояния
      setUserBlocked(true);
    });

    // 🔥 ВЫТЕСНЕНИЕ: МГНОВЕННАЯ ОЧИСТКА СЕССИИ
    socket.on('session_superseded', async () => {
      console.warn('⚠️ [Socket] Session Superseded! Очищаем сессию...');
      
      // 1. Сразу чистим сессию
      await logout();
      
      // 2. Показываем модалку
      setSessionSuperseded(true);
    });

    return () => {
      socket.off('stats_updated');
      socket.off('user:registered');
      socket.off('user:online');
      socket.off('user:offline');
      socket.off('user:blocked_status_changed');
      socket.off('user_blocked');
      socket.off('session_superseded');
    };
  }, [isAuthenticated, user?.id, setStats, fetchUsers, updateUserStatus, updateUserBlockedStatus, setUserBlocked, setSessionSuperseded, logout]);
};