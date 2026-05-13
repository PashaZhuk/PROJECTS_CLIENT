import { useEffect } from 'react';
import { getSocket } from '../api/socket';
import api from '../api/ky';
import { useChatStore } from '../store/useChatStore';
import { queryClient } from '../lib/queryClient';

export const useGlobalChatLoader = (user: any, projects: any[]) => {
  const { addMessage, markMyMessagesAsRead, activeChatId } = useChatStore();

  useEffect(() => {
    if (!user?.id || projects.length === 0) return;
    const socket = getSocket();
    if (!socket) return;

    socket.emit('join_self_room', user.id);
    projects.forEach(p => {
      socket.emit('join_project', { 
        projectId: p.id, 
        userId: user.id, 
        userName: user.name, 
        userRole: user.role 
      });
    });

    const updateUnreadInCache = (projectId: number, increment: boolean) => {
      queryClient.setQueriesData({ queryKey: ['projects'] }, (old: any) => {
        if (!old?.projects) return old;
        return {
          ...old,
          projects: old.projects.map((p: any) => {
            if (Number(p.id) !== projectId) return p;
            const currentUnread = p.unreadCount || 0;
            return {
              ...p,
              hasUnread: true,
              unreadCount: increment ? currentUnread + 1 : currentUnread,
            };
          }),
        };
      });
    };

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
        } catch (err) {
          console.error('[GlobalChatLoader] Failed to mark as read:', err);
        }
      }

      addMessage(pId, { ...msg, isRead });

      if (!isMyOwnMessage && !isChatOpen) {
        updateUnreadInCache(pId, true);
      }
    };

    const handleMessagesRead = ({ projectId, readerId }: { projectId: number; readerId: number }) => {
      if (String(readerId) !== String(user.id)) {
        markMyMessagesAsRead(projectId, readerId);
        queryClient.setQueriesData({ queryKey: ['projects'] }, (old: any) => {
          if (!old?.projects) return old;
          return {
            ...old,
            projects: old.projects.map((p: any) =>
              Number(p.id) === projectId
                ? { ...p, hasUnread: false, unreadCount: 0 }
                : p
            ),
          };
        });
      }
    };

    socket.on('new_message', handleNewMessage);
    socket.on('messages_read', handleMessagesRead);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('messages_read', handleMessagesRead);
    };
  }, [user?.id, projects.length, addMessage, markMyMessagesAsRead, activeChatId]);
};
