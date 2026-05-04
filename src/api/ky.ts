import ky from 'ky';
import { useAuthStore } from '../store/useAuthStore';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = ky.create({
  prefixUrl: API_BASE_URL,
  credentials: 'include',
  timeout: 20000,
  hooks: {
    afterResponse: [
      async (request, _options, response) => {
        if (response.status === 401 || response.status === 403) {
          const url = request.url;
          if (url.includes('/auth/profile')) return;

          try {
            const errorBody = await response.clone().json();
            const { isAuthenticated, setSessionExpired, setSessionSuperseded, setUserBlocked } = useAuthStore.getState();

            if (!isAuthenticated) return;

            if (errorBody.code === "USER_BLOCKED") {
              setUserBlocked(true);
            } else if (errorBody.code === "SESSION_SUPERSEDED") {
              setSessionSuperseded(true);
            } else if (errorBody.code === "SESSION_EXPIRED") {
              setSessionExpired(true);
            } else {
              useAuthStore.getState().logout();
            }
          } catch (e) {
            useAuthStore.getState().logout();
          }
        }
      }
    ]
  }
});

export default api;