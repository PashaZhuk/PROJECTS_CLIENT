import { useEffect, useRef } from 'react';
import { getSocket } from '../api/socket';
import { useProjectStore } from '../store/useProjectStore';

export const useProjectSockets = (userId: number | string | undefined) => {
  const socketRef = useRef<ReturnType<typeof getSocket>>(null);
  const setProjects = useProjectStore((state) => state.setProjects);

  useEffect(() => {
    if (!userId) {
      console.log('⚠️ [Socket Debug] Пропуск подключения: userId не определен');
      return;
    }

    const socket = getSocket();
    if (!socket) {
      console.log('⚠️ [Socket Debug] Socket не инициализирован');
      return;
    }

    socketRef.current = socket;

    const onConnect = () => {
      console.log(`✅ [Socket Debug] Подключено! ID: ${socket.id}. Для User: ${userId}`);
      socket.emit('join_self_room', userId);
      socket.emit('subscribe_admin_stats');
    };

    const onConnectError = (err: Error) => {
      console.error('❌ [Socket Debug] Ошибка подключения:', err.message);
    };

    const onAny = (eventName: string, ...args: any[]) => {
      console.log(`🔹 [Socket Debug] Поймано любое событие: [${eventName}]`, args);
    };

    const onProjectCreated = (newProject: any) => {
      console.log('🆕 [Socket Debug] project_created:', newProject);
      setProjects((prev: any[]) => {
        if (prev.some((p: any) => p.id === newProject.id)) return prev;
        return [newProject, ...prev];
      });
    };

    const onProjectUpdated = (updatedProject: any) => {
      console.log('✏️ [Socket Debug] project_updated:', updatedProject);
      setProjects((prev: any[]) => {
        if (!prev.some((p: any) => p.id === updatedProject.id)) return prev;
        return prev.map((p: any) => p.id === updatedProject.id ? { ...p, ...updatedProject } : p);
      });
    };

    const onProjectStatusChanged = (updatedProject: any) => {
      console.log('🚀 [Socket Debug] project_status_changed', updatedProject);
      setProjects((prev: any[]) => {
        const existingProject = prev.find((p: any) => p.id === updatedProject.id);
        if (!existingProject) return prev;

        const filtered = prev.filter((p: any) => p.id !== updatedProject.id);
        const processed = {
          ...existingProject,
          ...updatedProject,
          unreadCount: updatedProject._count?.messages ?? existingProject?.unreadCount ?? 0,
          hasUnread: (updatedProject._count?.messages ?? existingProject?.unreadCount ?? 0) > 0
        };
        return [processed, ...filtered].sort((a: any, b: any) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      });
    };

    socket.on('connect', onConnect);
    socket.on('connect_error', onConnectError);
    socket.onAny(onAny);
    socket.on('project_created', onProjectCreated);
    socket.on('project_updated', onProjectUpdated);
    socket.on('project_status_changed', onProjectStatusChanged);
    // ❌ Удаляем socket.on('new_message', ...) – теперь чат обрабатывается в useGlobalChatLoader

    return () => {
      if (socket) {
        socket.off('connect', onConnect);
        socket.off('connect_error', onConnectError);
        socket.offAny(onAny);
        socket.off('project_created', onProjectCreated);
        socket.off('project_updated', onProjectUpdated);
        socket.off('project_status_changed', onProjectStatusChanged);
      }
    };
  }, [userId, setProjects]);
};