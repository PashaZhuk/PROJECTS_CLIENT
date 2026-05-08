import { useEffect, useMemo, useState, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useProjectStore } from '../store/useProjectStore';
import { useChatStore } from '../store/useChatStore';
import { useProjectSockets } from '../hooks/useProjectSockets';
import { useGlobalChatLoader } from '../hooks/useGlobalChatLoader';
import { useUserSockets } from '../hooks/useUserSockets';
import { Rocket } from 'lucide-react';
import type { Project, ActiveTabType } from '../types';
import { StatsView } from '../components/dashboard/shared/StatsView';
import { ProjectsListView } from '../components/dashboard/shared/ProjectsListView';
import ManagerBroadcast from '../components/dashboard/manager/ManagerBroadcast';
import { ChatDrawer } from '../components/dashboard/shared/ChatDrawer';
import api from '../api/ky'; // <-- импортируем api

// Переключатель (оставьте как есть)
const SHOW_WORKING_FEATURES = true;

const WorkInProgressBanner = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in zoom-in-95 duration-500">
    <div className="bg-white rounded-[3rem] border border-slate-200 shadow-xl p-12 max-w-2xl w-full text-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-200 via-emerald-400 to-emerald-200" />
      <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
        <Rocket className="text-emerald-500" size={48} />
      </div>
      <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-4">{title}</h2>
      <p className="text-slate-500 font-medium mb-8 max-w-md mx-auto leading-relaxed text-lg">
        Данный модуль находится в разработке. Доступ к текущему функционалу временно ограничен.
      </p>
      <div className="inline-flex items-center gap-3 px-6 py-3 bg-emerald-50 border border-emerald-200 rounded-full">
        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
        <span className="text-xs font-black text-emerald-700 uppercase tracking-widest">В процессе</span>
      </div>
    </div>
  </div>
);

const ManagerDashboard = () => {
  const user = useAuthStore((state) => state.user);
  const { activeTab } = useOutletContext<{ activeTab: ActiveTabType }>();
  
  useUserSockets(); 

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
      markMessagesAsReadLocally(projectId, user.id);
      try {
        // Используем api.patch вместо fetch
        await api.patch(`chat/${projectId}/read`, { json: {} });
      } catch (err) {
        console.error("Failed to mark messages as read on server", err);
      }
    }
  }, [projects, setActiveChatId, markMessagesAsReadLocally, user?.id]);

  if (!SHOW_WORKING_FEATURES) {
    if (activeTab === 'orders-list') return <WorkInProgressBanner title="Все заказы" />;
    if (activeTab === 'projects-list' || activeTab === 'stats') return <WorkInProgressBanner title="Управление проектами" />;
    return <WorkInProgressBanner title="Раздел в разработке" />;
  }

  return (
    <>
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
            {activeTab === 'orders-list' && <WorkInProgressBanner title="Все заказы" />}
      {activeTab === 'broadcast' && <ManagerBroadcast />}
      
      <ChatDrawer isOpen={!!chatProject} project={chatProject} user={user} onClose={() => setChatProject(null)} variant="emerald" />
    </>
  );
};

export default ManagerDashboard;