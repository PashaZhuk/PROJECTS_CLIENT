import { ShieldCheck, Activity } from 'lucide-react';
import { StatCard, ServerStatus } from '../shared/StatCardStatus';

const AdminOverview = ({ stats, loading, isOnline, onRefresh }: any) => {
  if (!stats) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
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
          className="p-4 bg-white border border-slate-200 rounded-3xl text-slate-400 hover:text-purple-600 shadow-sm transition-all active:scale-95 disabled:opacity-50"
        >
          Обновить данные
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <StatCard 
          title="Всего пользователей" 
          value={stats.totalUsers} 
          icon={<Activity className="text-purple-600" />} 
          color="purple" 
        />
        <StatCard 
          title="Сейчас в сети" 
          value={stats.onlineCount} 
          icon={<Activity className="text-emerald-600" />} 
          color="emerald" 
          subtitle={
            <div className="flex gap-4 mt-4 pt-4 border-t border-emerald-100/50">
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-400 uppercase font-black">Users: {stats.details.onlineUsers}</span>
              </div>
              <div className="flex flex-col border-l border-emerald-100/30 pl-4">
                <span className="text-[9px] text-slate-400 uppercase font-black">Managers: {stats.details.onlineManagers}</span>
              </div>
            </div>
          }
        />
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-200 p-10 shadow-sm">
        <h3 className="text-xl font-black text-slate-800 flex items-center gap-3 uppercase tracking-wider mb-8">
          <ShieldCheck size={24} className="text-purple-500" /> Состояние узлов управления
        </h3>
        {/* Статус серверов */}
      <div className="bg-white rounded-[3rem] border border-slate-200 p-10 shadow-sm">
        <h3 className="text-xl font-black text-slate-800 flex items-center gap-3 uppercase tracking-wider mb-8">
          <ShieldCheck size={24} className="text-purple-500" /> Состояние узлов управления
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Вместо status="online" передаем isOnline={true} */}
          <ServerStatus label="API Сервер" isOnline={isOnline} />
          <ServerStatus label="База данных" isOnline={isOnline} />
        </div>
      </div>
      </div>
    </div>
  );
};

export default AdminOverview;