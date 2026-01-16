import React, { createContext, useState, useContext, useEffect, } from 'react';
import type { ReactNode } from 'react';
import { authAPI } from '../services/api'

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Симуляция API (замените на реальные эндпоинты)
const mockApi = {
  login: async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Имитация задержки
    return {
      user: {
        id: '1',
        email,
        name: email.split('@')[0],
      },
      token: 'mock-jwt-token-' + Date.now(),
    };
  },
  register: async (name: string, email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      user: {
        id: '2',
        email,
        name,
      },
      token: 'mock-jwt-token-reg-' + Date.now(),
    };
  },
  validateToken: async (token: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      user: {
        id: '1',
        email: 'user@example.com',
        name: 'Test User',
      },
      valid: true,
    };
  },
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Восстановление сессии из localStorage
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      // В реальном приложении здесь должна быть валидация токена на сервере
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await mockApi.login(email, password);
      
      // Сохраняем данные
      setUser(response.user);
      setToken(response.token);
      
      // Сохраняем в localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      console.log('Успешный вход:', response.user);
    } catch (error) {
      console.error('Ошибка входа:', error);
      throw new Error('Неверные учетные данные');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await mockApi.register(name, email, password);
      
      // Автоматически входим после регистрации
      setUser(response.user);
      setToken(response.token);
      
      // Сохраняем в localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      console.log('Успешная регистрация:', response.user);
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      throw new Error('Ошибка при регистрации');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('Выход выполнен');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
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