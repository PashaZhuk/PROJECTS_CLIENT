import React from 'react';
import { Calendar, RefreshCw, Clock, CheckCircle2, FileText } from 'lucide-react';
import { StatCard } from './UIHelpers';

interface StatsViewProps {
  stats: { pending: number; approved: number; total: number };
  onRefresh: () => void;
  isLoading: boolean;
  title?: string;
}

export const StatsView = ({ stats, onRefresh, isLoading, title = "Менеджер Проектов" }: StatsViewProps) => (
  <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <div className="flex justify-between items-end">
      <div>
        <h1 className="text-5xl font-black text-slate-900 tracking-tight">
          {title.split(' ')[0]} <span className="text-blue-600">{title.split(' ')[1]}</span>
        </h1>
        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-4 flex items-center gap-2">
          <Calendar size={12} className="text-blue-500" /> 
          {new Date().toLocaleDateString('ru-RU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
      <button
        onClick={onRefresh}
        disabled={isLoading}
        className="group p-4 bg-white border border-slate-200 rounded-[1.5rem] text-slate-400 hover:text-blue-600 shadow-sm transition-all active:scale-90"
      >
        <RefreshCw size={24} className={isLoading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"} />
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <StatCard icon={<Clock />} label="На проверке" value={stats.pending} color="orange" />
      <StatCard icon={<CheckCircle2 />} label="Успешно" value={stats.approved} color="emerald" />
      <StatCard icon={<FileText />} label="Всего заявок" value={stats.total} color="blue" />
    </div>
  </div>
);