import { ShieldCheck, Loader2, Activity, Users, UserCheck } from 'lucide-react';
import { StatCard, ServerStatus } from '../shared/StatCardStatus';

const AdminOverview = ({ stats, loading, isOnline, onRefresh }: any) => {
  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Заголовок в стиле StatsView */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">
            Root <span className="text-purple-600">Administrator</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-4 flex items-center gap-2">
            <Activity size={12} className={isOnline ? "text-emerald-500" : "text-red-500"} /> 
            Мониторинг системы: {isOnline ? 'АКТИВЕН' : 'СВЯЗЬ ПОТЕРЯНА'}
          </p>
        </div>
        <button 
          onClick={onRefresh} 
          disabled={loading} 
          className="group p-4 bg-white border border-slate-200 rounded-3xl text-slate-400 hover:text-purple-600 shadow-sm transition-all active:scale-90"
        >
          <Loader2 size={24} className={loading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"} />
        </button>
      </div>
      
      {/* Сетка твоих StatCard */}
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

      {/* Статус серверов */}
      <div className="bg-white rounded-[3rem] border border-slate-200 p-10 shadow-sm">
        <h3 className="text-xl font-black text-slate-800 flex items-center gap-3 uppercase tracking-wider mb-8">
          <ShieldCheck size={24} className="text-purple-500" /> Состояние узлов управления
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ServerStatus label="Реестр авторизации" isOnline={isOnline} />
          <ServerStatus label="База данных пользователей" isOnline={isOnline} />
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;