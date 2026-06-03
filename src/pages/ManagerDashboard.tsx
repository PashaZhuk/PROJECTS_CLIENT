import { useMemo, useState, useCallback, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useProjects, useUpdateProjectStatus } from '../hooks/useProjectsQuery';
import { useChatStore } from '../store/useChatStore';
import { useProjectSockets } from '../hooks/useProjectSockets';
import { useGlobalChatLoader } from '../hooks/useGlobalChatLoader';
import { useUserSockets } from '../hooks/useUserSockets';
import type { Project, ActiveTabType } from '../types';
import { StatsView } from '../components/dashboard/shared/StatsView';
import { listenBroadcastSaved } from '../lib/broadcast';
import { ProjectsListView } from '../components/dashboard/shared/ProjectsListView';
import ManagerBroadcast from '../components/dashboard/manager/ManagerBroadcast';
import BroadcastJournal from '../components/dashboard/manager/BroadcastJournal';
import EquipmentRegister from '../components/dashboard/manager/EquipmentRegister';
import MonitoringHistory from '../components/dashboard/manager/MonitoringHistory';
import ManagerNews from '../components/dashboard/manager/ManagerNews';
import { ChatDrawer } from '../components/dashboard/shared/ChatDrawer';
import api from '../api/ky';
import { Rocket } from 'lucide-react';

const SHOW_WORKING_FEATURES = false;

const WorkInProgressBanner = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in zoom-in-95 duration-500">
    <div className="bg-white rounded-[3rem] border border-slate-200 shadow-xl p-12 max-w-2xl w-full text-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-200 via-emerald-400 to-emerald-200" />
      <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
        <Rocket className="text-emerald-500" size={48} />
      </div>
      <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-4">{title}</h2>
      <p className="text-slate-500 font-medium mb-8 max-w-md mx-auto leading-relaxed text-lg">
        Этот раздел находится в активной разработке. Старый функционал скрыт до момента финальной демонстрации.
      </p>
      <div className="inline-flex items-center gap-3 px-6 py-3 bg-emerald-50 border border-emerald-200 rounded-full">
        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
        <span className="text-[13px] font-bold text-emerald-700 uppercase tracking-widest">Скоро доступно</span>
      </div>
    </div>
  </div>
);

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

  // Слушатель BroadcastChannel — если данные сохранены в другой вкладке
  useEffect(() => {
    return listenBroadcastSaved((msg) => {
      if (msg.entityType === 'equipment' || msg.entityType === 'news' || msg.entityType === 'project') {
        console.debug(`[Broadcast] ${msg.entityType} ${msg.action} in another tab`);
      }
    });
  }, []);

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
      {!SHOW_WORKING_FEATURES && activeTab === 'projects-list' && <WorkInProgressBanner title="Управление проектами" />}
      {!SHOW_WORKING_FEATURES && activeTab === 'orders-list' && <WorkInProgressBanner title="Управление заказами" />}
      {SHOW_WORKING_FEATURES && activeTab === 'projects-list' && (
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
      {SHOW_WORKING_FEATURES && activeTab === 'orders-list' && (
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
