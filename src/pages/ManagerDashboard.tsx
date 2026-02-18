import { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom'; 

import { useAuthStore } from '../store/useAuthStore';
import { useProjectStore } from '../store/useProjectStore';
import { useProjectSockets } from '../hooks/useProjectSockets';
import { useGlobalChatLoader } from '../hooks/useGlobalChatLoader'; // Добавили импорт

import type { Project, ActiveTabType } from '../types'; 
import { StatsView } from '../components/dashboard/shared/StatsView';
import { ProjectsListView } from '../components/dashboard/shared/ProjectsListView';
import { ChatDrawer } from '../components/dashboard/shared/ChatDrawer';

const ManagerDashboard = () => {
  const user = useAuthStore((state) => state.user);
  const { activeTab } = useOutletContext<{ activeTab: ActiveTabType }>();

  const { 
    projects, loading, totalCount, totalPages, currentPage, searchQuery,
    fetchProjects, updateProjectStatus, setSearchQuery, setCurrentPage, setProjects 
  } = useProjectStore();

  const [expandedProjectId, setExpandedProjectId] = useState<number | null>(null);
  const [chatProject, setChatProject] = useState<Project | null>(null);

  // ПОДКЛЮЧЕНИЕ ГЛОБАЛЬНОГО ЛОАДЕРА ЧАТА
  useGlobalChatLoader(user, projects);

  const userIdForSockets = useMemo(() => {
    if (!user?.id) return undefined;
    return typeof user.id === 'string' ? parseInt(user.id, 10) : user.id;
  }, [user?.id]);
  
  useProjectSockets(setProjects, userIdForSockets);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects, currentPage, searchQuery]);

  const stats = useMemo(() => ({
    total: totalCount,
    approved: projects.filter(p => p.status === 'APPROVED').length,
    pending: projects.filter(p => p.status === 'PENDING' || p.status === 'REVISION').length
  }), [projects, totalCount]);

  const handleOpenChat = (projectId: number) => {
    const project = projects.find(p => p.id === projectId);
    if (project) setChatProject(project as Project);
  };

  return (
    <div className="w-full animate-in fade-in duration-500">
      {activeTab === 'stats' && (
        <StatsView 
          stats={stats} 
          onRefresh={() => fetchProjects(true)} 
          isLoading={loading} 
          title="Панель Менеджера" 
          variant="emerald" 
        />
      )}

      {activeTab === 'projects-list' && (
        <div className="space-y-8">
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
        </div>
      )}

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