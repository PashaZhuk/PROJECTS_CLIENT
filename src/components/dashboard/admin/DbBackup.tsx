import { Database, Construction } from 'lucide-react';

const DbBackup = () => {
  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Бэкап <span className="text-purple-600">БД</span>
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Создание и восстановление резервных копий базы данных
        </p>
      </div>

      {/* Placeholder */}
      <div className="bg-white rounded-3xl border border-gray-200 p-12 shadow-sm">
        <div className="flex flex-col items-center text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mb-5">
            <Construction size={32} className="text-amber-500" />
          </div>
          <h2 className="text-lg font-black text-slate-800 mb-2">В разработке</h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Здесь можно будет создать резервную копию базы данных 
            одним кликом или восстановить данные из предыдущего бэкапа.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DbBackup;
