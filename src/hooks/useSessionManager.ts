// src/hooks/useSessionManager.ts (клиент)
import { useEffect, useRef, useCallback } from 'react';
import { getSocket } from '../api/socket';
import { useAuthStore } from '../store/useAuthStore';
import { devLog, devError } from '../utils/devLog';
import { broadcastAuth, listenBroadcast } from '../lib/broadcast';

const INACTIVITY_LIMITS = {
  USER: 2 * 60 * 60 * 1000,   // 2 часа для всех
  MANAGER: 2 * 60 * 60 * 1000,
  ADMIN: 2 * 60 * 60 * 1000,
};

const ACTIVITY_EVENTS = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'];

export const useSessionManager = () => {
  const { user, isAuthenticated, logout, setSessionExpired, setSessionSuperseded, setUserBlocked } = useAuthStore();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const subscribedRef = useRef(false);

  const resetTimer = useCallback(() => {
    if (!isAuthenticated || !user) return;
    if (timerRef.current) clearTimeout(timerRef.current);

    const limit = user.role === 'USER' ? INACTIVITY_LIMITS.USER : INACTIVITY_LIMITS.MANAGER;

    timerRef.current = setTimeout(async () => {
      devLog(`[SessionManager] ⏰ Таймаут неактивности (${user.role})`);
      try {
        await logout();
        setSessionExpired(true);
      } catch (e) {
        devError('Logout on timeout failed:', e);
        setSessionExpired(true);
      }
    }, limit);
  }, [isAuthenticated, user, logout, setSessionExpired]);

  useEffect(() => {
    if (isAuthenticated && user) {
      resetTimer();
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isAuthenticated, user?.id, resetTimer]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const handleActivity = () => resetTimer();
    ACTIVITY_EVENTS.forEach(e => window.addEventListener(e, handleActivity, { passive: true }));
    return () => ACTIVITY_EVENTS.forEach(e => window.removeEventListener(e, handleActivity));
  }, [isAuthenticated, resetTimer]);

  // Подписка на сокет-события (session_superseded, user_blocked)
  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    let retryTimer: ReturnType<typeof setTimeout>;
    const subscribe = () => {
      const socket = getSocket();
      if (!socket) {
        retryTimer = setTimeout(subscribe, 1000);
        return;
      }
      if (subscribedRef.current) return;
      subscribedRef.current = true;
      devLog('[SessionManager] Подписка на сокет-события');
      socket.emit('join_self_room', user.id);
      socket.on('session_superseded', () => {
        console.warn('⚠️ Сессия вытеснена');
        broadcastAuth('session_superseded');
        setSessionSuperseded(true);
        logout();
      });
      socket.on('user_blocked', () => {
        console.warn('🛑 Аккаунт заблокирован');
        broadcastAuth('user_blocked');
        logout();
        setUserBlocked(true);
      });
    };
    subscribe();
    return () => {
      if (retryTimer) clearTimeout(retryTimer);
      const socket = getSocket();
      if (socket && subscribedRef.current) {
        socket.off('session_superseded');
        socket.off('user_blocked');
        subscribedRef.current = false;
      }
    };
  }, [isAuthenticated, user?.id, setSessionSuperseded, setUserBlocked, logout]);

  // Слушатель BroadcastChannel — модалки во всех вкладках
  useEffect(() => {
    return listenBroadcast((msg: any) => {
      if (msg?.type === 'auth_event') {
        if (msg.authType === 'session_superseded') {
          setSessionSuperseded(true);
          logout();
        } else if (msg.authType === 'user_blocked') {
          logout();
          setUserBlocked(true);
        } else if (msg.authType === 'session_expired') {
          setSessionExpired(true);
        }
      }
    });
  }, [setSessionSuperseded, setUserBlocked, setSessionExpired, logout]);
};