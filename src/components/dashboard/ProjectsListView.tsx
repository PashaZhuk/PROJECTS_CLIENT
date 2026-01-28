import React from 'react';
import { ClipboardList, Search } from 'lucide-react';
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
  // Поля для менеджера
  isAdminView?: boolean;
  onStatusUpdate?: (id: number, status: 'APPROVED' | 'REJECTED'| 'PENDING') => void;
  onOpenChat?: (p: any) => void;
}

export const ProjectsListView = ({ 
  projects, isLoading, searchQuery, setSearchQuery, 
  expandedId, setExpandedId, onEdit, onCreateNew,
  isAdminView, onStatusUpdate, onOpenChat
}: ProjectsListViewProps) => {

  const headers = isAdminView 
    ? ['ID', 'Партнер / Тип', 'Заказчик', 'Статус', 'Дата', 'Действия']
    : ['ID / Тип', 'Заказчик', 'Статус', 'Дата', 'Действия'];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
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
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
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
    </div>
  );
};