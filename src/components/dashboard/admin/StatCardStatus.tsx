// StatCard.tsx
import React from 'react';
import { Loader2 } from 'lucide-react';

export const StatCard = ({ title, value, icon, color, loading, subtitle }: any) => {
  const colors: any = {
    blue: "bg-blue-50/50 border-blue-100",
    purple: "bg-purple-50/50 border-purple-100",
    emerald: "bg-emerald-50/50 border-emerald-100 text-emerald-600"
  };
  return (
    <div className={`p-8 rounded-[2.5rem] border ${colors[color]} shadow-sm transition-all hover:shadow-md relative overflow-hidden group`}>
      <div className="flex justify-between items-start mb-6">
        <div className="p-4 bg-white rounded-[1.25rem] shadow-sm group-hover:scale-110 transition-transform relative">
          {icon}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-[1.25rem]">
              <Loader2 size={16} className="animate-spin text-slate-400" />
            </div>
          )}
        </div>
      </div>
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">{title}</p>
      <div className={`mt-2 transition-all ${loading ? 'opacity-30 blur-[2px]' : 'opacity-100'}`}>
        <p className="text-5xl font-black text-slate-900 tracking-tighter">{value.toLocaleString()}</p>
        {subtitle}
      </div>
    </div>
  );
};

// ServerStatus.tsx
export const ServerStatus = ({ label, isOnline }: { label: string, isOnline: boolean }) => (
  <div className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-slate-100">
    <span className="text-sm font-black text-slate-600 uppercase tracking-tight">{label}</span>
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
      <span className={`px-4 py-1.5 text-[10px] font-black rounded-xl uppercase tracking-widest ${isOnline ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
        {isOnline ? 'ONLINE' : 'OFFLINE'}
      </span>
    </div>
  </div>
);