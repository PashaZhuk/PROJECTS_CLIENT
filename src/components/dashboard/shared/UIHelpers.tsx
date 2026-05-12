import React, {type ReactElement } from 'react';
import { RefreshCw } from 'lucide-react';

// Цветные статусы
export const StatusBadge = ({ status }: { status: string }) => {
  const styles: any = {
    PENDING: "bg-orange-50 text-orange-600 border-orange-100",
    APPROVED: "bg-emerald-50 text-emerald-600 border-emerald-100",
    REJECTED: "bg-red-50 text-red-600 border-red-100"
  };
  const labels: any = { PENDING: "На проверке", APPROVED: "Одобрен", REJECTED: "Отклонен" };
  return (
    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.1em] border ${styles[status] || styles.PENDING}`}>
      {labels[status] || status}
    </span>
  );
};

// Одна строка данных в деталях проекта
export const DataRow = ({ label, value }: { label: string, value: string }) => (
  <div className="flex flex-col border-b border-slate-50 pb-2">
    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{label}</span>
    <span className="text-[13px] font-bold text-slate-700 mt-1 leading-tight">{value}</span>
  </div>
);

// Запись в логах (дата создания/обновления)
export const LogEntry = ({ 
  icon, 
  label, 
  value 
}: { 
  icon: ReactElement, 
  label: string, 
  value: string 
}) => (
  <div className="flex items-center justify-between text-[11px] font-bold">
    <span className="text-slate-400 flex items-center gap-2 italic">
      {/* Добавляем проверку и явное приведение типа */}
      {React.isValidElement(icon) && React.cloneElement(icon as ReactElement<any>, { size: 14 })} 
      {label}
    </span>
    <span className="text-slate-700">{value}</span>
  </div>
);

// Карточки статистики для главной
export const StatCard = ({ 
  icon, 
  label, 
  value, 
  color 
}: { 
  icon: ReactElement, 
  label: string, 
  value: number | string, 
  color: 'orange' | 'emerald' | 'blue' 
}) => {
  const colors = {
    orange: "bg-orange-50 text-orange-500 border-orange-100",
    emerald: "bg-emerald-50 text-emerald-500 border-emerald-100",
    blue: "bg-blue-50 text-blue-500 border-blue-100"
  };

  return (
    <div className="p-8 rounded-[2.5rem] border bg-white shadow-lg transition-transform hover:-translate-y-1 duration-300">
      <div className={`w-14 h-14 ${colors[color]} rounded-2xl flex items-center justify-center mb-6 shadow-inner`}>
        {/* Здесь также типизируем клон */}
        {React.isValidElement(icon) && React.cloneElement(icon as ReactElement<any>, { size: 28 })}
      </div>
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">{label}</p>
      <p className="text-4xl font-black text-slate-900 mt-2 tracking-tighter">{value}</p>
    </div>
  );
};

export const LoadingState = () => (
  <div className="flex flex-col items-center justify-center h-96 gap-4">
    <RefreshCw size={48} className="animate-spin text-blue-600" />
    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
      Синхронизация данных...
    </p>
  </div>
);