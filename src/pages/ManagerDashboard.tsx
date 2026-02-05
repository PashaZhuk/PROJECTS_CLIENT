import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  LayoutDashboard, ClipboardList, ShoppingCart, LogOut, 
  Search
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProjectSockets } from '../hooks/useProjectSockets';

// Импорт общих компонентов
import { StatsView } from '../components/dashboard/StatsView';
import { ProjectsListView } from '../components/dashboard/ProjectsListView';
import { ChatDrawer } from '../components/dashboard/ChatDrawer';

const ManagerDashboard = () => {
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'stats' | 'projects' | 'orders'>('projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedProjectId, setExpandedProjectId] = useState<number | null>(null);
  
  // --- СОСТОЯНИЕ ПАГИНАЦИИ ---
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0); 

  // --- DEBOUNCE ПОИСКА ---
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [chatProject, setChatProject] = useState<any>(null);

  // Подключаем сокеты для живого обновления статусов
  useProjectSockets(setProjects, user?.id);

  // Эффект дебаунса: ждем 400мс после ввода, прежде чем отправить запрос на сервер
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Сбрасываем на 1-ю страницу при новом поиске
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  /**
   * ГЛАВНАЯ ФУНКЦИЯ ЗАГРУЗКИ: 
   * Теперь работает исключительно через API. Мы удалили локальную фильтрацию,
   * чтобы не было конфликтов при поиске по ID.
   */
  const fetchAllProjects = useCallback(async (showLoading = false) => {
  if (showLoading) setLoading(true);
  try {
    const params = new URLSearchParams({
      page: String(currentPage),
      limit: '10',
      search: debouncedSearch.trim() 
    });

    const url = `http://192.168.85.110:5001/api/projects?${params}`;
    

    const response = await fetch(url, { credentials: 'include' });
    if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);
    
    const data = await response.json();
      

    setProjects(data.projects || []);
    setTotalPages(data.totalPages || 1);
    setTotalCount(data.totalCount || 0);
    
  } catch (err) { 
    console.error("ОШИБКА ДЕБАГА:", err); 
  } finally { 
    if (showLoading) setLoading(false); 
  }
}, [currentPage, debouncedSearch]);

  useEffect(() => {
    fetchAllProjects(true);
  }, [fetchAllProjects]);

  // Синхронизация данных в открытом чате
  useEffect(() => {
    if (chatProject) {
      const updated = projects.find(p => String(p.id) === String(chatProject.id));
      if (updated && JSON.stringify(updated) !== JSON.stringify(chatProject)) {
        setChatProject(updated);
      }
    }
  }, [projects, chatProject]);

  const handleMessagesRead = useCallback((projectId: number) => {
    setProjects(prev => prev.map(p => 
      String(p.id) === String(projectId) ? { ...p, unreadCount: 0, hasUnread: false } : p
    ));
  }, []);

  const updateProjectStatus = async (projectId: number, newStatus: 'APPROVED' | 'REJECTED'| 'PENDING') => {
    const previousProjects = [...projects];
    // Оптимистичное обновление
    setProjects(prev => prev.map(p => 
      String(p.id) === String(projectId) ? { ...p, status: newStatus } : p
    ));

    try {
      const response = await fetch(`http://192.168.85.110:5001/api/projects/${projectId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', 
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error('Ошибка обновления на сервере');
    } catch (err: any) {
      setProjects(previousProjects);
      alert(`Не удалось обновить: ${err.message}`);
    }
  };

  // Статистика теперь опирается на totalCount от сервера для точности
  const stats = useMemo(() => ({
    pending: projects.filter(p => p.status === 'PENDING').length,
    approved: projects.filter(p => p.status === 'APPROVED').length,
    total: totalCount 
  }), [projects, totalCount]);

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans text-slate-900">
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 z-20 shadow-sm">
        <div className="p-8">
          <div className="flex items-center gap-3 text-emerald-600">
            <div className="w-11 h-11 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-emerald-100">M</div>
            <div className="flex flex-col">
              <span className="text-slate-900 font-black text-lg leading-tight">Manager<span className="text-emerald-600">Hub</span></span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Global Admin</span>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <NavBtn active={activeTab === 'stats'} onClick={() => setActiveTab('stats')} icon={<LayoutDashboard size={20}/>} label="Обзор" />
          <NavBtn active={activeTab === 'projects'} onClick={() => setActiveTab('projects')} icon={<ClipboardList size={20}/>} label="Проекты" />
          <NavBtn active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} icon={<ShoppingCart size={20}/>} label="Заказы" />
        </nav>
        <div className="p-6 border-t border-slate-100">
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-4 text-slate-400 hover:text-red-500 font-bold text-sm transition-all">
            <LogOut size={20} /> Выход
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-10 shrink-0">
          <div className="relative w-full max-w-md">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${loading ? 'text-emerald-500 animate-pulse' : 'text-slate-400'}`} size={18} />
            <input 
              type="text" 
              placeholder="Поиск по партнеру, ID или заказчику..." 
              className="w-full pl-12 pr-4 py-3.5 bg-slate-100 rounded-2xl outline-none text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-black text-slate-900">{user?.name}</p>
              <p className="text-[10px] text-emerald-600 font-black uppercase">Manager Account</p>
            </div>
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black shadow-xl">
              {user?.name?.[0]}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-10 bg-[#F8FAFC]">
          {activeTab === 'stats' && (
            <StatsView 
              stats={stats} 
              onRefresh={() => fetchAllProjects(true)} 
              isLoading={loading} 
              title="Панель Управления"
            />
          )}

          {activeTab === 'projects' && (
            <ProjectsListView
              projects={projects} // Используем массив напрямую от сервера
              isLoading={loading}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              expandedId={expandedProjectId}
              setExpandedId={setExpandedProjectId}
              isAdminView={true}
              onStatusUpdate={updateProjectStatus}
              onOpenChat={(p: any) => setChatProject(p)}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </main>

        <ChatDrawer 
          isOpen={!!chatProject}
          project={chatProject}
          user={user}
          onClose={() => setChatProject(null)}
          onMessagesRead={handleMessagesRead}
          variant="emerald"
        />
      </div>
    </div>
  );
};

const NavBtn = ({ active, onClick, icon, label }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all group ${active ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 font-bold' : 'text-slate-500 hover:bg-slate-50'}`}>
    <span className={active ? 'text-white' : 'text-slate-400 group-hover:text-emerald-500 transition-colors'}>{icon}</span>
    <span className="text-sm tracking-tight">{label}</span>
  </button>
);

export default ManagerDashboard;