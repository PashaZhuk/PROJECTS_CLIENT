import { useEffect, useRef, useCallback } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import authAPI from '../api/auth';

const INACTIVITY_LIMIT_MS: Record<string, number> = {
  USER: 1 * 60 * 1000,
  MANAGER: 2 * 60 * 60 * 1000,
  ADMIN: 2 * 60 * 60 * 1000,
};

const ACTIVITY_EVENTS = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];

export const useInactivityTimer = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setSessionExpired = useAuthStore((state) => state.setSessionExpired);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTimer = useCallback(() => {
    if (!isAuthenticated || !user) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    const limit = INACTIVITY_LIMIT_MS[user.role] ?? INACTIVITY_LIMIT_MS.USER;

    timerRef.current = setTimeout(async () => {
      console.log(`[SessionTimer] ⏰ Сессия истекла (${user.role})`);

      // 1. Сначала чистим клиентское состояние
      localStorage.removeItem('auth-storage');
      useAuthStore.getState().setUser(null);

      // 2. Тихо уведомляем сервер (fire & forget) — передаём reason и userId в теле,
      //    поэтому protect middleware на сервере больше не нужен
      authAPI.logout('inactivity', user.id).catch((err) => {
        console.warn('[SessionTimer] Logout request failed (ignored):', err?.message);
      });

      // 3. Показываем модалку
      setSessionExpired(true);
    }, limit);
  }, [isAuthenticated, user, setSessionExpired]);

  useEffect(() => {
    if (isAuthenticated && user) {
      resetTimer();
    } else if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isAuthenticated, user?.id, resetTimer]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const handleActivity = () => resetTimer();
    ACTIVITY_EVENTS.forEach((e) => window.addEventListener(e, handleActivity, { passive: true }));
    return () => {
      ACTIVITY_EVENTS.forEach((e) => window.removeEventListener(e, handleActivity));
    };
  }, [isAuthenticated, resetTimer]);
};
