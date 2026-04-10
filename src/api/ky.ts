import ky from 'ky';
import { useAuthStore } from '../store/useAuthStore';

const api = ky.create({
  prefixUrl: 'http://192.168.0.105:5001/api',
  credentials: 'include',
  timeout: 20000,
  hooks: {
    afterResponse: [
      async (request, options, response) => {
        if (response.status === 401 || response.status === 403) {
          const url = request.url;
          
          // /auth/profile обрабатывается в checkAuth — пропускаем
          if (url.includes('/auth/profile')) return;

          const { isAuthenticated, isSessionExpired, setSessionExpired } = useAuthStore.getState();
          
          // Если модалка уже висит — ничего не делаем
          if (isSessionExpired) return;

          // Иначе помечаем сессию как истёкшую и вызываем logout для очистки куки
          if (isAuthenticated) {
            // <-- ДОБАВЛЕНО: вызываем logout API, чтобы сервер удалил куку
            useAuthStore.getState().logout().catch(console.error);
            setSessionExpired(true);
          }
        }
      }
    ]
  }
});

export default api;