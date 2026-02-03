import { useEffect } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://192.168.85.110:5001';

export const useProjectSockets = (setProjects: any, currentUserId: number | undefined) => {
  useEffect(() => {
    if (!currentUserId) return;

    const socket = io(SOCKET_URL, { 
      withCredentials: true,
      transports: ['websocket', 'polling'] 
    });

    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
      
      // 1. Вступаем в личную комнату (обязательно для партнеров!)
      socket.emit('join_self_room', currentUserId);

      // 2. Вступаем в комнату админов (если нужно для менеджеров)
      socket.emit('subscribe_admin_stats');
    });

    // СТАТУСЫ: Слушаем изменение статуса проекта
    socket.on('project_status_changed', (updatedProject) => {
      console.log('📡 Сокет: статус проекта изменен', updatedProject);
      setProjects((prev: any[]) => 
        prev.map(p => 
          // Используем Number для надежного сравнения (избегаем ошибок string vs number)
          Number(p.id) === Number(updatedProject.id) 
            ? { ...p, ...updatedProject } 
            : p
        )
      );
    });

    // СТАТИСТИКА: Обновление общих цифр (для ManagerDashboard)
    socket.on('stats_updated', (stats) => {
      console.log('📊 Сокет: статистика обновлена', stats);
    });

    // СООБЩЕНИЯ: Новые входящие сообщения (счетчик)
    socket.on('unread_update', ({ projectId, senderId }) => {
      if (Number(senderId) !== Number(currentUserId)) {
        setProjects((prev: any[]) => 
          prev.map(p => 
            Number(p.id) === Number(projectId) 
              ? { ...p, unreadCount: (p.unreadCount || 0) + 1, hasUnread: true } 
              : p
          )
        );
      }
    });

    // ПРОЧТЕНИЕ: Обнуление счетчика при открытии чата
    socket.on('messages_read', ({ projectId }) => {
      setProjects((prev: any[]) => 
        prev.map(p => 
          Number(p.id) === Number(projectId) 
            ? { ...p, unreadCount: 0, hasUnread: false } 
            : p
        )
      );
    });

    // Дебаг подписки (из нашего нового server.ts)
    socket.on('subscription_confirmed', (data) => {
      console.log(`✅ Подтверждена подписка на: ${data.room}`);
    });

    return () => {
      socket.emit('unsubscribe_admin_stats');
      socket.disconnect();
    };
  }, [setProjects, currentUserId]);
};