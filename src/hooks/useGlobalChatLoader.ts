import { useEffect } from 'react';
import { getSocket } from '../api/socket';
import api from '../api/ky';
import { useChatStore } from '../store/useChatStore';
import { useProjectStore } from '../store/useProjectStore';

export const useGlobalChatLoader = (user: any, projects: any[]) => {
  const { addMessage, markMyMessagesAsRead, activeChatId } = useChatStore();
  const setProjects = useProjectStore((state) => state.setProjects);

  useEffect(() => {
    if (!user?.id || projects.length === 0) return;

    const socket = getSocket();
    if (!socket) {
      console.warn('[GlobalChatLoader] Socket not initialized');
      return;
    }

    console.log('[GlobalChatLoader] 🚀 Initializing for user:', user.id);
    socket.emit('join_self_room', user.id);

    projects.forEach(p => {
      socket.emit('join_project', { 
        projectId: p.id, 
        userId: user.id, 
        userName: user.name, 
        userRole: user.role 
      });
    });

    const handleNewMessage = async (msg: any) => {
      const pId = Number(msg.projectId);
      const chatStore = useChatStore.getState();
      const isChatOpen = chatStore.activeChatId === pId;
      const isMyOwnMessage = String(msg.senderId) === String(user.id);

      let isRead = false;
      if (!isMyOwnMessage && isChatOpen) {
        isRead = true;
        try {
          await api.patch(`chat/${pId}/read`, { json: {} });
          console.log(`[GlobalChatLoader] Marked messages as read for project ${pId}`);
        } catch (err) {
          console.error('[GlobalChatLoader] Failed to mark as read:', err);
        }
      }

      addMessage(pId, { ...msg, isRead });

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
  }, [user?.id, projects.length, setProjects, addMessage, markMyMessagesAsRead, activeChatId]);
};