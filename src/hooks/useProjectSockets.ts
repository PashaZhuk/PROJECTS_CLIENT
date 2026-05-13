import { useEffect, useRef } from 'react';
import { getSocket } from '../api/socket';
import { queryClient } from '../lib/queryClient';

export const useProjectSockets = (userId: number | string | undefined) => {
  const socketRef = useRef<ReturnType<typeof getSocket>>(null);

  useEffect(() => {
    if (!userId) {
      return;
    }

    const socket = getSocket();
    if (!socket) {
      return;
    }

    socketRef.current = socket;

    const onConnect = () => {
      socket.emit('join_self_room', userId);
      socket.emit('subscribe_admin_stats');
    };

    const onConnectError = (err: Error) => {
      console.error('❌ Ошибка сокет-подключения:', err.message);
    };

    const updateProjectsCache = (updater: (data: any) => any) => {
      queryClient.setQueriesData({ queryKey: ['projects'] }, (old: any) => {
        if (!old) return old;
        return updater(old);
      });
    };

    const onProjectCreated = (newProject: any) => {
      updateProjectsCache((old) => {
        if (!old?.projects) return old;
        if (old.projects.some((p: any) => p.id === newProject.id)) return old;
        return {
          ...old,
          projects: [newProject, ...old.projects],
          totalCount: (old.totalCount ?? 0) + 1,
        };
      });
    };

    const onProjectUpdated = (updatedProject: any) => {
      updateProjectsCache((old) => {
        if (!old?.projects) return old;
        return {
          ...old,
          projects: old.projects.map((p: any) =>
            p.id === updatedProject.id ? { ...p, ...updatedProject } : p
          ),
        };
      });
    };

    const onProjectStatusChanged = (updatedProject: any) => {
      updateProjectsCache((old) => {
        if (!old?.projects) return old;
        const existing = old.projects.find((p: any) => p.id === updatedProject.id);
        if (!existing) return old;

        const filtered = old.projects.filter((p: any) => p.id !== updatedProject.id);
        const processed = {
          ...existing,
          ...updatedProject,
          unreadCount: updatedProject._count?.messages ?? existing.unreadCount ?? 0,
          hasUnread: (updatedProject._count?.messages ?? existing.unreadCount ?? 0) > 0,
        };
        return {
          ...old,
          projects: [processed, ...filtered].sort(
            (a: any, b: any) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          ),
        };
      });
    };

    socket.on('connect', onConnect);
    socket.on('connect_error', onConnectError);
    socket.on('project_created', onProjectCreated);
    socket.on('project_updated', onProjectUpdated);
    socket.on('project_status_changed', onProjectStatusChanged);

    return () => {
      if (socket) {
        socket.off('connect', onConnect);
        socket.off('connect_error', onConnectError);
        socket.off('project_created', onProjectCreated);
        socket.off('project_updated', onProjectUpdated);
        socket.off('project_status_changed', onProjectStatusChanged);
      }
    };
  }, [userId]);
};
