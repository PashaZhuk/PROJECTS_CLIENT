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
  
  // Флаги модалок и состояний
  isSessionExpired: boolean;
  isSessionSuperseded: boolean;
  isUserBlocked: boolean;
  
  // 🔥 НОВЫЕ ПОЛЯ ДЛЯ 2FA
  is2FARequired: boolean;
  tempUserId: number | null;

  // Actions
  setUser: (user: User | null) => void;
  setHasHydrated: (state: boolean) => void;
  setSessionExpired: (expired: boolean) => void;
  setSessionSuperseded: (superseded: boolean) => void;
  setUserBlocked: (blocked: boolean) => void;
  
  // 🔥 НОВЫЕ ACTIONS ДЛЯ 2FA
  setIs2FARequired: (val: boolean) => void;
  setTempUserId: (id: number | null) => void;

  checkAuth: () => Promise<void>;
  
  // 🔥 ИСПРАВЛЕНО: Добавлены timeLeft и attemptsLeft в тип возврата
  login: (credentials: any) => Promise<{ 
    success: boolean; 
    user?: User; 
    message?: string; 
    requires2FA?: boolean; 
    userId?: number;
    timeLeft?: number;        // <-- ДОБАВЛЕНО
    attemptsLeft?: number;    // <-- ДОБАВЛЕНО
  }>;
  
  // 🔥 МЕТОД ПРОВЕРКИ КОДА (тип уже верный)
  verify2FA: (code: string) => Promise<{ 
    success: boolean; 
    user?: User; 
    message?: string;
    timeLeft?: number;
    attemptsLeft?: number;
  }>;
  
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
      
      // 🔥 Инициализация 2FA полей
      is2FARequired: false,
      tempUserId: null,

      setHasHydrated: (state) => set({ _hasHydrated: state }),
      
      // 🔥 Сеттеры для 2FA
      setIs2FARequired: (val) => set({ is2FARequired: val }),
      setTempUserId: (id) => set({ tempUserId: id }),

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
              isInitialized: true,
              is2FARequired: false,
              tempUserId: null
            });
          } else {
            throw new Error('Данные пользователя не найдены');
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          set({ 
            user: null, 
            isAuthenticated: false, 
            isInitialized: true,
            is2FARequired: false,
            tempUserId: null
          });
        }
      },

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const response: any = await authAPI.login(credentials);
          
          // 🔥 ПРОВЕРКА: Требуется ли 2FA?
          if (response.status === '2FA_REQUIRED') {
            const userId = response.data?.userId;
            if (userId) {
              set({ 
                isLoading: false, 
                is2FARequired: true, 
                tempUserId: userId 
              });
              return { 
                success: false, 
                requires2FA: true, 
                userId, 
                message: 'Требуется код подтверждения' 
              };
            }
          }

          // Обычный успешный вход
          const userData = response.user || response.data?.user || response;
          
          if (userData) {
            set({ 
              user: userData, 
              isAuthenticated: true, 
              isLoading: false, 
              isInitialized: true,
              is2FARequired: false,
              tempUserId: null
            });
            return { success: true, user: userData };
          }
          
          set({ isLoading: false });
          return { success: false, message: 'Данные пользователя не получены' };
        } catch (error: any) {
          set({ isLoading: false });
          
          let errorMessage = 'Ошибка входа';
          let extraData: any = {};
          
          try {
            const errorBody = await error.response?.json();
            
            // Поддержка разных ключей ошибки
            errorMessage = errorBody?.error || errorBody?.message || errorBody?.msg || errorMessage;
            
            // Извлекаем данные для блокировок и попыток
            if (errorBody.lockUntil) extraData.lockUntil = new Date(errorBody.lockUntil);
            if (errorBody.timeLeft) extraData.timeLeft = errorBody.timeLeft;
            if (errorBody.attemptsLeft !== undefined) extraData.attemptsLeft = errorBody.attemptsLeft;
            
          } catch (e) {
            errorMessage = error.message || errorMessage;
          }
          
          return { success: false, message: errorMessage, ...extraData };
        }
      },

      // 🔥 НОВЫЙ МЕТОД: Проверка 2FA кода
      verify2FA: async (code: string) => {
        const userId = get().tempUserId;
        if (!userId) {
          return { success: false, message: 'Ошибка сессии: ID пользователя не найден' };
        }

        try {
          const response: any = await authAPI.verify2FACode(userId, code);
          const userData = response.data?.user || response.user;
          
          if (userData) {
            // Успешная верификация: сохраняем пользователя и сбрасываем флаги 2FA
            set({ 
              user: userData, 
              isAuthenticated: true, 
              is2FARequired: false, 
              tempUserId: null,
              isInitialized: true,
              isLoading: false
            });
            return { success: true, user: userData };
          }
          
          return { success: false, message: 'Ошибка проверки кода' };
        } catch (error: any) {
          let errorMessage = 'Неверный код';
          let extraData: any = {};
          
          try {
            const errorBody = await error.response?.json();
            errorMessage = errorBody?.error || errorBody?.message || errorMessage;
            
            if (errorBody.timeLeft) extraData.timeLeft = errorBody.timeLeft;
            if (errorBody.attemptsLeft !== undefined) extraData.attemptsLeft = errorBody.attemptsLeft;
          } catch (e) {
            errorMessage = error.message || errorMessage;
          }
          
          return { success: false, message: errorMessage, ...extraData };
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
            is2FARequired: false, // Сброс 2FA при выходе
            tempUserId: null,
            // ❌ ВАЖНО: НЕ сбрасываем флаги модалок здесь
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
        // Не сохраняем временные поля 2FA в localStorage
      }),
    }
  )
);