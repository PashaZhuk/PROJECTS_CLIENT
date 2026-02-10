import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom'; 
import { Layers, Globe, Video } from 'lucide-react';

// Использование type-only импортов для соответствия verbatimModuleSyntax
import type { Project, ActiveTabType } from '../types'; 

import { useAuth } from '../context/AuthContext';
import { useProjectSockets } from '../hooks/useProjectSockets';
import DynamicProjectForm from '../components/dashboard/forms/DynamicProjectForm';
import { StatsView } from '../components/dashboard/shared/StatsView';
import { ProjectsListView } from '../components/dashboard/shared/ProjectsListView';
import { ChatDrawer } from '../components/dashboard/shared/ChatDrawer';

interface DashboardContextType {
  activeTab: ActiveTabType;
  setActiveTab: (t: ActiveTabType) => void;
}

const UserDashboard = () => {
  const { user } = useAuth();
  const context = useOutletContext<DashboardContextType>();
  const { activeTab, setActiveTab } = context;

  const [projects, setProjects] = useState<Project[]>([]); 
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0); 
  const [debouncedSearch, setDebouncedSearch] = useState(''); 

  const [expandedProjectId, setExpandedProjectId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [chatProject, setChatProject] = useState<Project | null>(null);

  /**
   * ИСПРАВЛЕНИЕ ОШИБКИ: Приведение id к числу.
   * Если в БД или токене ID хранится как строка, преобразуем его для хука.
   */
  const userIdForSockets = typeof user?.id === 'string' ? parseInt(user.id, 10) : user?.id;
  useProjectSockets(setProjects, userIdForSockets);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchProjects = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: '10',
        search: debouncedSearch.trim()
      });
      const response = await fetch(`http://192.168.85.110:5001/api/projects?${params}`, { credentials: 'include' });
      const data = await response.json();
      setProjects(data.projects || []);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.totalCount || 0);
    } catch (err) {
      console.error(err);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [currentPage, debouncedSearch]);

  useEffect(() => { fetchProjects(true); }, [fetchProjects]);

  return (
    <div className="w-full animate-in fade-in duration-500">
      {activeTab === 'stats' && (
        <StatsView 
          stats={{ pending: 0, approved: 0, total: totalCount }} 
          onRefresh={() => fetchProjects(true)} 
          isLoading={loading} 
          title="Панель Партнера" 
        />
      )}

      {activeTab === 'projects-list' && (
        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Мои регистрации</h2>
            <button 
              onClick={() => setActiveTab('projects-create')} 
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-blue-100"
            >
              + Новый проект
            </button>
          </div>

          <ProjectsListView
            projects={projects}
            isLoading={loading}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            expandedId={expandedProjectId}
            setExpandedId={setExpandedProjectId}
            onEdit={(p: Project) => { 
              setEditingProject(p);
              // Явно указываем категорию из данных проекта или дефолтную
              setSelectedCategory((p as any).formType || 'YEALINK_PHONES'); 
              setActiveTab('projects-create'); 
            }}
            onOpenChat={(p: Project) => setChatProject(p)}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {activeTab === 'projects-create' && (
        <div className="max-w-4xl mx-auto py-4">
          {!selectedCategory ? (
            <CategorySelection onSelect={setSelectedCategory} onCancel={() => setActiveTab('projects-list')} />
          ) : (
            <DynamicProjectForm
              category={selectedCategory}
              initialData={editingProject}
              isEditing={!!editingProject}
              onBack={() => { 
                setEditingProject(null); 
                setSelectedCategory(null); 
                setActiveTab('projects-list'); 
              }}
              onSubmit={async () => { 
                await fetchProjects(); 
                setActiveTab('projects-list'); 
              }}
            />
          )}
        </div>
      )}

      <ChatDrawer 
        isOpen={!!chatProject} 
        project={chatProject} 
        user={user} 
        onClose={() => setChatProject(null)} 
        variant="blue" 
      />
    </div>
  );
};

const CategorySelection = ({ onSelect, onCancel }: { onSelect: (c: string) => void, onCancel: () => void }) => (
  <div className="text-center py-10">
    <button onClick={onCancel} className="text-slate-400 font-bold text-[10px] uppercase mb-8 tracking-[0.2em] hover:text-blue-600 transition-colors">
      ← Назад к списку
    </button>
    <h2 className="text-4xl font-black text-slate-900 uppercase mb-12 tracking-tighter">Выберите направление</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <CategoryCard title="Yealink" desc="IP-Телефония" icon={<Layers />} onClick={() => onSelect('YEALINK_PHONES')} />
      <CategoryCard title="Networking" desc="Сетевое оборудование" icon={<Globe />} onClick={() => onSelect('NETWORKING')} />
      <CategoryCard title="Video" desc="ВКС системы" icon={<Video />} onClick={() => onSelect('VIDEO_CONFERENCE')} />
    </div>
  </div>
);

const CategoryCard = ({ title, desc, icon, onClick }: { title: string, desc: string, icon: React.ReactNode, onClick: () => void }) => (
  <button 
    onClick={onClick} 
    className="bg-white p-10 rounded-[2.5rem] border border-slate-100 hover:border-blue-500 hover:shadow-xl transition-all text-left group"
  >
    <div className="w-16 h-16 bg-slate-50 text-slate-300 group-hover:bg-blue-600 group-hover:text-white rounded-2xl flex items-center justify-center mb-8 transition-colors duration-300">
      {icon}
    </div>
    <h3 className="font-black text-slate-900 uppercase text-xl">{title}</h3>
    <p className="text-[10px] font-bold text-slate-400 uppercase mt-2 tracking-widest">{desc}</p>
  </button>
);

export default UserDashboard;