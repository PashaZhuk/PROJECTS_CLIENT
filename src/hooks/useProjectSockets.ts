import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useChatStore } from '../store/useChatStore';

const SOCKET_URL = 'http://192.168.85.110:5001';

export const useProjectSockets = (setProjects: any, userId: number | undefined) => {
  const socketRef = useRef<Socket | null>(null);

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

    // --- ЛОГИРОВАНИЕ СЛУЖЕБНЫХ СОБЫТИЙ ---
    socket.on('connect', () => {
      console.log(`✅ [Socket Debug] Подключено! ID: ${socket.id}. Для User: ${userId}`);
      
      // Проверяем, в какие комнаты заходим
      console.log(`📡 [Socket Debug] Отправка запросов на вход в комнаты: user_${userId} и admin_room`);
      socket.emit('join_self_room', { userId }); 
      socket.emit('subscribe_admin_stats'); 
    });

    socket.on('connect_error', (err) => {
      console.error('❌ [Socket Debug] Ошибка подключения:', err.message);
    });

    // ОЧЕНЬ ВАЖНО: Слушаем ВООБЩЕ ВСЕ входящие события
    socket.onAny((eventName, ...args) => {
      console.log(`🔹 [Socket Debug] Поймано любое событие: [${eventName}]`, args);
    });

    // 1. ОБРАБОТЧИК ИЗМЕНЕНИЯ СТАТУСА
    socket.on('project_status_changed', (updatedProject) => {
      console.log('🚀 [Socket Debug] ЦЕЛЕВОЕ СОБЫТИЕ: project_status_changed', updatedProject);
      
      setProjects((prev: any[]) => {
        const existingProject = prev.find(p => p.id === updatedProject.id);
        
        if (!existingProject) {
          console.warn(`⚠️ [Socket Debug] Проект ${updatedProject.id} не найден в текущем списке стейта.`);
        }

        const filtered = prev.filter(p => p.id !== updatedProject.id);
        const processed = {
          ...existingProject,
          ...updatedProject,
          unreadCount: updatedProject._count?.messages ?? existingProject?.unreadCount ?? 0,
          hasUnread: (updatedProject._count?.messages ?? existingProject?.unreadCount ?? 0) > 0
        };

        const newList = [processed, ...filtered];
        return newList.sort((a, b) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      });
    });

    // 2. ОБРАБОТЧИК НОВЫХ СООБЩЕНИЙ
    socket.on('new_message', (msg) => {
      console.log('🔔 [Socket Debug] Новое сообщение:', msg);
      const pId = Number(msg.projectId);
      useChatStore.getState().addMessage(pId, msg);

      setProjects((prev: any[]) => {
        const projectIndex = prev.findIndex(p => p.id === pId);
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
        socket.offAny(); // Снимаем дебаг-слушатель
        socket.disconnect();
      }
    };
  }, [userId, setProjects]);

  return socketRef.current;
};