import { useEffect } from 'react';
import { socket } from '../api/socket';
import { useChatStore } from '../store/useChatStore';
import { useProjectStore } from '../store/useProjectStore';

export const useGlobalChatLoader = (user: any, projects: any[]) => {
  const { addMessage, markMyMessagesAsRead } = useChatStore();
  const setProjects = useProjectStore((state) => state.setProjects);

  useEffect(() => {
    if (!user?.id || projects.length === 0) {
      console.log('[GlobalChatLoader] ⏭️ Skipping - no user or projects');
      return;
    }

    console.log('[GlobalChatLoader] 🚀 Initializing for user:', user.id);

    // Входим в личную комнату для получения событий прочтения
    socket.emit('join_self_room', user.id);

    projects.forEach(p => {
      socket.emit('join_project', { 
        projectId: p.id, 
        userId: user.id, 
        userName: user.name, 
        userRole: user.role 
      });
    });

    const handleNewMessage = (msg: any) => {
      const pId = Number(msg.projectId);
      const chatStore = useChatStore.getState();
      const isChatOpen = chatStore.activeChatId === pId;
      const isMyOwnMessage = String(msg.senderId) === String(user.id);

      let isRead = false;

      // 🛑 ИСПРАВЛЕНИЕ: Свои сообщения НЕ должны сразу помечаться как прочитанные (isRead: true).
      // Они должны оставаться isRead: false (одна галочка), пока получатель не откроет чат.
      if (!isMyOwnMessage && isChatOpen) {
        // Если сообщение ЧУЖОЕ и чат открыт -> мы его читаем прямо сейчас
        isRead = true;
      }
      // Если это мое сообщение (isMyOwnMessage = true), то isRead остается false.
      // Двойная галочка появится только после события messages_read.

      addMessage(pId, { ...msg, isRead });

      // Обновляем счетчик непрочитанных для списка проектов
      if (!isMyOwnMessage && !isChatOpen) {
        setProjects((prev: any[]) => {
          const idx = prev.findIndex(p => Number(p.id) === pId);
          if (idx === -1) return prev;
          const updated = [...prev];
          const currentUnreadCount = updated[idx].unreadCount || 0;
          updated[idx] = { 
            ...updated[idx], 
            hasUnread: true, 
            unreadCount: currentUnreadCount + 1 
          };
          return updated;
        });
      }
    };

    const handleMessagesRead = ({ projectId, readerId }: { projectId: number; readerId: number }) => {
      // Обновляем галочки только если сообщения прочитал ДРУГОЙ человек
      if (String(readerId) !== String(user.id)) {
        markMyMessagesAsRead(projectId, readerId);
        
        setProjects((prev: any[]) => {
          const idx = prev.findIndex(p => Number(p.id) === projectId);
          if (idx === -1) return prev;
          const updated = [...prev];
          updated[idx] = { ...updated[idx], hasUnread: false, unreadCount: 0 };
          return updated;
        });
      }
    };

    socket.on('new_message', handleNewMessage);
    socket.on('messages_read', handleMessagesRead);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('messages_read', handleMessagesRead);
    };
  }, [user?.id, projects.length, setProjects, addMessage, markMyMessagesAsRead]);
};