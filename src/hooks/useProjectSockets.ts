import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useChatStore } from '../store/useChatStore';
import { useProjectStore } from '../store/useProjectStore';

const SOCKET_URL = 'http://192.168.85.110:5001';

export const useProjectSockets = (userId: number | string | undefined) => {
  const socketRef = useRef<Socket | null>(null);
  const setProjects = useProjectStore((state) => state.setProjects);

  useEffect(() => {
    if (!userId) {
      console.log('⚠️ [Socket Debug] Пропуск подключения: userId не определен');
      return;
    }

    const socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket'],
      forceNew: true,
      reconnectionAttempts: 5
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log(`✅ [Socket Debug] Подключено! ID: ${socket.id}. Для User: ${userId}`);
      socket.emit('join_self_room', userId);
      socket.emit('subscribe_admin_stats');
    });

    socket.on('connect_error', (err) => {
      console.error('❌ [Socket Debug] Ошибка подключения:', err.message);
    });

    socket.onAny((eventName, ...args) => {
      console.log(`🔹 [Socket Debug] Поймано любое событие: [${eventName}]`, args);
    });

    // 1. НОВЫЙ ПРОЕКТ СОЗДАН (другая вкладка)
    socket.on('project_created', (newProject) => {
      console.log('🆕 [Socket Debug] project_created:', newProject);
      setProjects((prev: any[]) => {
        if (prev.some((p: any) => p.id === newProject.id)) return prev;
        return [newProject, ...prev];
      });
    });

    // 2. ПРОЕКТ ОБНОВЛЁН (редактирование с другой вкладки)
    socket.on('project_updated', (updatedProject) => {
      console.log('✏️ [Socket Debug] project_updated:', updatedProject);
      setProjects((prev: any[]) => {
        if (!prev.some((p: any) => p.id === updatedProject.id)) return prev;
        return prev.map((p: any) => p.id === updatedProject.id ? { ...p, ...updatedProject } : p);
      });
    });

    // 3. ИЗМЕНЕНИЕ СТАТУСА
    socket.on('project_status_changed', (updatedProject) => {
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
    });

    // 4. НОВОЕ СООБЩЕНИЕ
    socket.on('new_message', (msg) => {
      console.log('🔔 [Socket Debug] Новое сообщение:', msg);
      const pId = Number(msg.projectId);
      useChatStore.getState().addMessage(pId, msg);

      setProjects((prev: any[]) => {
        const projectIndex = prev.findIndex((p: any) => p.id === pId);
        if (projectIndex === -1) return prev;

        const updatedProjects = [...prev];
        const project = { ...updatedProjects[projectIndex] };
        project.hasUnread = true;
        project.unreadCount = (project.unreadCount || 0) + 1;
        project.updatedAt = new Date().toISOString();

        updatedProjects.splice(projectIndex, 1);
        return [project, ...updatedProjects];
      });
    });

    return () => {
      if (socket) {
        console.log('🔌 [Socket Debug] Отключение сокета...');
        socket.offAny();
        socket.disconnect();
      }
    };
  }, [userId]);

  return socketRef.current;
};