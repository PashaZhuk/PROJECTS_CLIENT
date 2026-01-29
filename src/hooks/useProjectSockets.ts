import { useEffect } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://192.168.85.110:5001';

export const useProjectSockets = (setProjects: any, currentUserId: number | undefined) => {
  useEffect(() => {
    if (!currentUserId) return;

    const socket = io(SOCKET_URL, { withCredentials: true });

    // 1. Слушаем новые сообщения (увеличиваем счетчик)
    socket.on('unread_update', ({ projectId, senderId }) => {
      if (Number(senderId) !== Number(currentUserId)) {
        setProjects((prev: any[]) => 
          prev.map(p => 
            p.id === projectId 
              ? { ...p, unreadCount: (p.unreadCount || 0) + 1, hasUnread: true } 
              : p
          )
        );
      }
    });

    // 2. Слушаем прочтение (обнуляем счетчик)
    socket.on('messages_read', ({ projectId }) => {
      setProjects((prev: any[]) => 
        prev.map(p => 
          p.id === projectId 
            ? { ...p, unreadCount: 0, hasUnread: false } 
            : p
        )
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [setProjects, currentUserId]);
};