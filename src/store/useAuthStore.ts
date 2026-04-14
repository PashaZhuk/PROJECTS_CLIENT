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
  isSessionExpired: boolean;
  isSessionSuperseded: boolean;
  isUserBlocked: boolean; // ← новый флаг
  setUser: (user: User | null) => void;
  setHasHydrated: (state: boolean) => void;
  setSessionExpired: (expired: boolean) => void;
  setSessionSuperseded: (superseded: boolean) => void;
  setUserBlocked: (blocked: boolean) => void; // ← новый метод
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
          authAPI.logout().catch(() => {});
          set({ isSessionExpired: true, user: null, isAuthenticated: false });
        } else {
          set({ isSessionExpired: false });
        }
      },

      setSessionSuperseded: (superseded) => {
        if (superseded) {
          localStorage.removeItem('auth-storage');
          authAPI.logout().catch(() => {});
          set({ isSessionSuperseded: true, user: null, isAuthenticated: false });
        } else {
          set({ isSessionSuperseded: false });
        }
      },

      setUserBlocked: (blocked) => {
        if (blocked) {
          localStorage.removeItem('auth-storage');
          authAPI.logout().catch(() => {});
          set({ isUserBlocked: true, user: null, isAuthenticated: false });
        } else {
          set({ isUserBlocked: false });
        }
      },

      setUser: (user) => set({
        user,
        isAuthenticated: !!user,
        isLoading: false,
        isInitialized: true,
        isSessionExpired: false,
        isSessionSuperseded: false,
        isUserBlocked: false,
      }),

      checkAuth: async () => {
        if (get().isLoading) return;
        set({ isLoading: true });
        try {
          const response: any = await authAPI.profile();
          const userData = response.data?.user || response.data;
          if (userData && userData.id) {
            set({ user: userData, isAuthenticated: true, isInitialized: true, isLoading: false });
          } else {
            throw new Error('User data missing');
          }
        } catch (error: any) {
          const isNetworkError = !error?.response;
          if (isNetworkError) {
            set({ isLoading: false, isInitialized: true });
          } else {
            set({ user: null, isAuthenticated: false, isInitialized: true, isLoading: false });
            localStorage.removeItem('auth-storage');
          }
        }
      },

      login: async (credentials) => {
        set({ isLoading: true, isSessionExpired: false, isSessionSuperseded: false, isUserBlocked: false });
        try {
          const response: any = await authAPI.login(credentials);
          const userData = response.data?.user || response.data;
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
        try {
          await authAPI.logout();
        } finally {
          set({
            user: null,
            isAuthenticated: false,
            isInitialized: true,
            isSessionExpired: false,
            isSessionSuperseded: false,
            isUserBlocked: false,
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