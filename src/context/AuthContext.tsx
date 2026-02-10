import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import authAPI from '../api/auth';
import userAPI from '../api/user';

// --- 1. ИМПОРТ ЦЕНТРАЛЬНЫХ ТИПОВ ---
import type { User } from '../types'; 

// Интерфейс ответа (можно оставить тут или тоже вынести в типы)
interface AuthResponse {
  success: boolean;
  user?: User;
  message?: string;
  status?: number;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isAuthenticated: boolean;
  isLoading: boolean;
  register: (userData: any) => Promise<AuthResponse>;
  login: (credentials: any) => Promise<AuthResponse>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = !!user;

  // --- ПРОВЕРКА ПРОФИЛЯ ПРИ ЗАГРУЗКЕ ---
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authAPI.profile();
        // Данные теперь автоматически типизируются как User
        setUser(response.data.data);
      } catch (error: any) {
        setUser(null);
        if (!error.response) {
          console.error("Критическая ошибка: Сервер Offline");
        }
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  // --- РЕГИСТРАЦИЯ ---
  const register = async (userData: any): Promise<AuthResponse> => {
    try {
      await userAPI.register(userData);
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.error || 'Ошибка регистрации' 
      };
    }
  };

  // --- ВХОД ---
  const login = async (credentials: any): Promise<AuthResponse> => {
    try {
      const response = await authAPI.login(credentials);
      const userData: User = response.data.data.user; 
      
      setUser(userData);
      return { success: true, user: userData }; 
    } catch (error: any) {
      console.error("Auth error:", error);
      if (error.response) {
        return { 
          success: false, 
          message: error.response.data?.error || 'Неверный логин или пароль',
          status: error.response.status 
        };
      } 
      return { 
        success: false, 
        message: 'Сервер недоступен. Проверьте подключение.',
        status: 503 
      };
    }
  };

  // --- ВЫХОД ---
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      setUser(null);
      // Если используешь react-router, редирект сработает автоматически 
      // благодаря смене стейта user на null в защищенных роутах
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, 
      isAuthenticated, 
      isLoading, 
      register, 
      login, 
      logout 
    }}>
      {/* Красивый лоадер системы */}
      {!isLoading ? children : (
        <div className="h-screen w-full flex items-center justify-center bg-slate-50">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
               <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-blue-600"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                 <div className="h-2 w-2 bg-blue-600 rounded-full animate-pulse"></div>
               </div>
            </div>
            <div className="text-center">
              <p className="text-slate-900 font-black text-[10px] uppercase tracking-[0.3em] mb-1">
                Система Hub
              </p>
              <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest animate-pulse italic">
                Авторизация...
              </p>
            </div>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};