import { useState, useEffect, useCallback, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom'; 
import { Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProjectSockets } from '../hooks/useProjectSockets';

// Используем type-only импорт для интерфейсов
import type { Project, ActiveTabType } from '../types'; 

import { StatsView } from '../components/dashboard/shared/StatsView';
import { ProjectsListView } from '../components/dashboard/shared/ProjectsListView';
import { ChatDrawer } from '../components/dashboard/shared/ChatDrawer';

const ManagerDashboard = () => {
  const { user } = useAuth();
  
  // Типизируем контекст аутлета
  const { activeTab } = useOutletContext<{ activeTab: ActiveTabType }>();

  // Состояние данных с использованием интерфейса Project
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Пагинация
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0); 

  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [expandedProjectId, setExpandedProjectId] = useState<number | null>(null);
  const [chatProject, setChatProject] = useState<Project | null>(null);

  /**
   * ИСПРАВЛЕНИЕ ОШИБКИ ТИПОВ:
   * Если в твоем интерфейсе User id это number, а приходит string (или наоборот),
   * мы явно приводим его к нужному типу. 
   * Здесь мы гарантируем передачу number | undefined.
   */
  const userIdForSockets = typeof user?.id === 'string' ? parseInt(user.id, 10) : user?.id;
  useProjectSockets(setProjects, userIdForSockets);

  // Дебаунс поиска
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Загрузка проектов
  const fetchAllProjects = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: '10',
        search: debouncedSearch.trim() 
      });

      const response = await fetch(`http://192.168.85.110:5001/api/projects?${params}`, { 
        credentials: 'include' 
      });
      const data = await response.json();

      setProjects(data.projects || []);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.totalCount || 0);
    } catch (err) { 
      console.error("Fetch error:", err); 
    } finally { 
      if (showLoading) setLoading(false); 
    }
  }, [currentPage, debouncedSearch]);

  useEffect(() => { 
    fetchAllProjects(true); 
  }, [fetchAllProjects]);

  // Обновление статуса
  const updateProjectStatus = async (projectId: number, newStatus: Project['status']) => {
    const previousProjects = [...projects];
    
    // Оптимистичное обновление
    setProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, status: newStatus } : p
    ));

    try {
      const response = await fetch(`http://192.168.85.110:5001/api/projects/${projectId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', 
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error('Ошибка обновления');
    } catch (err) {
      setProjects(previousProjects);
      alert("Не удалось обновить статус");
    }
  };

  // Расчет статистики
  const stats = useMemo(() => ({
    pending: projects.filter(p => p.status === 'PENDING').length,
    approved: projects.filter(p => p.status === 'APPROVED').length,
    total: totalCount 
  }), [projects, totalCount]);

  return (
    <div className="w-full animate-in fade-in duration-500">
      {/* ВКЛАДКА СТАТИСТИКИ */}
      {activeTab === 'stats' && (
        <StatsView 
          stats={stats} 
          onRefresh={() => fetchAllProjects(true)} 
          isLoading={loading} 
          title="Панель Менеджера" 
          variant="emerald" 
        />
      )}

      {/* ВКЛАДКА СПИСКА ПРОЕКТОВ */}
      {activeTab === 'projects-list' && (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Все проекты</h2>
            <div className="relative w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none text-sm focus:ring-2 focus:ring-emerald-500/20 transition-all"
                placeholder="Поиск по названию или УНП..." 
              />
            </div>
          </div>

          <ProjectsListView
            projects={projects}
            isLoading={loading}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            expandedId={expandedProjectId}
            setExpandedId={setExpandedProjectId}
            isAdminView={true} 
            onStatusUpdate={updateProjectStatus}
            onOpenChat={(p: Project) => setChatProject(p)}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* ОБЩИЙ ЧАТ */}
      <ChatDrawer 
        isOpen={!!chatProject}
        project={chatProject}
        user={user}
        onClose={() => setChatProject(null)}
        variant="emerald"
      />
    </div>
  );
};

export default ManagerDashboard;