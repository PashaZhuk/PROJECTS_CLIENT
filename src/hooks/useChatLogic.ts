import { useEffect, useCallback, useRef } from 'react';
import api from '../api/ky';
import { useChatStore } from '../store/useChatStore';

export const useChatLogic = (
  projectId: number | undefined,
  user: any,
  isOpen: boolean,
  isMinimized: boolean
) => {
  const { setMessages, addMessage, markMessagesAsReadLocally, setActiveChatId, markMyMessagesAsRead, setLoading } = useChatStore();
  const isOpenRef = useRef(isOpen);
  const isMinimizedRef = useRef(isMinimized);
  const hasJoinedRoomRef = useRef(false);

  useEffect(() => {
    console.log('[useChatLogic] 🔄 State changed:', { isOpen, isMinimized, projectId, userId: user?.id });
    isOpenRef.current = isOpen;
    isMinimizedRef.current = isMinimized;
  }, [isOpen, isMinimized, projectId, user?.id]);

  const sendReadReceipt = useCallback(async () => {
    if (!projectId || !user?.id) return;
    try {
      await api.patch(`chat/${projectId}/read`, { json: {} });
      console.log('[useChatLogic] ✅ Read receipt sent');
    } catch (err) {
      console.error('[ChatLogic] ❌ Send read receipt error:', err);
    }
  }, [projectId, user?.id]);

  // В реальном сокете join_project отправляется в useGlobalChatLoader, здесь не нужно дублировать
  // Удаляем joinProjectRoom, так как это уже делается в глобальном хуке.

  useEffect(() => {
    if (isOpen && !isMinimized && projectId && user?.id) {
      setActiveChatId(projectId);
      markMessagesAsReadLocally(projectId, user.id);
      sendReadReceipt();
    } else if (!isOpen || isMinimized) {
      setActiveChatId(null);
      hasJoinedRoomRef.current = false;
    }
  }, [isOpen, isMinimized, projectId, user?.id, setActiveChatId, markMessagesAsReadLocally, sendReadReceipt]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || !projectId || !user?.id) return;
    try {
      const savedMsg = await api.post(`chat/${projectId}/messages`, { json: { text } }).json();
      // Проверяем, что savedMsg - объект
      if (savedMsg && typeof savedMsg === 'object') {
        addMessage(projectId, { ...(savedMsg as any), isRead: false });
      } else {
        console.error('[ChatLogic] Invalid response format', savedMsg);
      }
    } catch (err) {
      console.error('[ChatLogic] ❌ Send error:', err);
    }
  };

  // Загрузка сообщений при открытии или изменении projectId
  useEffect(() => {
    if (!projectId) return;
    setLoading(true);
    api.get(`chat/${projectId}/messages`).json()
      .then((data: any) => {
        const messagesArray = Array.isArray(data) ? data : [];
        setMessages(projectId, messagesArray);
        if (isOpenRef.current && !isMinimizedRef.current && user?.id) {
          markMessagesAsReadLocally(projectId, user.id);
          sendReadReceipt();
        }
      })
      .catch(err => console.error('[ChatLogic] Failed to load messages:', err))
      .finally(() => setLoading(false));
  }, [projectId, setMessages, user?.id, markMessagesAsReadLocally, sendReadReceipt, setLoading]);

  // Слушаем сокет-события (new_message, messages_read) – они уже в useGlobalChatLoader, поэтому здесь не нужны.
  // Но оставим для уверенности обработку messages_read, если требуется.
  useEffect(() => {
    // Можно добавить обработку сокетов, но полагаемся на глобальный хук.
    // Для избежания дублирования оставим пустым.
  }, []);

  return { sendMessage };
};