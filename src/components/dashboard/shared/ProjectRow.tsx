import React from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  MessageSquare, 
  Calendar,
  Pencil // Добавили иконку для редактирования
} from 'lucide-react';
import type { Project, User } from '../../../types';

interface ProjectRowProps {
  project: Project & { dynamicData?: any; partner?: any; hasUnread?: boolean };
  isExpanded: boolean;
  onToggleExpand: () => void;
  isAdminView?: boolean;
  onEdit?: (project: any) => void;
  onStatusUpdate?: (id: number, status: Project['status']) => void | Promise<void>;
  onOpenChat?: (projectId: number) => void;
  user: User | null;
}

export const ProjectRow = ({
  project,
  isExpanded,
  onToggleExpand,
  isAdminView,
  onStatusUpdate,
  onOpenChat,
  onEdit, // Не забываем деструктурировать onEdit
}: ProjectRowProps) => {

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onStatusUpdate) {
      await onStatusUpdate(project.id, e.target.value as Project['status']);
    }
  };

  // Маппинг цветов для статусов
  const statusColors: Record<Project['status'], string> = {
    PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
    IN_PROGRESS: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    APPROVED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    REJECTED: 'bg-rose-100 text-rose-700 border-rose-200',
    REVISION: 'bg-blue-100 text-blue-700 border-blue-200',
    CLOSED: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  // Условие: может ли пользователь редактировать проект
  const canUserEdit = !isAdminView && (project.status === 'PENDING' || project.status === 'REVISION');

  return (
    <>
      <tr className={`border-b border-slate-100 transition-all ${isExpanded ? 'bg-blue-50/30' : 'hover:bg-slate-50'}`}>
        {/* ID и Номер */}
        <td className="p-6 text-center">
          <span className="text-xs font-black text-slate-400 block mb-1">ID: {project.id}</span>
          <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-600 tracking-tighter">
            PRJ-{project.id}
          </span>
        </td>

        {/* Партнер (только для менеджера) */}
        {isAdminView && (
          <td className="p-6 text-center">
            <div className="flex flex-col items-center">
              <span className="text-sm font-bold text-slate-800">{project.partner?.companyName || '—'}</span>
              <span className="text-[10px] text-slate-400 font-medium">УНП: {project.partner?.unp || '—'}</span>
            </div>
          </td>
        )}

        {/* Заказчик / Название проекта */}
        <td className="p-6 text-center">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-700">{(project as any).customerName || 'Заказчик не указан'}</span>
            <span className="text-[10px] text-slate-400">УНП объекта: {project.unp}</span>
          </div>
        </td>

        {/* СТАТУС */}
        <td className="p-6 text-center">
          {isAdminView ? (
            <select
              value={project.status}
              onChange={handleStatusChange}
              className={`text-[10px] font-black uppercase tracking-tight border rounded-lg px-2 py-1.5 outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer ${statusColors[project.status]}`}
            >
              <option value="PENDING">Ожидание</option>
              <option value="IN_PROGRESS">В работе</option>
              <option value="APPROVED">Одобрено</option>
              <option value="REVISION">На доработку</option> 
              <option value="REJECTED">Отклонено</option>
              <option value="CLOSED">Закрыто</option>
            </select>
          ) : (
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${statusColors[project.status]}`}>
              {project.status === 'REVISION' ? 'НА ДОРАБОТКЕ' : project.status}
            </span>
          )}
        </td>

        {/* Дата создания */}
        <td className="p-6 text-center">
          <div className="flex flex-col items-center gap-1 text-slate-400">
            <Calendar size={14} />
            <span className="text-[11px] font-bold">{new Date(project.createdAt).toLocaleDateString()}</span>
          </div>
        </td>

        {/* Действия */}
        <td className="p-6">
          <div className="flex items-center justify-center gap-3">
            
            {/* КНОПКА РЕДАКТИРОВАНИЯ (Появляется только когда статус REVISION или PENDING) */}
            {canUserEdit && (
              <button
                onClick={() => onEdit?.(project)}
                className="p-2.5 bg-white border border-slate-200 text-amber-600 hover:text-white hover:bg-amber-500 hover:border-amber-500 rounded-xl transition-all shadow-sm group"
                title="Редактировать анкету"
              >
                <Pencil size={18} />
              </button>
            )}

            <button
              onClick={() => onOpenChat?.(project.id)}
              className="p-2.5 bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-500 rounded-xl transition-all shadow-sm relative group"
              title="Открыть чат"
            >
              <MessageSquare size={18} />
              {project.hasUnread && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full animate-pulse" />
              )}
            </button>
            
            <button
              onClick={onToggleExpand}
              className={`p-2.5 rounded-xl border transition-all shadow-sm ${
                isExpanded 
                ? 'bg-blue-600 border-blue-600 text-white' 
                : 'bg-white border-slate-200 text-slate-600 hover:border-blue-500'
              }`}
              title="Детали проекта"
            >
              {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>
        </td>
      </tr>

      {/* РАСКРЫВАЮЩИЕСЯ ДЕТАЛИ */}
      {isExpanded && (
        <tr className="bg-slate-50/50">
          <td colSpan={isAdminView ? 6 : 5} className="p-0 border-b border-slate-100">
            <div className="p-8 animate-in slide-in-from-top-2 duration-300">
              <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-slate-900 p-4 px-8 flex justify-between items-center">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70">
                    Подробная информация по проекту
                  </h4>
                  <div className="flex gap-4">
                     <span className="text-[10px] font-bold text-white/50">Обновлено: {new Date(project.updatedAt).toLocaleString()}</span>
                  </div>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-10">
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">Объект</label>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-sm font-bold text-slate-700">{project.unp}</p>
                        <p className="text-xs text-slate-500">{project.description || 'Описание отсутствует'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">Заполненная анкета</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {project.dynamicData ? (
                        Object.entries(project.dynamicData).map(([key, value]) => (
                          <div key={key} className="flex flex-col p-3 px-4 bg-slate-50/80 rounded-xl border border-slate-100">
                            <span className="text-[9px] font-black text-blue-500 uppercase tracking-tighter mb-0.5">{key}</span>
                            <span className="text-sm font-bold text-slate-700">{String(value)}</span>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-2 py-4 text-center text-slate-400 text-xs italic">
                          Дополнительные данные отсутствуют
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};