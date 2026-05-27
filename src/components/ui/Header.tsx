import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, ShieldCheck, User as UserIcon, KeyRound, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

const Header = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const logout = useAuthStore((state) => state.logout);

  // Закрытие по клику вне меню
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setMenuOpen(false);
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

                {/* Дропдаун вместо кружка */}
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center gap-1 h-9 rounded-lg bg-gradient-to-tr from-blue-50 to-blue-100 border border-blue-100 px-2.5 hover:from-blue-100 hover:to-blue-200 transition-all shadow-sm"
                  >
                    <div className="flex items-center justify-center">
                      {user.name ? (
                        <span className="text-sm font-bold text-blue-600">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      ) : (
                        <UserIcon className="w-4 h-4 text-blue-500" />
                      )}
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-blue-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-slate-100 shadow-lg shadow-slate-200/50 py-1.5 z-50">
                      <div className="px-4 py-2 border-b border-slate-50">
                        <p className="text-sm font-semibold text-slate-900 truncate">{user.name || 'Пользователь'}</p>
                        <p className="text-xs text-slate-400 truncate">{user.email || ''}</p>
                      </div>

                      <button
                        onClick={() => { setMenuOpen(false); navigate('/change-password'); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        <KeyRound className="w-4 h-4" />
                        Сменить пароль
                      </button>

                      <div className="border-t border-slate-50 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Выйти
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Старая кнопка выхода — убрана, теперь в дропдауне */}
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
