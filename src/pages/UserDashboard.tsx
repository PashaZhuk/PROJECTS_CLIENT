import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  LayoutDashboard, ClipboardList, ChevronDown, ChevronUp,
  LogOut, Layers, Globe, Video
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useProjectSockets } from '../hooks/useProjectSockets';
import DynamicProjectForm from '../components/DynamicProjectForm';
import { StatsView } from '../components/dashboard/StatsView';
import { ProjectsListView } from '../components/dashboard/ProjectsListView';
import { ChatDrawer } from '../components/dashboard/ChatDrawer';

// --- TYPES ---
interface Project {
  id: number;
  customerName: string;
  customerInn: string;
  formType: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  unreadCount?: number;
  hasUnread?: boolean;
}

const UserDashboard = () => {
  const { logout, user } = useAuth();

  // Основные состояния
  const [activeTab, setActiveTab] = useState<'stats' | 'my-projects' | 'create-project'>('stats');
  const [isProjectsMenuOpen, setIsProjectsMenuOpen] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedProjectId, setExpandedProjectId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Состояние чата
  const [chatProject, setChatProject] = useState<Project | null>(null);

  /**
   * --- ПОДКЛЮЧЕНИЕ SOCKET.IO ---
   * Этот хук теперь слушает не только сообщения, но и 'project_status_changed'.
   * Когда менеджер одобрит проект, список 'projects' обновится автоматически.
   */
  useProjectSockets(setProjects, user?.id);

  /**
   * --- СИНХРОНИЗАЦИЯ ОТКРЫТОГО ЧАТА ---
   * Если у пользователя открыт ChatDrawer, и через сокет пришло обновление этого проекта,
   * нам нужно обновить объект в chatProject, чтобы интерфейс внутри чата тоже изменился.
   */
  useEffect(() => {
    if (chatProject) {
      const updatedInList = projects.find(p => p.id === chatProject.id);
      if (updatedInList && JSON.stringify(updatedInList) !== JSON.stringify(chatProject)) {
        setChatProject(updatedInList);
      }
    }
  }, [projects, chatProject]);

  // --- ЛОГИКА ЗАГРУЗКИ ДАННЫХ ---
  const fetchProjects = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const response = await fetch('http://192.168.85.110:5001/api/projects', { 
        credentials: 'include' 
      });
      const data = await response.json();
      
      setProjects(data.sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects(true);
  }, [fetchProjects]);

  // --- ОБРАБОТКА ПРОЧТЕНИЯ ---
  const handleMessagesRead = useCallback((projectId: number) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, unreadCount: 0, hasUnread: false } : p
    ));
  }, []);

  // Статистика (обновляется сама, когда меняется массив projects через сокет)
  const stats = useMemo(() => ({
    pending: projects.filter(p => p.status === 'PENDING').length,
    approved: projects.filter(p => p.status === 'APPROVED').length,
    total: projects.length
  }), [projects]);

  // Фильтрация
  const filteredProjects = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return projects.filter(p =>
      p.customerName?.toLowerCase().includes(query) ||
      p.id.toString().includes(query) ||
      p.formType.toLowerCase().includes(query)
    );
  }, [projects, searchQuery]);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900 relative">
      
      {/* SIDEBAR */}
      <aside className="w-72 bg-slate-900 text-slate-400 flex flex-col shrink-0 shadow-2xl z-20">
        <div className="p-8">
          <div className="flex items-center gap-3 text-white font-bold text-xl tracking-tighter">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/50 font-black">P</div>
            Partner<span className="text-blue-500">Portal</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 space-y-2">
          <SidebarButton active={activeTab === 'stats'} onClick={() => setActiveTab('stats')} icon={<LayoutDashboard size={20} />} label="Обзор" />
          <div className="py-2">
            <button onClick={() => setIsProjectsMenuOpen(!isProjectsMenuOpen)} className="w-full flex items-center justify-between px-4 py-3 hover:text-white transition-all group">
              <div className="flex items-center gap-3">
                <ClipboardList size={20} className="group-hover:text-blue-400" />
                <span className="font-bold text-[11px] uppercase tracking-widest text-slate-400">Проекты</span>
              </div>
              {isProjectsMenuOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {isProjectsMenuOpen && (
              <div className="mt-1 space-y-1 ml-4 border-l border-slate-800">
                <SidebarSubButton active={activeTab === 'my-projects'} onClick={() => setActiveTab('my-projects')} label="Мои регистрации" />
                <SidebarSubButton active={activeTab === 'create-project'} onClick={() => { setActiveTab('create-project'); setEditingProject(null); setSelectedCategory(null); }} label="Новый проект" />
              </div>
            )}
          </div>
        </nav>

        <div className="p-6 border-t border-slate-800/50">
          <div className="bg-slate-800/40 rounded-2xl p-4 mb-4">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Партнер</p>
            <p className="text-white text-sm font-bold truncate">{user?.name}</p>
          </div>
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-400 font-bold text-xs uppercase tracking-widest transition-all">
            <LogOut size={18} /> Выйти
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-8 lg:p-12 relative">
        {activeTab === 'stats' && (
          <StatsView stats={stats} onRefresh={() => fetchProjects(true)} isLoading={loading} title="Панель Партнера" />
        )}

        {activeTab === 'my-projects' && (
          <ProjectsListView
            projects={filteredProjects}
            isLoading={loading}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            expandedId={expandedProjectId}
            setExpandedId={setExpandedProjectId}
            onEdit={(p) => { setEditingProject(p); setSelectedCategory(p.formType); setActiveTab('create-project'); }}
            onOpenChat={(p) => setChatProject(p)}
          />
        )}

        {activeTab === 'create-project' && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700">
            {!selectedCategory ? (
              <CategorySelection onSelect={setSelectedCategory} />
            ) : (
              <DynamicProjectForm
                category={selectedCategory}
                initialData={editingProject}
                isEditing={!!editingProject}
                onBack={() => { setEditingProject(null); setSelectedCategory(null); setActiveTab('my-projects'); }}
                onSubmit={async () => { await fetchProjects(); setActiveTab('my-projects'); }}
              />
            )}
          </div>
        )}
      </main>

      {/* УНИВЕРСАЛЬНЫЙ ЧАТ */}
      <ChatDrawer 
        isOpen={!!chatProject}
        project={chatProject}
        user={user}
        onClose={() => setChatProject(null)}
        onMessagesRead={handleMessagesRead} 
        variant="blue"
      />
    </div>
  );
};

// --- SIDEBAR HELPERS ---
const SidebarButton = ({ active, onClick, icon, label }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all ${active ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40' : 'text-slate-500 hover:text-slate-200'}`}>
    {icon} <span className="text-[11px] uppercase tracking-widest font-black">{label}</span>
  </button>
);

const SidebarSubButton = ({ active, onClick, label }: any) => (
  <button onClick={onClick} className={`w-full text-left px-5 py-3 rounded-xl text-[10px] uppercase tracking-widest font-black transition-all ${active ? 'text-blue-400' : 'text-slate-600 hover:text-white'}`}>
    • {label}
  </button>
);

// --- CATEGORY SELECTION ---
const CategorySelection = ({ onSelect }: { onSelect: (val: string) => void }) => (
  <div className="py-12 text-center">
    <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Этап 1</span>
    <h2 className="text-4xl font-black text-slate-900 uppercase mb-12 tracking-tighter">Выберите направление</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <CategoryCard title="Yealink Phones" desc="IP-Телефония" icon={<Layers />} onClick={() => onSelect('YEALINK_PHONES')} />
      <CategoryCard title="Networking" desc="Сетевое оборудование" icon={<Globe />} onClick={() => onSelect('NETWORKING')} />
      <CategoryCard title="Video Conf" desc="ВКС системы" icon={<Video />} onClick={() => onSelect('VIDEO_CONFERENCE')} />
    </div>
  </div>
);

const CategoryCard = ({ title, desc, icon, onClick }: any) => (
  <button onClick={onClick} className="bg-white p-10 rounded-[3rem] border border-slate-100 hover:border-blue-500 hover:shadow-2xl transition-all text-left group active:scale-95">
    <div className="w-16 h-16 bg-slate-50 text-slate-300 group-hover:bg-blue-600 group-hover:text-white rounded-[1.5rem] flex items-center justify-center mb-8 transition-all duration-500 shadow-inner">
      {React.isValidElement(icon) && React.cloneElement(icon as React.ReactElement<any>, { size: 32 })}
    </div>
    <h3 className="font-black text-slate-900 text-lg uppercase leading-none">{title}</h3>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-3">{desc}</p>
  </button>
);

export default UserDashboard;