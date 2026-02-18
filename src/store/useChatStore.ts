import { create } from 'zustand';

interface Message {
  id: number;
  projectId: number;
  senderId: string | number; // Исправлено: может быть и строка, и число
  text: string;
  isRead: boolean;
  isSystem?: boolean;
  createdAt: string;
}

interface ChatStore {
  messages: Record<number, Message[]>;
  loading: boolean;
  setMessages: (projectId: number, messages: Message[]) => void;
  addMessage: (projectId: number, message: Message) => void;
  setLoading: (val: boolean) => void;
  markMessagesAsReadLocally: (projectId: number, currentUserId: string | number) => void;
  getUnreadCount: (projectId: number, userId: string | number | undefined) => number;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: {},
  loading: false,

  // Установка истории сообщений
  setMessages: (projectId, msgs) => {
    set((state) => ({
      messages: { ...state.messages, [projectId]: msgs }
    }));
  },

  // Добавление одного нового сообщения (от сокета)
  addMessage: (projectId, message) => set((state) => {
    const prev = state.messages[projectId] || [];
    
    // Проверка на дубликаты по id
    if (prev.some(m => m.id === message.id)) return state;
    
    console.log(`[ChatStore] Новое сообщение в проекте ${projectId}:`, message);
    
    return {
      messages: { ...state.messages, [projectId]: [...prev, message] }
    };
  }),

  setLoading: (val) => set({ loading: val }),

  // Помечаем как прочитанные локально (чтобы кружок исчез сразу, не дожидаясь ответа сервера)
  markMessagesAsReadLocally: (projectId, currentUserId) => set((state) => {
    const msgs = state.messages[projectId];
    if (!msgs) return state;

    console.log(`[ChatStore] Помечаем сообщения проекта ${projectId} как прочитанные`);

    return {
      messages: {
        ...state.messages,
        [projectId]: msgs.map(m => 
          String(m.senderId) !== String(currentUserId) ? { ...m, isRead: true } : m
        )
      }
    };
  }),

  // ГЛАВНАЯ ФУНКЦИЯ ДЛЯ КРАСНОГО КРУЖКА
  getUnreadCount: (projectId, userId) => {
    if (!userId) return 0;
    
    const msgs = get().messages[projectId] || [];
    
    // Фильтруем: 
    // 1. Не системное
    // 2. Отправлено НЕ мной (сравниваем через String)
    // 3. Статус isRead === false
    const unread = msgs.filter(m => 
      !m.isSystem && 
      String(m.senderId) !== String(userId) && 
      m.isRead === false
    );

    if (unread.length > 0) {
        console.log(`[ChatStore] Проект ${projectId}: ${unread.length} непрочитанных`);
    }

    return unread.length;
  }
}));