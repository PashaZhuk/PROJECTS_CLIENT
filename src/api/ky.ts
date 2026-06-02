import ky from 'ky';
import { useAuthStore } from '../store/useAuthStore';
import { broadcastAuth } from '../lib/broadcast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

/**
 * Предотвращает race condition при параллельных 401:
 * пока первый refresh в процессе, остальные запросы ждут
 */
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

const doRefresh = async (): Promise<boolean> => {
  if (isRefreshing && refreshPromise) return refreshPromise;

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const res = await ky.post(`${API_BASE_URL}/auth/refresh`, {
        credentials: 'include',
        timeout: 15000,
      });
      return res.ok;
    } catch {
      return false;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

const api = ky.create({
  prefixUrl: API_BASE_URL,
  credentials: 'include',
  timeout: 20000,
  hooks: {
    afterResponse: [
      async (request, _options, response) => {
        if (response.status !== 401 && response.status !== 403) return;

        const url = request.url;

        // Не перехватываем запрос профиля — он просто тихо вернёт null в checkAuth
        if (url.includes('/auth/profile')) return;

        // Не пытаемся обновить токен на самом эндпоинте refresh
        // и на logout (logout сам чистит всё)
        if (url.includes('/auth/refresh') || url.includes('/auth/logout')) {
          return;
        }

        // Пробуем refresh (только для 401)
        if (response.status === 401) {
          const refreshed = await doRefresh();

          if (refreshed) {
            // Токен обновлён, повторяем оригинальный запрос
            return ky(request);
          }
        }

        // Если refresh не удался или это 403 — стандартная обработка ошибок
        try {
          const errorBody = await response.clone().json();
          const {
            isAuthenticated,
            setSessionExpired,
            setSessionSuperseded,
            setUserBlocked,
          } = useAuthStore.getState();

          if (!isAuthenticated) return;

          if (errorBody.code === 'USER_BLOCKED') {
            broadcastAuth('user_blocked');
            setUserBlocked(true);
          } else if (errorBody.code === 'SESSION_SUPERSEDED') {
            broadcastAuth('session_superseded');
            setSessionSuperseded(true);
          } else if (errorBody.code === 'SESSION_EXPIRED') {
            broadcastAuth('session_expired');
            setSessionExpired(true);
          } else {
            broadcastAuth('logout');
            useAuthStore.getState().logout();
          }
        } catch {
          broadcastAuth('logout');
          useAuthStore.getState().logout();
        }
      },
    ],
  },
});

export default api;
