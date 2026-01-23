import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogIn, Home, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Ошибка при выходе:", error);
      navigate('/login');
    }
  };

  // Путь для перехода в личный кабинет
  const dashboardPath = user?.role === 'ADMIN' ? "/admin/dashboard" : "/dashboard";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Логотип: ведет в соответствующий кабинет */}
        <Link 
          to={isAuthenticated ? dashboardPath : "/"} 
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
              {/* Блок пользователя */}
              <div className="flex items-center space-x-3 pr-2">
                <div className="flex items-center justify-center h-9 w-9 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900 leading-none">{user?.name}</p>
                  <p className="text-[10px] uppercase font-bold text-gray-400 mt-1 tracking-wider">
                    {user?.role === 'ADMIN' ? 'Администратор' : 'Клиент'}
                  </p>
                </div>
              </div>

              {/* Ссылка на Панель управления (Dashboard) */}
              <Link
                to={dashboardPath}
                className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors border border-transparent"
              >
                <LayoutDashboard className="h-4 w-4 text-blue-600" />
                <span className="hidden sm:inline">Панель</span>
              </Link>
              
              {/* Кнопка выхода */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Выйти</span>
              </button>
            </>
          ) : (
            /* Если не вошел — только кнопка "Войти" */
            location.pathname !== '/login' && (
              <Link
                to="/login"
                className="flex items-center space-x-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
              >
                <LogIn className="h-4 w-4" />
                <span>Войти</span>
              </Link>
            )
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;