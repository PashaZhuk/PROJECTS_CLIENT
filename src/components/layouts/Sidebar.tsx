import React, { useState } from 'react';
import { LayoutDashboard, ClipboardList, ShoppingCart, Users, ChevronDown, PlusCircle, List, LogOut } from 'lucide-react';
// Импортируем Zustand стор
import { useAuthStore } from '../../store/useAuthStore';
import type { ActiveTabType } from './DashboardLayout';

const Sidebar = ({ activeTab, setActiveTab }: { activeTab: ActiveTabType, setActiveTab: (t: ActiveTabType) => void }) => {
  // Берем данные и экшены из Zustand
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  
  const [isProjectsOpen, setIsProjectsOpen] = useState(true);
  const [isUsersOpen, setIsUsersOpen] = useState(true);

  const role = user?.role || 'USER'; 

  const themes: any = {
    ADMIN: { text: 'text-purple-600', bg: 'bg-purple-600', shadow: 'shadow-purple-100', active: 'bg-slate-900 text-white shadow-xl' },
    MANAGER: { text: 'text-emerald-600', bg: 'bg-emerald-600', shadow: 'shadow-emerald-100', active: 'bg-emerald-600 text-white shadow-lg' },
    USER: { text: 'text-blue-600', bg: 'bg-blue-600', shadow: 'shadow-blue-100', active: 'bg-blue-600 text-white shadow-lg' }
  };
  const theme = themes[role];

  return (
    <aside className="w-80 bg-white border-r border-slate-100 flex flex-col h-full shrink-0">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-3 h-3 rounded-full ${theme.bg} animate-pulse`} />
          <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${theme.text}`}>
            {role === 'ADMIN' ? 'Администратор' : role === 'MANAGER' ? 'Менеджер' : 'Партнер'}
          </span>
        </div>
        <h1 className="text-2xl font-black tracking-tighter text-slate-900">
          IPMATICA <span className="text-slate-300">HUB</span>
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
        <NavBtn 
          active={activeTab === 'stats'} 
          onClick={() => setActiveTab('stats')} 
          icon={<LayoutDashboard size={20}/>} 
          label="Обзор" 
          theme={theme} 
        />

        {/* Проекты (доступны всем) */}
        <div className="pt-4 pb-2">
          <button 
            onClick={() => setIsProjectsOpen(!isProjectsOpen)}
            className="w-full flex items-center justify-between px-5 py-2 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 hover:text-slate-600 transition-colors"
          >
            <span>Проекты</span>
            <ChevronDown size={14} className={`transition-transform duration-300 ${isProjectsOpen ? '' : '-rotate-90'}`} />
          </button>
          
          {isProjectsOpen && (
            <div className="mt-2 space-y-1 px-2">
              <SubNavBtn 
                active={activeTab === 'projects-list'} 
                onClick={() => setActiveTab('projects-list')} 
                label={role === 'USER' ? "Мои регистрации" : "Все регистрации"} 
                icon={<List size={16}/>} 
                theme={theme} 
              />
              {role === 'USER' && (
                <SubNavBtn 
                  active={activeTab === 'projects-create'} 
                  onClick={() => setActiveTab('projects-create')} 
                  label="Новая заявка" 
                  icon={<PlusCircle size={16}/>} 
                  theme={theme} 
                />
              )}
            </div>
          )}
        </div>

        {/* Админка: Управление пользователями */}
        {role === 'ADMIN' && (
          <div className="pt-4 pb-2">
            <button 
              onClick={() => setIsUsersOpen(!isUsersOpen)}
              className="w-full flex items-center justify-between px-5 py-2 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 hover:text-slate-600 transition-colors"
            >
              <span>Система</span>
              <ChevronDown size={14} className={`transition-transform duration-300 ${isUsersOpen ? '' : '-rotate-90'}`} />
            </button>
            {isUsersOpen && (
              <div className="mt-2 space-y-1 px-2">
                <SubNavBtn 
                  active={activeTab === 'users-list'} 
                  onClick={() => setActiveTab('users-list')} 
                  label="Пользователи" 
                  icon={<Users size={16}/>} 
                  theme={theme} 
                />
                <SubNavBtn 
                  active={activeTab === 'users-create'} 
                  onClick={() => setActiveTab('users-create')} 
                  label="Создать аккаунт" 
                  icon={<PlusCircle size={16}/>} 
                  theme={theme} 
                />
              </div>
            )}
          </div>
        )}

        {role !== 'ADMIN' && (
          <NavBtn active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} icon={<ShoppingCart size={20}/>} label="Заказы" theme={theme} />
        )}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="mb-4 px-4 py-3 bg-slate-50 rounded-2xl">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Аккаунт</p>
            <p className="text-sm font-bold text-slate-700 truncate">{user?.name || user?.name}</p>
        </div>
        <button 
          onClick={() => logout()} 
          className="w-full flex items-center gap-4 p-4 text-slate-400 hover:text-red-500 transition-all rounded-2xl hover:bg-red-50 font-black text-[11px] uppercase tracking-widest"
        >
          <LogOut size={20} />
          <span>Выход</span>
        </button>
      </div>
    </aside>
  );
};

// Вспомогательные компоненты
const NavBtn = ({ active, onClick, icon, label, theme }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${active ? theme.active : 'text-slate-400 hover:bg-slate-50'}`}>
    {icon} <span className="font-bold text-sm">{label}</span>
  </button>
);

const SubNavBtn = ({ active, onClick, label, icon, theme }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${active ? `bg-slate-50 ${theme.text} font-black` : 'text-slate-400 hover:bg-gray-50'}`}>
    {icon} <span className="text-xs">{label}</span>
  </button>
);

export default Sidebar;