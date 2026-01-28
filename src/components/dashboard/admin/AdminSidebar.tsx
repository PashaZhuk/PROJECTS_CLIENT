import React from 'react';
import { LayoutDashboard, Users, ChevronDown, LogOut, Menu, X } from 'lucide-react';

const AdminSidebar = ({ isSidebarOpen, setIsSidebarOpen, activeTab, setActiveTab, isUsersOpen, setIsUsersOpen, user, logout }: any) => {
  return (
    <aside className={`${isSidebarOpen ? 'w-72' : 'w-24'} bg-white border-r border-slate-200 transition-all duration-300 flex flex-col z-20`}>
      <div className="p-8 flex items-center justify-between">
        {isSidebarOpen && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black text-sm">A</div>
            <span className="font-black text-lg tracking-tighter uppercase italic">Admin<span className="text-blue-600">HQ</span></span>
          </div>
        )}
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400">
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <nav className="flex-grow px-4 space-y-2">
        <NavButton active={activeTab === 'info'} onClick={() => setActiveTab('info')} icon={<LayoutDashboard size={20} />} label="Дашборд" expanded={isSidebarOpen} />
        <div className="space-y-1">
          <button 
            onClick={() => { setIsUsersOpen(!isUsersOpen); if (!isSidebarOpen) setIsSidebarOpen(true); }}
            className="w-full flex items-center justify-between p-4 rounded-2xl text-slate-500 hover:bg-slate-50 transition-all"
          >
            <div className="flex items-center gap-4">
              <Users size={20} />
              {isSidebarOpen && <span className="text-sm font-black uppercase tracking-tight text-slate-700">Пользователи</span>}
            </div>
            {isSidebarOpen && <ChevronDown size={16} className={`transition-transform duration-300 ${isUsersOpen ? 'rotate-180' : ''}`} />}
          </button>
          {isUsersOpen && isSidebarOpen && (
            <div className="ml-10 space-y-1 animate-in slide-in-from-top-2 duration-300">
              <SubNavButton active={activeTab === 'user-list'} onClick={() => setActiveTab('user-list')} label="Список реестра" />
              <SubNavButton active={activeTab === 'user-create'} onClick={() => setActiveTab('user-create')} label="Новый аккаунт" />
            </div>
          )}
        </div>
      </nav>

      <div className="p-6 border-t border-slate-100 space-y-4">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-slate-100 text-slate-900 border border-slate-200 rounded-2xl flex items-center justify-center font-black uppercase shadow-sm">
            {user?.email?.[0]}
          </div>
          {isSidebarOpen && (
            <div className="flex-grow overflow-hidden">
              <p className="text-[11px] font-black text-slate-900 truncate uppercase tracking-tighter">{user?.email}</p>
              <p className="text-[9px] text-blue-600 font-black uppercase tracking-[0.2em] mt-0.5">Root Administrator</p>
            </div>
          )}
        </div>
        <button onClick={logout} className="w-full flex items-center gap-4 p-4 text-slate-400 hover:text-red-500 font-bold text-sm transition-all rounded-2xl hover:bg-red-50">
          <LogOut size={20} />
          {isSidebarOpen && <span className="uppercase text-[11px] font-black tracking-widest">Выход</span>}
        </button>
      </div>
    </aside>
  );
};

const NavButton = ({ active, onClick, icon, label, expanded }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${active ? 'bg-slate-900 text-white shadow-xl scale-[1.02]' : 'text-slate-400 hover:bg-slate-50'}`}>
    <span className={active ? 'text-blue-400' : ''}>{icon}</span>
    {expanded && <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>}
  </button>
);

const SubNavButton = ({ active, onClick, label }: any) => (
  <button onClick={onClick} className={`w-full text-left p-3.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${active ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-slate-700'}`}>
    • {label}
  </button>
);

export default AdminSidebar;