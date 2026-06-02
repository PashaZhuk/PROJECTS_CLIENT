import { Activity, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { StatCard } from '../shared/StatCardStatus';

const AdminOverview = ({ stats, onRefresh }: any) => {
  const [spin, setSpin] = useState(false);
  if (!stats) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end">
        <div>
          {/* <h1 className="text-5xl font-black text-slate-900 tracking-tight">
            Root <span className="text-purple-600">Administrator</span>
          </h1> */}
          {/* <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-4 flex items-center gap-2">
            <Activity size={12} className={isOnline ? 'text-emerald-500' : 'text-red-500'} />
            Мониторинг системы: {isOnline ? 'АКТИВЕН' : 'СВЯЗЬ ПОТЕРЯНА'}
          </p> */}
        </div>
        <button
          onClick={function(){
            setSpin(true);
            setTimeout(function(){
              onRefresh().finally(function(){ setSpin(false); });
            }, 50);
          }}
          className="p-4 bg-white border border-slate-200 rounded-3xl text-slate-400 hover:text-purple-600 shadow-sm transition-all active:scale-95"
        >
          <RefreshCw size={16} className={spin ? "spinning" : ""} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <StatCard
          title="Всего пользователей"
          value={stats.totalUsers}
          icon={<Activity className="text-purple-600" />}
          color="purple"
          subtitle={
            <div className="flex gap-4 mt-4 pt-4 border-t border-purple-100/50">
              <div className="relative group/tip">
                <span className="text-[9px] text-slate-400 uppercase font-black cursor-help">
                  Пользователи: {stats.totalUsers}
                </span>
                {stats.totalUserNames?.length > 0 && (
                  <div className="absolute bottom-full left-0 z-50 before:content-[''] before:absolute before:top-full before:left-0 before:w-full before:h-2">
                    <div className="bg-slate-900 text-white text-[10px] font-bold rounded-xl px-4 py-3 shadow-xl max-h-48 overflow-y-auto whitespace-nowrap mb-2 invisible opacity-0 group-hover/tip:visible group-hover/tip:opacity-100 transition-all duration-200">
                      <div className="flex flex-col gap-1">
                        {stats.totalUserNames.map((name: string, i: number) => (
                          <span key={i}>{name}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="relative group/tip">
                <span className="text-[9px] text-slate-400 uppercase font-black border-l border-purple-100/30 pl-4 cursor-help">
                  Менеджеры: {stats.totalManagers}
                </span>
                {stats.totalManagerNames?.length > 0 && (
                  <div className="absolute bottom-full left-0 z-50 before:content-[''] before:absolute before:top-full before:left-0 before:w-full before:h-2">
                    <div className="bg-slate-900 text-white text-[10px] font-bold rounded-xl px-4 py-3 shadow-xl max-h-48 overflow-y-auto whitespace-nowrap mb-2 invisible opacity-0 group-hover/tip:visible group-hover/tip:opacity-100 transition-all duration-200">
                      <div className="flex flex-col gap-1">
                        {stats.totalManagerNames.map((name: string, i: number) => (
                          <span key={i}>{name}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          }
        />
        <StatCard
          title="Сейчас в сети"
          value={stats.onlineCount}
          icon={<Activity className="text-emerald-600" />}
          color="emerald"
          subtitle={
            <div className="flex gap-4 mt-4 pt-4 border-t border-emerald-100/50">
              <div className="relative group/tip">
                <span className="text-[9px] text-slate-400 uppercase font-black cursor-help">
                  Пользователи: {stats.details.onlineUsers}
                </span>
                {stats.details.onlineUserNames?.length > 0 && (
                  <div className="absolute bottom-full left-0 z-50 before:content-[''] before:absolute before:top-full before:left-0 before:w-full before:h-2">
                    <div className="bg-slate-900 text-white text-[10px] font-bold rounded-xl px-4 py-3 shadow-xl whitespace-nowrap mb-2 invisible opacity-0 group-hover/tip:visible group-hover/tip:opacity-100 transition-all duration-200">
                      <div className="flex flex-col gap-1">
                        {stats.details.onlineUserNames.map((name: string, i: number) => (
                          <span key={i}>{name}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="relative group/tip">
                <span className="text-[9px] text-slate-400 uppercase font-black border-l border-emerald-100/30 pl-4 cursor-help">
                  Менеджеры: {stats.details.onlineManagers}
                </span>
                {stats.details.onlineManagerNames?.length > 0 && (
                  <div className="absolute bottom-full left-0 z-50 before:content-[''] before:absolute before:top-full before:left-0 before:w-full before:h-2">
                    <div className="bg-slate-900 text-white text-[10px] font-bold rounded-xl px-4 py-3 shadow-xl whitespace-nowrap mb-2 invisible opacity-0 group-hover/tip:visible group-hover/tip:opacity-100 transition-all duration-200">
                      <div className="flex flex-col gap-1">
                        {stats.details.onlineManagerNames.map((name: string, i: number) => (
                          <span key={i}>{name}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          }
        />
      </div>

      {/* Состояние узлов — один блок, без дублирования */}
      {/* <div className="bg-white rounded-[3rem] border border-slate-200 p-10 shadow-sm">
        <h3 className="text-xl font-black text-slate-800 flex items-center gap-3 uppercase tracking-wider mb-8">
          <ShieldCheck size={24} className="text-purple-500" /> Состояние узлов управления
        </h3> */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ServerStatus label="API Сервер" isOnline={isOnline} />
          <ServerStatus label="База данных" isOnline={isOnline} />
        </div> */}
      {/* </div> */}
    </div>
  );
};

export default AdminOverview;
