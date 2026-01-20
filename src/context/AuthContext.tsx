import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '../services/api'; // Твой экземпляр axios с withCredentials: true

// --- 1. ТИПИЗАЦИЯ ---

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthResponse {
  success: boolean;
  message?: string;
}

// Интерфейс самого контекста (то, что выдает рация useAuth)
interface AuthContextType {
  user: User | null;
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


  // Автоматическая проверка: залогинен ли юзер (срабатывает при обновлении страницы)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/auth/profile');
        setUser(response.data);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  // --- ФУНКЦИИ ---

  // Регистрация
  const register = async (userData: any): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/register', userData);
      setUser(response.data.data.user); // Подстраивай под структуру своего ответа
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
      const response = await api.post('/auth/login', credentials);
      setUser(response.data.data.user);
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.error || 'Ошибка входа' 
      };
    }
  };

  // Выход
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      setUser(null); // В любом случае очищаем стейт на фронте
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// --- 3. КАСТОМНЫЙ ХУК ---

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};