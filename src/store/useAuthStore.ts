import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import authAPI from '../api/auth';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  isInitialized: boolean;
  setUser: (user: User | null) => void;
  setHasHydrated: (state: boolean) => void;
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

      setHasHydrated: (state) => set({ _hasHydrated: state }),

      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user,
        isLoading: false,
        isInitialized: true
      }),

      checkAuth: async () => {
        // Защита от параллельных запросов
        if (get().isLoading) return;

        set({ isLoading: true });
        try {
          const response: any = await authAPI.profile();
          const userData = response.data?.user || response.data;

          if (userData && userData.id) {
            set({ 
              user: userData, 
              isAuthenticated: true,
              isInitialized: true,
              isLoading: false,
            });
          } else {
            throw new Error('User data missing');
          }
        } catch (error: any) {
          // Определяем — это сетевая ошибка или 401
          const isNetworkError = !error?.response;

          if (isNetworkError) {
            // Сеть недоступна — не сбрасываем сессию, просто помечаем как инициализированных
            // Пользователь остаётся авторизованным из localStorage
            set({ isLoading: false, isInitialized: true });
          } else {
            // Сервер явно ответил ошибкой (401 и т.д.) — сбрасываем сессию
            set({ 
              user: null, 
              isAuthenticated: false, 
              isInitialized: true,
              isLoading: false,
            });
            localStorage.removeItem('auth-storage');
          }
        }
      },

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const response: any = await authAPI.login(credentials);
          const userData = response.data?.user || response.data;
          
          if (userData) {
            set({ 
              user: userData, 
              isAuthenticated: true, 
              isLoading: false, 
              isInitialized: true 
            });
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
        try {
          await authAPI.logout();
        } finally {
          set({ user: null, isAuthenticated: false, isInitialized: true });
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
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
