import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import authAPI from '../api/auth';
import userAPI from '../api/user';

// --- 1. ТИПИЗАЦИЯ ---
interface User {
  id: number;
  name: string;
  email: string;
  mustChangePassword: boolean;
  companyName?: string;
  role: 'ADMIN' | 'MANAGER' | 'USER';
}

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
        // Берем данные. Если axios интерцептор поймает 401, он сам сделает редирект,
        // сюда выполнение может и не дойти при конфликте сессий.
        setUser(response.data.data);
      } catch (error: any) {
        setUser(null);
        // Если нет ответа от сервера (error.response отсутствует) — значит сервер реально лежит
        if (!error.response) {
          console.error("Критическая ошибка: Сервер не отвечает (Offline)");
        }
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  // --- ФУНКЦИИ ---

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

  const login = async (credentials: any): Promise<AuthResponse> => {
    try {
      const response = await authAPI.login(credentials);
      // Важно: проверяем структуру твоего ответа (response.data.data.user)
      const userData = response.data.data.user; 
      
      setUser(userData);
      return { success: true, user: userData }; 
    } catch (error: any) {
      console.error("Auth error:", error);

      if (error.response) {
        // Ошибка от самого сервера (401, 403, 400 и т.д.)
        return { 
          success: false, 
          message: error.response.data?.error || 'Неверный логин или пароль',
          status: error.response.status 
        };
      } 
      
      // Ошибка сети (Server Offline / ERR_CONNECTION_REFUSED)
      return { 
        success: false, 
        message: 'Сервер недоступен. Проверьте подключение или VPN.',
        status: 503 
      };
    }
  };

 const logout = async () => {
  try {
    await authAPI.logout();
  } catch (error) {
    console.error("Logout error", error);
  } finally {
    // 1. Сначала обнуляем пользователя (это скроет Dashboard)
    setUser(null);
    // 2. Вместо window.location.href используй навигацию, 
    // либо, если хочешь именно перезагрузку, убедись, что она одна.
    // Если используешь react-router-dom: navigate('/login');
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
      {!isLoading ? children : (
        <div className="h-screen w-full flex items-center justify-center bg-slate-50">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest animate-pulse">
              Загрузка системы...
            </p>
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