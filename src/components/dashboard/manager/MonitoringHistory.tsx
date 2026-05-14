import { Construction } from 'lucide-react';

const MonitoringHistory = () => {
  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100">
          <h2 className="text-2xl font-black text-slate-900">История событий контроля</h2>
          <p className="text-slate-400 text-sm font-medium mt-1">
            Мониторинг действий и изменений
          </p>
        </div>
        <div className="flex flex-col items-center justify-center py-24 px-8">
          <div className="w-20 h-20 rounded-[2rem] bg-amber-50 border border-amber-200 flex items-center justify-center mb-6">
            <Construction size={36} className="text-amber-500" />
          </div>
          <h3 className="text-xl font-black text-slate-800 mb-2">В разработке</h3>
          <p className="text-sm text-slate-400 font-medium text-center max-w-md leading-relaxed">
            Здесь будет отображаться журнал всех действий менеджера: изменения статусов проектов,
            отправка рассылок, редактирование оборудования.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MonitoringHistory;
