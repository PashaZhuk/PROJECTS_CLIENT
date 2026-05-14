import { useMemo, useState, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useProjects, useUpdateProjectStatus } from '../hooks/useProjectsQuery';
import { useChatStore } from '../store/useChatStore';
import { useProjectSockets } from '../hooks/useProjectSockets';
import { useGlobalChatLoader } from '../hooks/useGlobalChatLoader';
import { useUserSockets } from '../hooks/useUserSockets';
import type { Project, ActiveTabType } from '../types';
import { StatsView } from '../components/dashboard/shared/StatsView';
import { ProjectsListView } from '../components/dashboard/shared/ProjectsListView';
import ManagerBroadcast from '../components/dashboard/manager/ManagerBroadcast';
import BroadcastJournal from '../components/dashboard/manager/BroadcastJournal';
import EquipmentRegister from '../components/dashboard/manager/EquipmentRegister';
import MonitoringHistory from '../components/dashboard/manager/MonitoringHistory';
import ManagerNews from '../components/dashboard/manager/ManagerNews';
import { ChatDrawer } from '../components/dashboard/shared/ChatDrawer';
import api from '../api/ky';

const ManagerDashboard = () => {
  const user = useAuthStore((state) => state.user);
  const { activeTab } = useOutletContext<{ activeTab: ActiveTabType }>();
  
  useUserSockets();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const { data: projectsData, isFetching, refetch } = useProjects(currentPage, searchQuery);
  const updateStatusMutation = useUpdateProjectStatus();

  const projects = projectsData?.projects ?? [];
  const totalCount = projectsData?.totalCount ?? 0;
  const totalPages = projectsData?.totalPages ?? 1;
  const loading = isFetching;

  const handleUpdateStatus = useCallback(async (id: number, status: string) => {
    await updateStatusMutation.mutateAsync({ id, status });
  }, [updateStatusMutation]);

  const setActiveChatId = useChatStore((state) => state.setActiveChatId);
  const markMessagesAsReadLocally = useChatStore((state) => state.markMessagesAsReadLocally);

  const [expandedProjectId, setExpandedProjectId] = useState<number | null>(null);
  const [chatProject, setChatProject] = useState<Project | null>(null);

  useGlobalChatLoader(user, projects);

  const userIdForSockets = useMemo(() => user?.id ? (typeof user.id === 'string' ? parseInt(user.id, 10) : user.id) : undefined, [user?.id]);
  useProjectSockets(userIdForSockets);

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
      markMessagesAsReadLocally(projectId, user.id);
      try {
        await api.patch(`chat/${projectId}/read`, { json: {} });
      } catch (err) {
        console.error("Failed to mark messages as read on server", err);
      }
    }
  }, [projects, setActiveChatId, markMessagesAsReadLocally, user?.id]);

  return (
    <>
      {activeTab === 'stats' && (
        <StatsView stats={stats} onRefresh={() => refetch()} isLoading={loading} title="Панель Менеджера" variant="emerald" />
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
          onStatusUpdate={handleUpdateStatus}
          onOpenChat={handleOpenChat}
          user={user}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
      {activeTab === 'orders-list' && (
        <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-400">Все заказы — в разработке</h2>
        </div>
      )}
      {activeTab === 'broadcast' && <ManagerBroadcast />}
      {activeTab === 'broadcast-journal' && <BroadcastJournal />}
      {activeTab === 'equipment' && <EquipmentRegister />}
      {activeTab === 'monitoring-history' && <MonitoringHistory />}
      {activeTab === 'news' && <ManagerNews />}
      
      <ChatDrawer isOpen={!!chatProject} project={chatProject} user={user} onClose={() => setChatProject(null)} variant="emerald" />
    </>
  );
};

export default ManagerDashboard;
