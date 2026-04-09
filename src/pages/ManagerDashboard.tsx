import { useEffect, useMemo, useState, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useProjectStore } from '../store/useProjectStore';
import { useChatStore } from '../store/useChatStore';
import { useProjectSockets } from '../hooks/useProjectSockets';
import { useGlobalChatLoader } from '../hooks/useGlobalChatLoader';
import type { Project, ActiveTabType } from '../types';
import { StatsView } from '../components/dashboard/shared/StatsView';
import { ProjectsListView } from '../components/dashboard/shared/ProjectsListView';
import { ChatDrawer } from '../components/dashboard/shared/ChatDrawer';

const ManagerDashboard = () => {
  const user = useAuthStore((state) => state.user);
  const { activeTab } = useOutletContext<{ activeTab: ActiveTabType }>();
  const {
    projects, loading, totalCount, totalPages, currentPage, searchQuery,
    fetchProjects, updateProjectStatus, setSearchQuery, setCurrentPage
  } = useProjectStore();
  
  const setActiveChatId = useChatStore((state) => state.setActiveChatId);
  const markMessagesAsReadLocally = useChatStore((state) => state.markMessagesAsReadLocally);

  const [expandedProjectId, setExpandedProjectId] = useState<number | null>(null);
  const [chatProject, setChatProject] = useState<Project | null>(null);

  useGlobalChatLoader(user, projects);
  const userIdForSockets = useMemo(() => user?.id ? (typeof user.id === 'string' ? parseInt(user.id, 10) : user.id) : undefined, [user?.id]);
  useProjectSockets(userIdForSockets);

  useEffect(() => { fetchProjects(); }, [fetchProjects, currentPage, searchQuery]);

  const stats = useMemo(() => ({
    total: totalCount,
    approved: projects.filter(p => p.status === 'APPROVED').length,
    pending: projects.filter(p => p.status === 'PENDING' || p.status === 'REVISION').length
  }), [projects, totalCount]);

  const handleOpenChat = useCallback(async (projectId: number) => {
    const project = projects.find(p => p.id === projectId);
    if (project && user?.id) {
      setChatProject(project as Project);
      setActiveChatId(projectId);
      
      // 1. Локально помечаем чужие сообщения как прочитанные
      markMessagesAsReadLocally(projectId, user.id);

      // 2. 🛑 ОТПРАВЛЯЕМ ЗАПРОС НА СЕРВЕР, чтобы тот уведомил Пользователя (отправили)
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

  return (
    <div className="space-y-8">
      {activeTab === 'stats' && (
        <StatsView stats={stats} onRefresh={() => fetchProjects(true)} isLoading={loading} title="Панель Менеджера" variant="emerald" />
      )}
      {activeTab === 'projects-list' && (
        <ProjectsListView
          projects={projects}
          isLoading={loading}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          expandedId={expandedProjectId}
          setExpandedId={setExpandedProjectId}
          isAdminView={true} 
          onStatusUpdate={updateProjectStatus}
          onOpenChat={handleOpenChat}
          user={user} 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
      <ChatDrawer isOpen={!!chatProject} project={chatProject} user={user} onClose={() => setChatProject(null)} variant="emerald" />
    </div>
  );
};
export default ManagerDashboard;