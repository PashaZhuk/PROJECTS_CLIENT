import { useState, useEffect, useCallback, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { Project, ActiveTabType } from '../types';
import { useAuthStore } from '../store/useAuthStore';
import { useProjectStore } from '../store/useProjectStore';
import { useChatStore } from '../store/useChatStore';
import { useProjectSockets } from '../hooks/useProjectSockets';
import { useGlobalChatLoader } from '../hooks/useGlobalChatLoader';
import DynamicProjectForm from '../components/dashboard/forms/DynamicProjectForm';
import { StatsView } from '../components/dashboard/shared/StatsView';
import { ProjectsListView } from '../components/dashboard/shared/ProjectsListView';
import { ChatDrawer } from '../components/dashboard/shared/ChatDrawer';

const UserDashboard = () => {
  const user = useAuthStore((state) => state.user);
  const { activeTab } = useOutletContext<{ activeTab: ActiveTabType }>();
  const {
    projects, loading, totalCount, totalPages, currentPage, searchQuery,
    fetchProjects, setSearchQuery, setCurrentPage
  } = useProjectStore();
  
  const setActiveChatId = useChatStore((state) => state.setActiveChatId);
  const markMessagesAsReadLocally = useChatStore((state) => state.markMessagesAsReadLocally);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [chatProject, setChatProject] = useState<Project | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useGlobalChatLoader(user, projects);
  useProjectSockets(user?.id);

  useEffect(() => { fetchProjects(); }, [currentPage, searchQuery, fetchProjects]);

  const handleOpenChat = useCallback(async (projectId: number) => {
    const project = projects.find(p => p.id === projectId);
    if (project && user?.id) {
      setChatProject(project);
      setActiveChatId(projectId);
      
      // 1. Локально помечаем чужие сообщения как прочитанные
      markMessagesAsReadLocally(projectId, user.id);
      
      // 2. 🛑 ОТПРАВЛЯЕМ ЗАПРОС НА СЕРВЕР, чтобы тот уведомил Менеджера (отправили)
      try {
        await fetch(`/api/chat/${projectId}/read`, { 
          method: 'POST', 
          credentials: 'include' 
        });
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
    setIsFormOpen(true);
  };

  const stats = useMemo(() => ({
    total: totalCount,
    active: projects.filter(p => p.status === 'IN_PROGRESS' || p.status === 'START').length,
    completed: projects.filter(p => p.status === 'COMPLETED').length,
    pending: projects.filter(p => p.status === 'PENDING' || p.status === 'REVISION').length,
    approved: projects.filter(p => p.status === 'APPROVED').length
  }), [projects, totalCount]);

  return (
    <div className="space-y-8">
      {activeTab === 'stats' && (
        <StatsView stats={stats} onRefresh={() => fetchProjects()} isLoading={loading} title="Мои Проекты" variant="blue" />
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
          onCreateNew={() => { setEditingProject(null); setIsFormOpen(true); }}
        />
      )}
      <ChatDrawer isOpen={!!chatProject} project={chatProject} user={user} onClose={handleCloseChat} variant="blue" />
      {isFormOpen && (
        <DynamicProjectForm onClose={() => setIsFormOpen(false)} onSuccess={async () => { setIsFormOpen(false); await fetchProjects(); }} initialData={editingProject} />
      )}
    </div>
  );
};
export default UserDashboard;