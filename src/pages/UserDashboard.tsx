import { useState, useEffect, useCallback, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { Project, ActiveTabType } from '../types';
import { useAuthStore } from '../store/useAuthStore';
import { useProjects } from '../hooks/useProjectsQuery';
import { useChatStore } from '../store/useChatStore';
import { useProjectSockets } from '../hooks/useProjectSockets';
import { useGlobalChatLoader } from '../hooks/useGlobalChatLoader';
import { useUserSockets } from '../hooks/useUserSockets';
import { Rocket } from 'lucide-react';
import DynamicProjectForm from '../components/dashboard/forms/DynamicProjectForm';
import { ProjectsListView } from '../components/dashboard/shared/ProjectsListView';
import { ChatDrawer } from '../components/dashboard/shared/ChatDrawer';
import { NewsCards } from '../components/dashboard/shared/NewsCards';
import OneCIntegrationCards from '../components/dashboard/shared/OneCIntegrationCards';
import { StatsView } from '../components/dashboard/shared/StatsView';
import api from '../api/ky';

const SHOW_WORKING_FEATURES = false;

const WorkInProgressBanner = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in zoom-in-95 duration-500">
    <div className="bg-white rounded-[3rem] border border-slate-200 shadow-xl p-12 max-w-2xl w-full text-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200" />
      <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
        <Rocket className="text-blue-500" size={48} />
      </div>
      <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-4">{title}</h2>
      <p className="text-slate-500 font-medium mb-8 max-w-md mx-auto leading-relaxed text-lg">
        Этот раздел находится в активной разработке. Старый функционал скрыт до момента финальной демонстрации.
      </p>
      <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-50 border border-blue-200 rounded-full">
        <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-ping" />
        <span className="text-xs font-black text-blue-700 uppercase tracking-widest">Скоро доступно</span>
      </div>
    </div>
  </div>
);

const UserDashboard = () => {
  const user = useAuthStore((state) => state.user);
  const { activeTab, setActiveTab } = useOutletContext<{
    activeTab: ActiveTabType;
    setActiveTab: (t: ActiveTabType) => void;
  }>();

  useUserSockets();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const { data: projectsData, isLoading, refetch } = useProjects(currentPage, searchQuery);

  const projects = projectsData?.projects ?? [];
  const totalCount = projectsData?.totalCount ?? 0;
  const totalPages = projectsData?.totalPages ?? 1;
  const loading = isLoading;

  const setActiveChatId = useChatStore((state) => state.setActiveChatId);
  const markMessagesAsReadLocally = useChatStore((state) => state.markMessagesAsReadLocally);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [_selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [chatProject, setChatProject] = useState<Project | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useGlobalChatLoader(user, projects);
  useProjectSockets(user?.id);

  useEffect(() => {
    if (activeTab === 'projects-create') {
      setEditingProject(null);
      setSelectedCategory(null);
      setIsFormOpen(true);
    }
  }, [activeTab]);

  const handleOpenChat = useCallback(async (projectId: number) => {
    const project = projects.find(p => p.id === projectId);
    if (project && user?.id) {
      setChatProject(project);
      setActiveChatId(projectId);
      markMessagesAsReadLocally(projectId, user.id);
      try {
        await api.patch(`chat/${projectId}/read`, { json: {} });
        console.log('[UserDashboard] Marked as read via API');
      } catch (err) {
        console.error("Failed to mark messages as read on server", err);
      }
    }
  }, [projects, setActiveChatId, markMessagesAsReadLocally, user?.id]);

  const handleCloseChat = useCallback(() => {
    setChatProject(null);
    setActiveChatId(null);
  }, [setActiveChatId]);

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setSelectedCategory((project as any).formType || (project as any).category || null);
    setIsFormOpen(true);
  };

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false);
    setSelectedCategory(null);
    setEditingProject(null);
    setActiveTab('projects-list');
  }, [setActiveTab]);

  const stats = useMemo(() => ({
    total: totalCount,
    active: projects.filter(p => p.status === 'IN_PROGRESS').length,
    completed: projects.filter(p => p.status === 'CLOSED').length,
    pending: projects.filter(p => p.status === 'PENDING' || p.status === 'REVISION').length,
    approved: projects.filter(p => p.status === 'APPROVED').length
  }), [projects, totalCount]);

  if (!SHOW_WORKING_FEATURES) {
    if (activeTab === 'stats') {
      return (
        <div className="space-y-10">
          <NewsCards />
          <OneCIntegrationCards />
        </div>
      );
    }
    if (activeTab === 'orders-list' || activeTab === 'orders-create') {
      return <WorkInProgressBanner title={activeTab === 'orders-list' ? 'Мои заказы' : 'Создать новый заказ'} />;
    }
    if (activeTab === 'projects-list' || activeTab === 'projects-create') {
       return <WorkInProgressBanner title="Работа с проектами" />;
    }
    return <WorkInProgressBanner title="Раздел в разработке" />;
  }

  return (
    <>
      {activeTab === 'stats' && (
        <>
          <NewsCards />
          <StatsView stats={stats} onRefresh={() => refetch()} isLoading={loading} title="Мои Проекты" variant="blue" />
        </>
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
          onCreateNew={() => { setEditingProject(null); setSelectedCategory(null); setIsFormOpen(true); }}
        />
      )}
      {activeTab === 'orders-list' && <WorkInProgressBanner title="Мои заказы" />}
      {activeTab === 'orders-create' && <WorkInProgressBanner title="Работа с заказами" />}
      
      <ChatDrawer isOpen={!!chatProject} project={chatProject} user={user} onClose={handleCloseChat} variant="blue" />
      {isFormOpen && (
        <DynamicProjectForm
          onClose={handleCloseForm}
          onSuccess={async () => { handleCloseForm(); await refetch(); }}
          initialData={editingProject}
        />
      )}
    </>
  );
};

export default UserDashboard;