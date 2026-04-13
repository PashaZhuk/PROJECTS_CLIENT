import ky from 'ky';
import { useAuthStore } from '../store/useAuthStore';

const api = ky.create({
  prefixUrl: 'http://192.168.85.110:5001/api',
  credentials: 'include',
  timeout: 20000,
  hooks: {
    afterResponse: [
      async (request, options, response) => {
        if (response.status === 401 || response.status === 403) {
          const url = request.url;
          
          // /auth/profile обрабатывается в checkAuth — пропускаем
          if (url.includes('/auth/profile')) return;

          try {
            const errorBody = await response.clone().json();
            const { isAuthenticated, setSessionExpired, setSessionSuperseded } = useAuthStore.getState();
            
            if (!isAuthenticated) return;

            // Разделяем логику по коду ошибки
            if (errorBody.code === "SESSION_SUPERSEDED") {
              // Вход с другого устройства
              setSessionSuperseded(true);
            } else if (errorBody.code === "SESSION_EXPIRED") {
              // Таймаут неактивности
              setSessionExpired(true);
            } else {
              // Другие ошибки авторизации (например, просто неверный токен)
              useAuthStore.getState().logout();
            }
          } catch (e) {
            // Fallback
            useAuthStore.getState().logout();
          }
        }
      }
    ]
  }
});

export default api;