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

          // /auth/profile сам обрабатывается в checkAuth — не трогаем
          if (url.includes('/auth/profile')) return;

          // Для всех остальных эндпоинтов — сбрасываем store,
          // React Router сам перенаправит через ProtectedRoute
          const { isAuthenticated } = useAuthStore.getState();
          if (isAuthenticated) {
            useAuthStore.getState().logout();
          }
        }
      }
    ]
  }
});

export default api;
