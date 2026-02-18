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
    (set) => ({
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
        set({ isLoading: true });
        try {
          // В ky мы уже вызвали .json() в authAPI.profile(), 
          // поэтому здесь 'response' — это уже тело ответа.
          const response: any = await authAPI.profile();
          
          const userData = response.data?.user || response.data;

          if (response.status === 'success' || (userData && userData.id)) {
            set({ 
              user: userData, 
              isAuthenticated: true 
            });
          } else {
            set({ user: null, isAuthenticated: false });
          }
        } catch (error) {
          // Если 401 ошибка, ky-hook в ky.ts сработает автоматически,
          // а здесь мы просто сбрасываем состояние
          set({ user: null, isAuthenticated: false });
        } finally {
          set({ isLoading: false, isInitialized: true });
        }
      },

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const response: any = await authAPI.login(credentials);
          
          // Извлекаем данные пользователя
          const userData = response.data?.user || response.data;
          
          if (response.status === 'success' || userData) {
            set({ 
              user: userData, 
              isAuthenticated: true, 
              isLoading: false, 
              isInitialized: true 
            });
            return { success: true, user: userData };
          }
          
          set({ isLoading: false });
          return { success: false, message: response.message || 'Ошибка входа' };
        } catch (error: any) {
          set({ isLoading: false });
          
          // Обработка ошибок в ky: нужно прочитать JSON из ответа ошибки
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
          // Очищаем localStorage вручную, если persist не подхватил
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