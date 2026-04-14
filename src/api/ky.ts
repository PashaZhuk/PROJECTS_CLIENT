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