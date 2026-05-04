// src/hooks/useSessionManager.ts
import { useEffect, useRef, useCallback } from 'react';
import { getSocket } from '../api/socket'; // Импортируем наш новый метод
import { useAuthStore } from '../store/useAuthStore';

const INACTIVITY_LIMITS = {
  USER: 30 * 60 * 1000,      // 30 минут (поправил на 30 мин, как в серверной логике)
  MANAGER: 120 * 60 * 1000,   // 2 часа
  ADMIN: 120 * 60 * 1000,     // 2 часа
};

const ACTIVITY_EVENTS = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'];

export const useSessionManager = () => {
  const { user, isAuthenticated, logout, setSessionExpired, setSessionSuperseded, setUserBlocked } = useAuthStore();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- ЛОГИКА ТАЙМЕРА НЕАКТИВНОСТИ (остается без изменений) ---
  const resetTimer = useCallback(() => {
    if (!isAuthenticated || !user) return;
    if (timerRef.current) clearTimeout(timerRef.current);

    const limit = user.role === 'USER' ? INACTIVITY_LIMITS.USER : INACTIVITY_LIMITS.MANAGER;

    timerRef.current = setTimeout(async () => {
      console.log(`[SessionManager] ⏰ Таймаут неактивности (${user.role})`);
      try {
        await logout();
        setSessionExpired(true);
      } catch (e) {
        console.error('Logout on timeout failed:', e);
        setSessionExpired(true);
      }
    }, limit);
  }, [isAuthenticated, user, logout, setSessionExpired]);

  // Запуск/остановка таймера
  useEffect(() => {
    if (isAuthenticated && user) {
      resetTimer();
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isAuthenticated, user?.id, resetTimer]);

  // Слушатели активности
  useEffect(() => {
    if (!isAuthenticated) return;
    const handleActivity = () => resetTimer();
    ACTIVITY_EVENTS.forEach(e => window.addEventListener(e, handleActivity, { passive: true }));
    return () => ACTIVITY_EVENTS.forEach(e => window.removeEventListener(e, handleActivity));
  }, [isAuthenticated, resetTimer]);

  // --- ЛОГИКА СОКЕТОВ (Real-time events) — ИСПРАВЛЕНА ---
  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    // Получаем сокет, если он еще не инициализирован — выходим
    const socket = getSocket();
    if (!socket) {
      console.warn('[useSessionManager] Socket not initialized, retrying in 1s...');
      // Простая повторная попытка через секунду
      const retryTimer = setTimeout(() => {
        const retrySocket = getSocket();
        if (retrySocket) {
          console.log('[useSessionManager] Socket found on retry, registering handlers.');
          retrySocket.emit('join_self_room', user.id);
          // Здесь можно было бы заново вызвать эффект или применить логику,
          // но проще всего — сработает следующий эффект или перезагрузка.
        }
      }, 1000);
      return () => clearTimeout(retryTimer);
    }

    console.log('[useSessionManager] Registering socket listeners for user:', user.id);
    // Входим в персональную комнату
    socket.emit('join_self_room', user.id);

    // Слушаем вытеснение сессии
    const handleSuperseded = () => {
      console.warn('⚠️ [Socket] Сессия вытеснена другим устройством');
      setSessionSuperseded(true);
    };

    // Слушаем блокировку админом
    const handleBlocked = async () => {
      console.warn('🛑 [Socket] Аккаунт заблокирован админом');
      await logout();
      setUserBlocked(true);
    };

    // Также можно дополнительно слушать разблокировку, если нужно
    const handleUnblocked = () => {
      console.log('✅ [Socket] Аккаунт разблокирован администратором');
      // Опционально: можно перезагрузить страницу или попытаться восстановить сессию
      // setUserBlocked(false);
    };

    socket.on('session_superseded', handleSuperseded);
    socket.on('user_blocked', handleBlocked);
    // Опционально: если сервер присылает 'user_unblocked'
    socket.on('user_unblocked', handleUnblocked);

    return () => {
      socket.off('session_superseded', handleSuperseded);
      socket.off('user_blocked', handleBlocked);
      socket.off('user_unblocked', handleUnblocked);
    };
  }, [isAuthenticated, user?.id, setSessionSuperseded, setUserBlocked, logout]);
};