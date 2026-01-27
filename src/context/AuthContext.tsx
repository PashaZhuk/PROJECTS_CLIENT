import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import authAPI from '../api/auth';
import userAPI from '../api/user';

// --- 1. ТИПИЗАЦИЯ ---

interface User {
  id: number;
  name: string;
  email: string;
  mustChangePassword: boolean;
  companyName?:string;
  role: 'ADMIN' | 'MANAGER' | 'USER';
}

interface AuthResponse {
  success: boolean;
  user?: User;
  message?: string;
}

interface AuthContextType {
  user: User | null;
  // Исправили any на правильный тип React State
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isAuthenticated: boolean;
  isLoading: boolean;
  register: (userData: any) => Promise<AuthResponse>;
  login: (credentials: any) => Promise<AuthResponse>;
  logout: () => Promise<void>;
}

// --- 2. СОЗДАНИЕ КОНТЕКСТА ---

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = !!user;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authAPI.profile();
        // Убедись, что путь response.data.data соответствует твоему бэкенду
        setUser(response.data.data);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  // --- ФУНКЦИИ ---

  // Регистрация (для админа)
  const register = async (userData: any): Promise<AuthResponse> => {
    try {
      await userAPI.register(userData);
      // ВАЖНО: Мы НЕ вызываем setUser здесь, 
      // потому что админ создает другого пользователя, а не меняет свой аккаунт
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.error || 'Ошибка регистрации' 
      };
    }
  };

  // Логин
  const login = async (credentials: any): Promise<AuthResponse> => {
    try {
      const response = await authAPI.login(credentials);
      // В axios.ts мы договорились использовать чистые данные или .data.data
      const userData = response.data.data.user; 
      
      setUser(userData);
      return { success: true, user: userData }; 
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.error || 'Ошибка входа' 
      };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      setUser(null);
      // Опционально: очистить кэш или редирект
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
      {/* Если приложение грузится, показываем белый экран или спиннер, 
         чтобы не "мигала" форма логина 
      */}
      {!isLoading ? children : (
        <div className="h-screen w-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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