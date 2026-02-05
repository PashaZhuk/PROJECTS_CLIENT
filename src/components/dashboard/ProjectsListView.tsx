import React from 'react';
import { ClipboardList, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProjectRow } from './ProjectRow';
import { LoadingState } from './UIHelpers';

interface ProjectsListViewProps {
  projects: any[];
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  expandedId: number | null;
  setExpandedId: (id: number | null) => void;
  onEdit?: (p: any) => void;
  onCreateNew?: () => void;
  isAdminView?: boolean;
  onStatusUpdate?: (id: number, status: 'APPROVED' | 'REJECTED' | 'PENDING') => void;
  onOpenChat?: (p: any) => void;
  // Новые пропсы для пагинации
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const ProjectsListView = ({
  projects, isLoading, searchQuery, setSearchQuery,
  expandedId, setExpandedId, onEdit, onCreateNew,
  isAdminView, onStatusUpdate, onOpenChat,
  currentPage, totalPages, onPageChange
}: ProjectsListViewProps) => {

  const headers = isAdminView
    ? ['ID', 'Партнер / Тип', 'Заказчик', 'Статус', 'Дата', 'Действия']
    : ['ID / Тип', 'Заказчик', 'Статус', 'Дата', 'Действия'];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Шапка и Поиск */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 ${isAdminView ? 'bg-emerald-600' : 'bg-slate-900'} text-white rounded-2xl flex items-center justify-center shadow-lg`}>
            <ClipboardList size={24} />
          </div>
          <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Реестр проектов</h2>
        </div>

        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder={isAdminView ? "Поиск по партнеру, заказчику или ID..." : "Поиск по заказчику или ID..."}
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-[1.5rem] outline-none focus:ring-2 focus:ring-blue-500/10 transition-all text-sm font-medium shadow-sm"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              onPageChange(1); // Сбрасываем на 1 страницу при поиске
            }}
          />
        </div>
      </div>

      {/* Основной контейнер таблицы */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="py-20"><LoadingState /></div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/30">
                  {headers.map((h) => (
                    <th key={h} className="p-6 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {projects.length > 0 ? (
                  projects.map((p: any) => (
                    <ProjectRow
                      key={p.id}
                      project={p}
                      isExpanded={expandedId === p.id}
                      onToggleExpand={() => setExpandedId(expandedId === p.id ? null : p.id)}
                      onEdit={onEdit}
                      isAdminView={isAdminView}
                      onStatusUpdate={onStatusUpdate}
                      onOpenChat={onOpenChat}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={headers.length} className="py-32 text-center text-slate-400 font-bold uppercase text-xs tracking-widest">
                      Ничего не найдено
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* --- ПАНЕЛЬ ПАГИНАЦИИ --- */}
        {!isLoading && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-8 py-6 bg-slate-50/50 border-t border-slate-100 gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Страница <span className="text-slate-900">{currentPage}</span> из <span className="text-slate-900">{totalPages}</span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-white hover:border-blue-500 hover:text-blue-600 disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-600 transition-all shadow-sm"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  // Логика: показываем первую, последнюю и страницы вокруг текущей
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => onPageChange(pageNum)}
                        className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                            : 'bg-white border border-slate-200 text-slate-500 hover:border-blue-500'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  // Добавляем многоточие
                  if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                    return <span key={pageNum} className="text-slate-300 mx-1">...</span>;
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-white hover:border-blue-500 hover:text-blue-600 disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-600 transition-all shadow-sm"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};