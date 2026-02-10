import React, { useState } from 'react';
import { LayoutDashboard, ClipboardList, ShoppingCart, Users, ChevronDown, PlusCircle, List, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { ActiveTabType } from './DashboardLayout';

const Sidebar = ({ activeTab, setActiveTab }: { activeTab: ActiveTabType, setActiveTab: (t: ActiveTabType) => void }) => {
  const { user, logout } = useAuth();
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
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 z-20">
      <div className="p-8">
        <div className={`flex items-center gap-3 ${theme.text}`}>
          <div className={`w-11 h-11 ${theme.bg} rounded-2xl flex items-center justify-center text-white font-black shadow-lg ${theme.shadow}`}>
            {role.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="text-slate-900 font-black text-lg leading-tight uppercase tracking-tighter">
              {role === 'USER' ? 'Partner' : role === 'MANAGER' ? 'Manager' : 'Admin'}<span className={theme.text}>Hub</span>
            </span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto text-[11px] font-black uppercase tracking-widest">
        {/* ОБЩАЯ ВКЛАДКА ДЛЯ ВСЕХ */}
        <NavBtn active={activeTab === 'stats'} onClick={() => setActiveTab('stats')} icon={<LayoutDashboard size={20}/>} label="Обзор" theme={theme} />

        {/* СЕКЦИЯ ПРОЕКТЫ (СКРЫТО ДЛЯ ADMIN) */}
        {role !== 'ADMIN' && (
          <div className="pt-2">
            {role === 'USER' ? (
              <>
                <MenuHeader label="Проекты" isOpen={isProjectsOpen} toggle={() => setIsProjectsOpen(!isProjectsOpen)} />
                {isProjectsOpen && (
                  <div className="ml-4 border-l-2 border-slate-100 pl-2 space-y-1 mt-1">
                    <SubNavBtn active={activeTab === 'projects-list'} onClick={() => setActiveTab('projects-list')} label="Мои регистрации" icon={<List size={14}/>} theme={theme} />
                    <SubNavBtn active={activeTab === 'projects-create'} onClick={() => setActiveTab('projects-create')} label="Новый проект" icon={<PlusCircle size={14}/>} theme={theme} />
                  </div>
                )}
              </>
            ) : (
              <NavBtn active={activeTab === 'projects-list'} onClick={() => setActiveTab('projects-list')} icon={<ClipboardList size={20}/>} label="Регистрации" theme={theme} />
            )}
          </div>
        )}

        {/* СЕКЦИЯ УПРАВЛЕНИЯ (ТОЛЬКО ДЛЯ ADMIN) */}
        {role === 'ADMIN' && (
          <div className="pt-2">
              <MenuHeader label="Доступ" isOpen={isUsersOpen} toggle={() => setIsUsersOpen(!isUsersOpen)} />
              {isUsersOpen && (
                <div className="ml-4 border-l-2 border-slate-100 pl-2 space-y-1 mt-1">
                  <SubNavBtn active={activeTab === 'users-list'} onClick={() => setActiveTab('users-list')} label="Пользователи" icon={<Users size={14}/>} theme={theme} />
                  <SubNavBtn active={activeTab === 'users-create'} onClick={() => setActiveTab('users-create')} label="Создать аккаунт" icon={<PlusCircle size={14}/>} theme={theme} />
                </div>
              )}
          </div>
        )}

        {/* ЗАКАЗЫ (СКРЫТО ДЛЯ ADMIN) */}
        {role !== 'ADMIN' && (
          <NavBtn active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} icon={<ShoppingCart size={20}/>} label="Заказы" theme={theme} />
        )}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button onClick={logout} className="w-full flex items-center gap-4 p-4 text-slate-400 hover:text-red-500 transition-all rounded-2xl hover:bg-red-50 font-black text-[11px] uppercase tracking-widest">
          <LogOut size={20} />
          <span>Выход</span>
        </button>
      </div>
    </aside>
  );
};

// Вспомогательные компоненты без изменений
const NavBtn = ({ active, onClick, icon, label, theme }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${active ? theme.active : 'text-slate-400 hover:bg-slate-50'}`}>
    {icon} <span>{label}</span>
  </button>
);

const SubNavBtn = ({ active, onClick, label, icon, theme }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${active ? `bg-slate-50 ${theme.text} font-black` : 'text-slate-400 hover:bg-gray-50'}`}>
    {icon} <span>{label}</span>
  </button>
);

const MenuHeader = ({ label, isOpen, toggle }: any) => (
  <button onClick={toggle} className="w-full flex items-center justify-between px-5 py-2 text-slate-300 font-black text-[9px] uppercase tracking-[0.2em]">
    <span>{label}</span>
    <ChevronDown size={12} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
  </button>
);

export default Sidebar;