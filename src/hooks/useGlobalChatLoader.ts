import { useEffect } from 'react';
import { socket } from '../api/socket';
import { useChatStore } from '../store/useChatStore';

export const useGlobalChatLoader = (user: any, projects: any[]) => {
  const { addMessage } = useChatStore();

  useEffect(() => {
    if (!user?.id || projects.length === 0) return;

    console.log("🔌 [GlobalChat] Initializing global listeners for projects");

    // Подписываемся на события для всех текущих проектов
    projects.forEach(p => {
      socket.emit('join_project', { projectId: p.id, userId: user.id });
    });

    const handleNewMessage = (msg: any) => {
      console.log("🔌 [GlobalChat] Received background message:", msg);
      // Добавляем сообщение в стор. getUnreadCount в ProjectRow увидит его и покажет кружок
      addMessage(msg.projectId, { ...msg, isRead: false });
    };

    socket.on('new_message', handleNewMessage);

    return () => {
      socket.off('new_message', handleNewMessage);
    };
  }, [user?.id, projects.length]); // Переподключаемся, если список проектов изменился
};