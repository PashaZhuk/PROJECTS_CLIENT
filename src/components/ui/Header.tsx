import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogIn, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Достаем данные из Zustand стора
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Ошибка при выходе:", error);
      navigate('/login');
    }
  };

  const dashboardPath = "/dashboard";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        <Link 
          to={isAuthenticated ? dashboardPath : "/"} 
          className="flex items-center space-x-3 group"
        >
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-md shadow-slate-200 group-hover:scale-105 transition-transform duration-200 overflow-hidden border border-slate-50">
            <img 
              src="/src/assets/logo.webp" 
              alt="АйПиМатика Лого" 
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black text-slate-900 leading-none tracking-tight">
              АйПиМАТИКА Бел
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
                <div className="hidden md:flex flex-col items-end">
                  {/* ИСПОЛЬЗУЕМ user.name вместо username */}
                  <p className="text-sm font-bold text-slate-900 leading-none">
                    {user?.name || 'Пользователь'}
                  </p>
                  <p className="text-[9px] uppercase font-black text-slate-400 mt-1 tracking-tighter">
                    {user?.role === 'ADMIN' && 'Администратор'}
                    {user?.role === 'MANAGER' && 'Менеджер'}
                    {user?.role === 'USER' && 'Партнер'}
                  </p>
                </div>
                {/* Аватар (первая буква name) */}
                <div className="h-9 w-9 rounded-full bg-linear-to-tr from-slate-100 to-slate-200 flex items-center justify-center border-2 border-white shadow-sm">
                  <span className="text-sm font-bold text-blue-600">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                title="Выйти"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </>
          ) : (
            location.pathname !== '/login' && (
              <Link
                to="/login"
                className="flex items-center space-x-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
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