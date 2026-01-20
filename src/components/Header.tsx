import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogIn, Home, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

 const handleLogout = async () => {
  try {
    await logout(); // Ждем, пока сервер удалит куки
    navigate('/');  // Только после этого уходим на главную
  } catch (error) {
    console.error("Ошибка при выходе:", error);
    // В любом случае редиректим, так как стейт в контексте очистится (в блоке finally)
    navigate('/');
  }
};

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Логотип */}
        <Link 
          to={isAuthenticated ? "/dashboard" : "/"} 
          className="flex items-center space-x-2 group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 group-hover:from-blue-700 group-hover:to-purple-700 transition-all duration-200">
            <Home className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            АйПиМатика Бел 
          </span>
        </Link>

        {/* Навигация */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center h-9 w-9 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
              
              <Link
                to="/profile"
                className="hidden md:flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Settings className="h-4 w-4" />
                <span>Профиль</span>
              </Link>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:from-red-700 hover:to-red-800 hover:shadow-lg transition-all duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Выйти</span>
              </button>
            </>
          ) : location.pathname !== '/login' && location.pathname !== '/register' ? (
            <div className="flex space-x-3">
              <Link
                to="/register"
                className="flex items-center space-x-2 rounded-lg border border-blue-600 bg-white px-4 py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-all duration-200"
              >
                <User className="h-4 w-4" />
                <span>Регистрация</span>
              </Link>
              <Link
                to="/login"
                className="flex items-center space-x-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:from-blue-700 hover:to-blue-800 hover:shadow-lg transition-all duration-200"
              >
                <LogIn className="h-4 w-4" />
                <span>Войти</span>
              </Link>
            </div>
          ) : (
            <Link
              to="/"
              className="flex items-center space-x-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:shadow-md transition-all duration-200"
            >
              <Home className="h-4 w-4" />
              <span>На главную</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;