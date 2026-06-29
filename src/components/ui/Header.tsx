import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, ShieldCheck, KeyRound, ChevronDown, Phone, Bell, X } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

// ─── Типы ──────────────────────────────────────────────

interface ContactsData {
  companyName: string;
  address: string;
  phone: string;
  mobile: string;
  email: string;
  supportEmail: string;
  supportPhone: string;
  workingHours: string;
}

// ─── Дни недели ────────────────────────────────────────

const DAY_SHORT: Record<number, string> = {
  0: 'Вс', 1: 'Пн', 2: 'Вт',
  3: 'Ср', 4: 'Чт', 5: 'Пт', 6: 'Сб',
};

const formatDate = (d: Date): string => {
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const dayName = DAY_SHORT[d.getDay()];
  return `${day}.${month}.${year} - ${dayName}`;
};

// ─── Дропдаун контактов ────────────────────────────────

const ContactsDropdown = ({ onClose }: { onClose: () => void }) => {
  const [contacts, setContacts] = useState<ContactsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/settings/contacts')
      .then(r => r.json())
      .then(data => {
        if (data?.success && data.data) {
          setContacts(typeof data.data === 'string' ? JSON.parse(data.data) : data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white border border-slate-100 shadow-lg shadow-slate-200/50 z-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-50">
        <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Контакты</span>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-500 transition-colors">
          <X size={14} />
        </button>
      </div>

      {loading ? (
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-600 mx-auto" />
        </div>
      ) : !contacts ? (
        <div className="p-6 text-center text-[13px] text-slate-400">Контакты не загружены</div>
      ) : (
        <div className="p-4 space-y-3">
          {/* Отдел продаж */}
          <div className="text-[13px]">
            <p className="text-[10px] font-bold uppercase text-green-600 tracking-wider mb-1">Отдел продаж</p>
            <a href={`tel:${contacts.phone}`} className="block text-sm font-bold text-slate-800 hover:text-blue-600 transition-colors">{contacts.phone}</a>
            <a href={`tel:${contacts.mobile}`} className="block text-sm text-slate-600 hover:text-blue-600 transition-colors">{contacts.mobile}</a>
            <a href={`mailto:${contacts.email}`} className="block text-xs text-blue-600 hover:underline mt-0.5">{contacts.email}</a>
          </div>
          <div className="border-t border-slate-50" />
          {/* Сервисный центр */}
          <div className="text-[13px]">
            <p className="text-[10px] font-bold uppercase text-purple-600 tracking-wider mb-1">Сервисный центр</p>
            <a href={`tel:${contacts.supportPhone}`} className="block text-sm font-bold text-slate-800 hover:text-blue-600 transition-colors">{contacts.supportPhone}</a>
            <a href={`mailto:${contacts.supportEmail}`} className="block text-xs text-blue-600 hover:underline mt-0.5">{contacts.supportEmail}</a>
          </div>
          <div className="border-t border-slate-50" />
          {/* Адрес */}
          <div className="text-[13px]">
            <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">Адрес</p>
            <p className="text-xs text-slate-600">{contacts.address}</p>
          </div>
          {/* Режим работы */}
          <div className="text-[13px]">
            <p className="text-[10px] font-bold uppercase text-amber-600 tracking-wider mb-1">Режим работы</p>
            <p className="text-xs text-slate-600 whitespace-pre-line">{contacts.workingHours}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Дропдаун уведомлений ──────────────────────────────

const NotificationsDropdown = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white border border-slate-100 shadow-lg shadow-slate-200/50 z-50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-50">
        <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Уведомления</span>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-500 transition-colors">
          <X size={14} />
        </button>
      </div>
      <div className="p-8 text-center">
        <Bell size={24} className="mx-auto text-slate-200 mb-2" />
        <p className="text-[13px] text-slate-400 font-medium">Уведомлений пока нет</p>
      </div>
    </div>
  );
};

// ─── Header ─────────────────────────────────────────────

const Header = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactsOpen, setContactsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const contactsRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const [branding, setBranding] = useState<{ companyName?: string; logo?: string }>({});
  const [motto, setMotto] = useState('');

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const logout = useAuthStore((state) => state.logout);

  // ─── Загрузка брендинга и лозунга ───
  useEffect(() => {
    fetch('/api/settings/branding')
      .then(r => r.json())
      .then(data => {
        if (data?.success && data.data) {
          const val = typeof data.data === 'string' ? JSON.parse(data.data) : data.data;
          setBranding(val);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch('/api/settings/daily-motto')
      .then(r => r.json())
      .then(data => {
        if (data?.success && data.data) {
          setMotto(String(data.data));
        }
      })
      .catch(() => {});
  }, []);

  // ─── Закрытие по клику вне ───
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
      if (contactsRef.current && !contactsRef.current.contains(e.target as Node)) setContactsOpen(false);
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) setNotificationsOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
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

  const today = new Date();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur shadow-sm">
      <div className="flex h-16 items-center px-3 gap-0">

        {/* Левая часть: лого + название + дата */}
        <div className="flex items-center gap-3 w-[20%] shrink-0">
          {/* Логотип */}
          <Link
            to={isAuthenticated ? '/dashboard' : '/'}
            className="flex items-center space-x-3 group shrink-0"
          >
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-md shadow-slate-200 group-hover:scale-105 transition-transform duration-200 overflow-hidden border border-slate-50">
              {branding.logo ? (
                <img src={branding.logo} alt="Логотип" className="h-full w-full object-cover" />
              ) : (
                <img src="/src/assets/logo.webp" alt="АйПиМатика Лого" className="h-full w-full object-cover" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black text-slate-900 leading-none tracking-tight">
                {branding.companyName || 'АйПиМатика Бел - B2B'}
              </span>
            </div>
          </Link>

          {/* Разделитель + Сегодня/дата — только для авторизованных */}
          {isAuthenticated && (
            <>
              <div className="w-px h-8 bg-slate-200 shrink-0" />
              <div className="flex flex-col shrink-0">
                <span className="text-[11px] font-black uppercase text-slate-400 tracking-widest leading-none">Сегодня</span>
                <span className="text-[11px] text-slate-600 font-medium leading-tight whitespace-nowrap">{formatDate(today)}</span>
              </div>
            </>
          )}
        </div>

        {/* Центральная часть: лозунг — только для авторизованных */}
        {isAuthenticated && motto && (
          <div className="flex items-center justify-center flex-1 min-w-0 px-4">
            <div className="w-px h-8 bg-slate-200 shrink-0" />
            <div className="flex-1 flex items-center justify-center min-w-0 px-4">
              <p className="text-[17px] text-slate-500 font-medium truncate leading-tight text-center">
                {motto}
              </p>
            </div>
            <div className="w-px h-8 bg-slate-200 shrink-0" />
          </div>
        )}

        {/* Правая часть: контакты, уведомления, пользователь */}
        <div className="flex items-center justify-end gap-2 w-[20%] shrink-0">
          {isInitialized && isAuthenticated && user && (
            <>
              {/* Трубка — контакты */}
              <div className="relative" ref={contactsRef}>
                <button
                  onClick={() => { setContactsOpen(!contactsOpen); setNotificationsOpen(false); }}
                  className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-50 to-blue-100 border border-blue-100 text-blue-500 hover:from-blue-100 hover:to-blue-200 transition-all shadow-sm"
                  title="Контакты"
                >
                  <Phone size={14} />
                </button>
                {contactsOpen && <ContactsDropdown onClose={() => setContactsOpen(false)} />}
              </div>

              {/* Колокольчик — уведомления (только для MANAGER/USER) */}
              {user.role !== 'ADMIN' && (
                <div className="relative" ref={notificationsRef}>
                  <button
                    onClick={() => { setNotificationsOpen(!notificationsOpen); setContactsOpen(false); }}
                    className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-50 to-blue-100 border border-blue-100 text-blue-500 hover:from-blue-100 hover:to-blue-200 transition-all shadow-sm"
                    title="Уведомления"
                  >
                    <Bell size={14} />
                    {/* Красный кружок-заглушка */}
                    <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full flex items-center justify-center">
                      <span className="text-[6px] font-bold text-white leading-none">0</span>
                    </span>
                  </button>
                  {notificationsOpen && <NotificationsDropdown onClose={() => setNotificationsOpen(false)} />}
                </div>
              )}

              {/* Пользователь */}
              <div className="flex items-center gap-3 pl-2 border-l border-slate-100">
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

                {/* Дропдаун пользователя */}
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-50 to-blue-100 border border-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all shadow-sm"
                  >
                    <ChevronDown className={`w-4 h-4 text-blue-500 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-slate-100 shadow-lg shadow-slate-200/50 py-1.5 z-50">
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
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
