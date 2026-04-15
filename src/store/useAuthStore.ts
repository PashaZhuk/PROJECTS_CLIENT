import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import authAPI from '../api/auth';
import { socket } from '../api/socket';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  isInitialized: boolean;
  isSessionExpired: boolean;
  isSessionSuperseded: boolean;
  isUserBlocked: boolean;
  setUser: (user: User | null) => void;
  setHasHydrated: (state: boolean) => void;
  setSessionExpired: (expired: boolean) => void;
  setSessionSuperseded: (superseded: boolean) => void;
  setUserBlocked: (blocked: boolean) => void;
  checkAuth: () => Promise<void>;
  login: (credentials: any) => Promise<{ success: boolean; user?: User; message?: string }>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      _hasHydrated: false,
      isInitialized: false,
      isSessionExpired: false,
      isSessionSuperseded: false,
      isUserBlocked: false,

      setHasHydrated: (state) => set({ _hasHydrated: state }),

      setSessionExpired: (expired) => {
        if (expired) {
          localStorage.removeItem('auth-storage');
          authAPI.logout('inactivity').catch(() => {});
        }
        set({ isSessionExpired: expired });
      },

      setSessionSuperseded: (superseded) => set({ isSessionSuperseded: superseded }),
      setUserBlocked: (blocked) => set({ isUserBlocked: blocked }),
      setUser: (user) => set({ user, isAuthenticated: !!user }),

      checkAuth: async () => {
        try {
          const response: any = await authAPI.profile();
          const userData = response.data?.user || response.data || response.user || response; 
          
          if (userData && userData.id) {
            set({ 
              user: userData, 
              isAuthenticated: true, 
              isInitialized: true 
            });
          } else {
            throw new Error('Данные пользователя не найдены');
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          set({ 
            user: null, 
            isAuthenticated: false, 
            isInitialized: true 
          });
        }
      },

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const response: any = await authAPI.login(credentials);
          const userData = response.user || response.data?.user || response;
          
          if (userData) {
            set({ user: userData, isAuthenticated: true, isLoading: false, isInitialized: true });
            return { success: true, user: userData };
          }
          set({ isLoading: false });
          return { success: false, message: 'Данные пользователя не получены' };
        } catch (error: any) {
          set({ isLoading: false });
          let errorMessage = 'Ошибка входа';
          try {
            const errorBody = await error.response?.json();
            errorMessage = errorBody?.message || errorMessage;
          } catch (e) {
            errorMessage = error.message || errorMessage;
          }
          return { success: false, message: errorMessage };
        }
      },

      logout: async () => {
        const currentUser = get().user;
        try {
          if (socket.connected) {
            socket.emit('user_logging_out');
          }
          await authAPI.logout('manual', currentUser?.id?.toString());
        } finally {
          socket.disconnect();
          socket.connect(); // Переподключаем чистый сокет

          set({
            user: null,
            isAuthenticated: false,
            isInitialized: true,
            isSessionExpired: false,
            // ❌ ВАЖНО: НЕ сбрасываем флаги модалок здесь, чтобы они могли отобразиться после logout
            // isSessionSuperseded: false, 
            // isUserBlocked: false,
          });
          localStorage.removeItem('auth-storage');
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);