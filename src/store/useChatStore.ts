import { create } from 'zustand';
import { useProjectStore } from './useProjectStore';

interface Message {
  id: number;
  projectId: number;
  senderId: string | number;
  text: string;
  isRead: boolean;
  createdAt: string;
}

interface ChatStore {
  messages: Record<number, Message[]>;
  activeChatId: number | null;
  setActiveChatId: (id: number | null) => void;
  setMessages: (projectId: number, messages: Message[]) => void;
  addMessage: (projectId: number, message: Message) => void;
  markMessagesAsReadLocally: (projectId: number, currentUserId: string | number) => void;
  markMyMessagesAsRead: (projectId: number, readerId: string | number) => void;
  getUnreadCount: (projectId: number, userId: string | number | undefined) => number;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: {},
  activeChatId: null,

  setActiveChatId: (id) => set({ activeChatId: id }),

  setMessages: (projectId, msgs) => {
    set((state) => ({
      messages: { ...state.messages, [projectId]: msgs }
    }));
  },

  addMessage: (projectId, message) => {
    set((state) => {
      const prev = state.messages[projectId] || [];
      if (prev.some(m => m.id === message.id)) return state;
      return { messages: { ...state.messages, [projectId]: [...prev, message] } };
    });
  },

  markMessagesAsReadLocally: (projectId, currentUserId) => {
    if (!currentUserId) return;
    const pId = Number(projectId);

    // Сбрасываем счетчик непрочитанных в списке проектов
    useProjectStore.getState().setProjects((prev) => 
      prev.map(p => Number(p.id) === pId ? { ...p, unreadCount: 0, hasUnread: false } : p)
    );

    set((state) => {
      const msgs = state.messages[pId];
      if (!msgs) return state;

      const updated = msgs.map(m => 
        String(m.senderId) !== String(currentUserId) && !m.isRead ? { ...m, isRead: true } : m
      );

      return { messages: { ...state.messages, [pId]: updated } };
    });
  },

  // Вызывается когда СОБЕСЕДНИК прочитал сообщения. readerId = тот, кто открыл чат.
  markMyMessagesAsRead: (projectId, readerId) => {
    if (!readerId) return;
    const pId = Number(projectId);

    set((state) => {
      const msgs = state.messages[pId];
      if (!msgs) return state;

      // Если отправитель НЕ тот, кто прочитал -> значит это моё сообщение
      const updated = msgs.map(m => 
        String(m.senderId) !== String(readerId) && !m.isRead ? { ...m, isRead: true } : m
      );

      return { messages: { ...state.messages, [pId]: updated } };
    });
  },

  getUnreadCount: (projectId, userId) => {
    if (!userId) return 0;
    const msgs = get().messages[projectId] || [];
    return msgs.filter(m => !m.isRead && String(m.senderId) !== String(userId)).length;
  }
}));