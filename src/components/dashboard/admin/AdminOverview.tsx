import React from 'react';
import { Users, UserCheck, Activity, ShieldCheck, Loader2 } from 'lucide-react';
import { StatCard, ServerStatus } from './StatCardStatus'; // импорт созданных выше

const AdminOverview = ({ stats, loading, isOnline, onRefresh }: any) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Управление доступом</h2>
          <p className="text-slate-500 font-medium mt-1">Мониторинг активности {!isOnline && <span className="text-red-500 font-black">— СВЯЗЬ ПОТЕРЯНА</span>}</p>
        </div>
        <button onClick={onRefresh} disabled={loading} className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 transition-all shadow-sm active:scale-95">
           <Loader2 size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>
      
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 transition-opacity ${!isOnline ? 'opacity-50' : ''}`}>
        <StatCard title="Партнеры (Users)" value={stats.totalUsers} loading={loading} icon={<Users className="text-blue-600" />} color="blue" />
        <StatCard title="Менеджеры" value={stats.totalManagers} loading={loading} icon={<UserCheck className="text-purple-600" />} color="purple" />
        <StatCard 
          title="Сейчас в сети" 
          value={stats.onlineCount} 
          loading={loading} 
          icon={<Activity className="text-emerald-600" />} 
          color="emerald" 
          subtitle={
            <div className="flex gap-4 mt-4 pt-4 border-t border-emerald-100/50">
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-400 uppercase font-black tracking-wider leading-none">Users</span>
                <span className="text-sm font-black text-emerald-600">{stats.details.onlineUsers}</span>
              </div>
              <div className="flex flex-col border-l border-emerald-100/30 pl-4">
                <span className="text-[9px] text-slate-400 uppercase font-black tracking-wider leading-none">Managers</span>
                <span className="text-sm font-black text-purple-600">{stats.details.onlineManagers}</span>
              </div>
            </div>
          }
        />
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
        <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 uppercase tracking-wider mb-6">
          <ShieldCheck size={20} className="text-blue-500" /> Состояние узлов управления
        </h3>
        <div className="space-y-4">
          <ServerStatus label="Реестр авторизации" isOnline={isOnline} />
          <ServerStatus label="База данных пользователей" isOnline={isOnline} />
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;