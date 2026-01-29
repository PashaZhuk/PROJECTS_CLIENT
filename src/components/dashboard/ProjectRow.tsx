import React from 'react';
import { 
  ChevronDown, ChevronUp, FileText, CheckCircle, 
  XCircle, MessageSquare, Building2, ShoppingCart, Clock, RefreshCw, Globe, RotateCcw 
} from 'lucide-react';
import { StatusBadge } from './UIHelpers';
import { FIELD_LABELS } from '../../config/projectFields';

interface ProjectRowProps {
  project: any;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEdit?: (p: any) => void;
  isAdminView?: boolean;
  onStatusUpdate?: (id: number, status: 'APPROVED' | 'REJECTED' | 'PENDING') => void;
  onOpenChat?: (p: any) => void;
}

export const ProjectRow = ({ 
  project, isExpanded, onToggleExpand, onEdit, 
  isAdminView, onStatusUpdate, onOpenChat 
}: ProjectRowProps) => {
  
  const handleAction = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  // Получаем количество непрочитанных (поддерживаем и unreadCount, и старый hasUnread для совместимости)
  const unreadCount = project.unreadCount || 0;
  const hasUnread = project.hasUnread || unreadCount > 0;

  return (
    <React.Fragment>
      <tr 
        className={`hover:bg-slate-50/50 transition-all border-b border-slate-50 last:border-0 cursor-pointer ${isExpanded ? 'bg-blue-50/10' : ''}`}
        onClick={onToggleExpand}
      >
        <td className="p-6 text-center font-mono text-[11px] font-black text-blue-600">
          PRJ-{project.id}
        </td>
        
        <td className="p-6 text-center">
          <div className="flex flex-col items-center">
            <span className="font-black text-slate-800 text-sm">
              {isAdminView ? (project.partner?.name || 'Партнер') : project.customerName}
            </span>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">
              {isAdminView ? 'Личный кабинет' : (project.formType || 'Тип не указан')}
            </span>
          </div>
        </td>

        <td className="p-6 text-center text-slate-600 text-sm font-bold">
          {isAdminView ? project.customerName : <StatusBadge status={project.status} />}
        </td>

        {isAdminView && (
          <td className="p-6 text-center"><StatusBadge status={project.status} /></td>
        )}

        <td className="p-6 text-center text-[11px] text-slate-400 font-black uppercase">
          {new Date(project.createdAt).toLocaleDateString('ru-RU')}
        </td>

        <td className="p-6">
          <div className="flex items-center gap-2 justify-center">
            {/* Кнопка развернуть */}
            <button className={`p-3 rounded-2xl transition-all ${isExpanded ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-100 text-slate-400 hover:bg-slate-900 hover:text-white'}`}>
              {isExpanded ? <ChevronUp size={18} /> : <FileText size={18} />}
            </button>

            {/* БЛОК МЕНЕДЖЕРА */}
            {isAdminView && onStatusUpdate && (
              <>
                {project.status === 'PENDING' ? (
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => handleAction(e, () => onStatusUpdate(project.id, 'APPROVED'))} 
                      className="p-3 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-2xl transition-all"
                      title="Одобрить"
                    >
                      <CheckCircle size={18} />
                    </button>
                    <button 
                      onClick={(e) => handleAction(e, () => onStatusUpdate(project.id, 'REJECTED'))} 
                      className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all"
                      title="Отклонить"
                    >
                      <XCircle size={18} />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={(e) => handleAction(e, () => onStatusUpdate(project.id, 'PENDING'))} 
                    className="flex items-center gap-2 px-3 py-3 bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white rounded-2xl transition-all"
                    title="Вернуть в работу"
                  >
                    <RotateCcw size={18} />
                    <span className="text-[10px] font-black uppercase">Вернуть</span>
                  </button>
                )}
              </>
            )}

            {/* БЛОК ПАРТНЕРА */}
            {!isAdminView && project.status === 'PENDING' && onEdit && (
              <button 
                onClick={(e) => handleAction(e, () => onEdit(project))} 
                className="p-3 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-2xl transition-all"
                title="Редактировать"
              >
                <RefreshCw size={18} />
              </button>
            )}

            {/* КНОПКА ЧАТА С ЦИФРОВЫМ БАББЛОМ */}
            {onOpenChat && (
              <button 
                onClick={(e) => handleAction(e, () => onOpenChat(project))} 
                className={`relative p-3 rounded-2xl transition-all shadow-sm ${
                  hasUnread 
                    ? 'bg-indigo-600 text-white shadow-indigo-200' 
                    : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white'
                }`}
                title="Чат по проекту"
              >
                <MessageSquare size={18} />
                
                {/* БАББЛ С КОЛИЧЕСТВОМ СООБЩЕНИЙ */}
                {hasUnread && (
                  <div className="absolute -top-2 -right-2 flex items-center justify-center">
                    {/* Пульсирующий фон для привлечения внимания */}
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    
                    {/* Сам баббл с цифрой */}
                    <div className="relative flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-black text-white ring-2 ring-white shadow-md animate-in zoom-in">
                      {unreadCount > 0 ? (unreadCount > 9 ? '9+' : unreadCount) : '!'}
                    </div>
                  </div>
                )}
              </button>
            )}
          </div>
        </td>
      </tr>

      {/* РАЗВЕРНУТЫЙ ВИД */}
      {isExpanded && (
        <tr className="bg-slate-50/30">
          <td colSpan={isAdminView ? 6 : 5} className="p-8">
            <div className="bg-white rounded-[2rem] border border-slate-200 p-10 shadow-2xl animate-in slide-in-from-top-4 duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 text-left">
                {/* Инфо о заказе */}
                <div className="space-y-6">
                  <h4 className="flex items-center gap-2 text-[11px] font-black uppercase text-blue-600 tracking-widest border-b border-slate-100 pb-4">
                    <Building2 size={16}/> Информация о заказе
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(project.dynamicData || {}).map(([key, value]) => {
                      if (key === 'specification' || key === 'items') return null;
                      return (
                        <div key={key} className="flex flex-col border-b border-slate-50 pb-2">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{FIELD_LABELS[key] || key}</span>
                          <span className="text-xs font-bold text-slate-700">{String(value || '—')}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Спецификация */}
                <div className="space-y-6">
                  <h4 className="flex items-center gap-2 text-[11px] font-black uppercase text-indigo-600 tracking-widest border-b border-slate-100 pb-4">
                    <ShoppingCart size={16}/> Спецификация
                  </h4>
                  <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                    {(project.dynamicData?.specification || []).map((item: any, i: number) => (
                      <div key={i} className="flex justify-between items-center text-xs border-b border-white last:border-0 pb-2">
                        <span className="font-bold text-slate-700 uppercase">{item.model}</span>
                        <span className="font-black text-indigo-600">{item.count} шт.</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Таймлайн */}
                <div className="space-y-6">
                  <h4 className="flex items-center gap-2 text-[11px] font-black uppercase text-slate-900 tracking-widest border-b border-slate-100 pb-4">
                    <Globe size={16}/> Таймлайн
                  </h4>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg h-fit"><Clock size={14}/></div>
                      <div>
                        <p className="text-[9px] font-black uppercase text-slate-400">Создано</p>
                        <p className="text-xs font-bold text-slate-700">{new Date(project.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg h-fit"><RefreshCw size={14}/></div>
                      <div>
                        <p className="text-[9px] font-black uppercase text-slate-400">Обновлено</p>
                        <p className="text-xs font-bold text-slate-700">{new Date(project.updatedAt).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </React.Fragment>
  );
};