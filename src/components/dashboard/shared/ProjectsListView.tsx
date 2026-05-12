import React from 'react';
import { ClipboardList, Search, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { ProjectRow } from '../shared/ProjectRow';
// Импортируем типы из вашего центрального файла типов
import type { Project, User } from '../../../types'; 

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
  /** * Исправление ошибки: используем Project['status'], 
   * чтобы MODIFICATION и другие статусы подтягивались автоматически 
   */
  onStatusUpdate?: (id: number, status: Project['status']) => void;
  onOpenChat?: (projectId: number) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** * ОБЯЗАТЕЛЬНО: Передаем текущего юзера, 
   * чтобы ProjectRow мог инициализировать чат 
   */
  user: User | null; 
}

export const ProjectsListView = ({
  projects,
  isLoading,
  searchQuery,
  setSearchQuery,
  expandedId,
  setExpandedId,
  onEdit,
  onCreateNew,
  isAdminView,
  onStatusUpdate,
  onOpenChat,
  currentPage,
  totalPages,
  onPageChange,
  user // Принимаем юзера
}: ProjectsListViewProps) => {

  const headers = isAdminView
    ? ['ID', 'Партнер / Тип', 'Заказчик', 'Статус', 'Дата', 'Действия']
    : ['ID / Тип', 'Заказчик', 'Статус', 'Дата', 'Действия'];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Шапка и Поиск */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 ${isAdminView ? 'bg-emerald-600 shadow-emerald-200' : 'bg-slate-900 shadow-slate-200'} text-white rounded-2xl flex items-center justify-center shadow-lg`}>
            <ClipboardList size={24} />
          </div>
          <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Реестр проектов</h2>
        </div>

        <div className="relative w-full md:w-96 group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            {isLoading ? (
              <Loader2 className="text-blue-500 animate-spin" size={20} />
            ) : (
              <Search className="text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
            )}
          </div>
          <input
            type="text"
            placeholder={isAdminView ? "Поиск по партнеру, заказчику или ID..." : "Поиск по заказчику или ID..."}
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-sm font-medium shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Основной контейнер таблицы */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl flex flex-col relative overflow-hidden">
        
        {/* ОВЕРЛЕЙ ЗАГРУЗКИ */}
        {isLoading && (
          <div className="absolute inset-0 z-20 bg-white/40 backdrop-blur-[1px] flex items-center justify-center animate-in fade-in duration-300">
            <div className="bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
              <Loader2 className="text-blue-600 animate-spin" size={20} />
              <span className="text-xs font-black uppercase tracking-widest text-slate-600">Обновление данных...</span>
            </div>
          </div>
        )}

        <div className="overflow-x-auto min-h-[500px]">
          <table className={`w-full border-collapse transition-all duration-500 ${isLoading ? 'opacity-40 grayscale-[0.5]' : 'opacity-100'}`}>
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
                    /**
                     * ПРОБРАСЫВАЕМ USER ДАЛЬШЕ
                     * Это устраняет ошибку "Property 'user' is missing"
                     */
                    user={user} 
                  />
                ))
              ) : !isLoading ? (
                <tr>
                  <td colSpan={headers.length} className="py-32 text-center text-slate-400 font-bold uppercase text-xs tracking-widest animate-in zoom-in-95">
                    Ничего не найдено
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        {/* ПАНЕЛЬ ПАГИНАЦИИ */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-8 py-6 bg-slate-50/50 border-t border-slate-100 gap-4 mt-auto">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Страница <span className="text-slate-900">{currentPage}</span> из <span className="text-slate-900">{totalPages}</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
              className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:border-blue-500 hover:text-blue-600 disabled:opacity-30 transition-all shadow-sm"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange(pageNum)}
                      disabled={isLoading}
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
                if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                  return <span key={pageNum} className="text-slate-300 mx-1">...</span>;
                }
                return null;
              })}
            </div>

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isLoading}
              className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:border-blue-500 hover:text-blue-600 disabled:opacity-30 transition-all shadow-sm"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};