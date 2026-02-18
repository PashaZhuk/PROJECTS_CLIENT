import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom'; 
import { Layers, Globe, Video } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Project, ActiveTabType } from '../types'; 

import { useAuthStore } from '../store/useAuthStore';
import { useProjectSockets } from '../hooks/useProjectSockets';
import { useGlobalChatLoader } from '../hooks/useGlobalChatLoader';
import projectApi from '../api/projects'; // Импортируем наш сервис на ky
import DynamicProjectForm from '../components/dashboard/forms/DynamicProjectForm';
import { StatsView } from '../components/dashboard/shared/StatsView';
import { ProjectsListView } from '../components/dashboard/shared/ProjectsListView';
import { ChatDrawer } from '../components/dashboard/shared/ChatDrawer';

interface DashboardContextType {
  activeTab: ActiveTabType;
  setActiveTab: (t: ActiveTabType) => void;
}

const CategoryCard = ({ title, desc, icon: Icon, onClick }: { title: string, desc: string, icon: LucideIcon, onClick: () => void }) => (
  <button 
    onClick={onClick} 
    className="bg-white p-10 rounded-[2.5rem] border border-slate-100 hover:border-blue-500 hover:shadow-xl transition-all text-left group"
  >
    <div className="w-16 h-16 bg-slate-50 text-slate-300 group-hover:bg-blue-600 group-hover:text-white rounded-2xl flex items-center justify-center mb-6 transition-colors">
      <Icon size={32} />
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
  </button>
);

const UserDashboard = () => {
  const user = useAuthStore((state) => state.user);
  const { activeTab, setActiveTab } = useOutletContext<DashboardContextType>();

  const [projects, setProjects] = useState<Project[]>([]); 
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [chatProject, setChatProject] = useState<Project | null>(null);

  const closeForm = useCallback(() => {
    setIsFormOpen(false);
    setSelectedCategory(null);
    setEditingProject(null);
    setActiveTab('projects-list');
  }, [setActiveTab]);

  useEffect(() => {
    if (activeTab === 'projects-create') {
      setEditingProject(null);
      setSelectedCategory(null);
      setIsFormOpen(true);
    } else if (activeTab === 'projects-list' || activeTab === 'stats') {
      if (isFormOpen) {
        setIsFormOpen(false);
        setSelectedCategory(null);
        setEditingProject(null);
      }
    }
  }, [activeTab, isFormOpen]);

  useGlobalChatLoader(user, projects);

  const userIdForSockets = useMemo(() => {
    if (!user?.id) return undefined;
    return typeof user.id === 'string' ? parseInt(user.id, 10) : user.id;
  }, [user?.id]);

  useProjectSockets(setProjects, userIdForSockets);

  // --- ПЕРЕПИСАНО НА KY ---
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      // Вызываем метод из нашего api/projects.ts
      // Он автоматически добавит префикс URL и credentials: include из конфига ky.ts
      const data = await projectApi.getProjects(currentPage, searchQuery);
      
      if (data && data.projects) {
        setProjects(data.projects);
        setTotalPages(data.totalPages || 1);
      }
    } catch (error: any) {
      console.error('Ошибка при загрузке проектов:', error);
      // Если это ошибка 401/403, глобальный хук в api/ky.ts 
      // автоматически перенаправит пользователя на логин.
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const stats = useMemo(() => ({
    total: projects.length,
    approved: projects.filter(p => p.status === 'APPROVED').length,
    pending: projects.filter(p => p.status === 'PENDING' || p.status === 'REVISION').length
  }), [projects]);

  const handleOpenChat = (projectId: number) => {
    const p = projects.find(item => item.id === projectId);
    if (p) setChatProject(p);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setSelectedCategory((project as any).category || (project as any).formType || null); 
    setIsFormOpen(true);
  };

  if (isFormOpen) {
    if (selectedCategory || editingProject) {
      return (
        <DynamicProjectForm 
          category={selectedCategory || (editingProject as any)?.formType || (editingProject as any)?.category} 
          project={editingProject} 
          onCancel={closeForm}
          onSuccess={() => {
            closeForm();
            fetchProjects();
          }}
        />
      );
    }

    return (
      <div className="max-w-6xl mx-auto p-8 animate-in slide-in-from-bottom-4 duration-700">
        <button 
          onClick={closeForm} 
          className="text-slate-400 font-bold text-[10px] uppercase mb-8 tracking-[0.2em] hover:text-blue-600 transition-colors"
        >
          ← Назад к списку
        </button>
        <h2 className="text-4xl font-black text-slate-900 uppercase mb-12 tracking-tighter">Выберите направление</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <CategoryCard title="Yealink" desc="IP-Телефония" icon={Layers} onClick={() => setSelectedCategory('YEALINK_PHONES')} />
          <CategoryCard title="Networking" desc="Сетевое оборудование" icon={Globe} onClick={() => setSelectedCategory('NETWORKING')} />
          <CategoryCard title="Video" desc="ВКС системы" icon={Video} onClick={() => setSelectedCategory('VIDEO_CONFERENCE')} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full animate-in fade-in duration-500">
      {activeTab === 'stats' && (
        <StatsView 
          stats={stats} 
          onRefresh={fetchProjects} 
          isLoading={loading} 
          title="Мои Проекты" 
          variant="blue" 
        />
      )}

      {activeTab === 'projects-list' && (
         <ProjectsListView
            projects={projects}
            isLoading={loading}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            expandedId={expandedId}
            setExpandedId={setExpandedId}
            onOpenChat={handleOpenChat}
            onEdit={handleEdit}
            user={user}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            onCreateNew={() => {
              setEditingProject(null);
              setIsFormOpen(true);
            }}
         />
      )}

      <ChatDrawer 
        isOpen={!!chatProject}
        project={chatProject}
        user={user}
        onClose={() => setChatProject(null)}
      />
    </div>
  );
};

export default UserDashboard;