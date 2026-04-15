// client/src/hooks/useSessionManager.ts
import { useEffect, useRef, useCallback } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { socket } from '../api/socket'; // Убедись, что путь верный

const INACTIVITY_LIMITS = {
  USER: 1 * 60 * 1000,      // 30 мин
  MANAGER: 2 * 60 * 60 * 1000, // 2 часа
  ADMIN: 2 * 60 * 60 * 1000,
};

const ACTIVITY_EVENTS = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'];

export const useSessionManager = () => {
  const { user, isAuthenticated, logout, setSessionExpired, setSessionSuperseded, setUserBlocked } = useAuthStore();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- ЛОГИКА ТАЙМЕРА НЕАКТИВНОСТИ ---
  const resetTimer = useCallback(() => {
    if (!isAuthenticated || !user) return;
    if (timerRef.current) clearTimeout(timerRef.current);

    const limit = user.role === 'USER' ? INACTIVITY_LIMITS.USER : INACTIVITY_LIMITS.MANAGER;

    timerRef.current = setTimeout(async () => {
      console.log(`[SessionManager] ⏰ Таймаут неактивности (${user.role})`);
      try {
        await logout(); // Очищаем куки на сервере
        setSessionExpired(true); // Показываем модалку
      } catch (e) {
        console.error('Logout on timeout failed:', e);
        setSessionExpired(true); // Все равно показываем модалку
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

  // --- ЛОГИКА СОКЕТОВ (Real-time events) ---
  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    // 1. Входим в персональную комнату
    socket.emit('join_self_room', user.id);

    // 2. Слушаем вытеснение сессии
    const handleSuperseded = () => {
      console.warn('⚠️ [Socket] Сессия вытеснена другим устройством');
      setSessionSuperseded(true);
    };

    // 3. Слушаем блокировку админом
    const handleBlocked = async () => {
      console.warn('🛑 [Socket] Аккаунт заблокирован админом');
      await logout(); // Мгновенная очистка
      setUserBlocked(true);
    };

    socket.on('session_superseded', handleSuperseded);
    socket.on('user_blocked', handleBlocked);

    return () => {
      socket.off('session_superseded', handleSuperseded);
      socket.off('user_blocked', handleBlocked);
    };
  }, [isAuthenticated, user?.id, setSessionSuperseded, setUserBlocked, logout]);
};