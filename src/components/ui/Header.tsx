import { Link, useNavigate } from 'react-router-dom';
import { LogOut, ShieldCheck, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

const Header = () => {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    } finally {
      navigate('/login');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Логотип — всегда ведёт на /dashboard */}
        <Link
          to={isAuthenticated ? '/dashboard' : '/'}
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
              АйПиМатика Бел
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-6">
          {isInitialized && isAuthenticated && user && (
            <>
              <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
                <div className="hidden md:flex flex-col items-end">
                  <p className="text-sm font-bold text-slate-900 leading-none">
                    {user.companyName || user.name || 'Пользователь'}
                  </p>
                  <p className="text-[9px] uppercase font-black text-slate-400 mt-1 tracking-tighter flex items-center gap-1">
                    {user.role === 'ADMIN' && <><ShieldCheck className="w-2.5 h-2.5" /> Администратор</>}
                    {user.role === 'MANAGER' && 'Менеджер'}
                    {user.role === 'USER' && 'Партнер'}
                  </p>
                </div>

                <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-50 to-blue-100 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                  {user.name ? (
                    <span className="text-sm font-bold text-blue-600">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  ) : (
                    <UserIcon className="w-4 h-4 text-slate-400" />
                  )}
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
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
