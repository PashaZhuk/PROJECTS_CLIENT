import { useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useChatStore } from '../store/useChatStore';

const SOCKET_URL = 'http://192.168.85.110:5001';

export const useChatLogic = (projectId: number | undefined, user: any, isOpen: boolean, isMinimized: boolean) => {
  const { setMessages, addMessage, markMessagesAsReadLocally } = useChatStore();
  const socketRef = useRef<Socket | null>(null);

  // Функция для отметки сообщений прочитанными на бэкенде
  const markAsReadFull = useCallback(async () => {
    if (!projectId || !user?.id) return;
    try {
      console.log(`[ChatLogic] Marking project ${projectId} as read...`);
      // 1. Сначала обновляем в сторе, чтобы кружок исчез мгновенно (Optimistic UI)
      markMessagesAsReadLocally(projectId, user.id);
      
      // 2. Затем уведомляем сервер
      await fetch(`${SOCKET_URL}/api/chat/${projectId}/read`, { 
        method: 'PATCH', 
        credentials: 'include' 
      });
    } catch (err) {
      console.error("[ChatLogic] Read error:", err);
    }
  }, [projectId, user?.id, markMessagesAsReadLocally]);

  // Эффект для автоматического прочтения, когда окно чата активно
  useEffect(() => {
    if (isOpen && !isMinimized && projectId) {
      markAsReadFull();
    }
  }, [isOpen, isMinimized, projectId, markAsReadFull]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || !projectId || !user?.id) return;
    
    try {
      console.log("[ChatLogic] Sending message...");
      const res = await fetch(`${SOCKET_URL}/api/chat/${projectId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ text }),
      });
      const savedMsg = await res.json();
      
      // Добавляем свое сообщение в стор как прочитанное (isRead: true)
      addMessage(projectId, { ...savedMsg, isRead: true });
    } catch (err) {
      console.error("[ChatLogic] Send error:", err);
    }
  };

  useEffect(() => {
    // Подключаемся всегда, когда есть projectId, чтобы ловить сообщения в фоне
    if (!projectId || !user?.id) return;

    console.log(`[ChatLogic] Initializing socket for project ${projectId}`);

    const socket = io(SOCKET_URL, { 
      withCredentials: true,
      transports: ['websocket', 'polling']
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log("🔌 [Socket] Connected:", socket.id);
      socket.emit('join_project', { projectId, userId: user.id });
    });

    socket.on('new_message', (msg) => {
      console.log("🔌 [Socket] New message received:", msg);
      
      // Если окно открыто и не свернуто — сообщение считается прочитанным сразу
      const isReadNow = isOpen && !isMinimized;
      
      // Добавляем в стор
      addMessage(projectId, { ...msg, isRead: isReadNow });
      
      // Если мы в чате прямо сейчас — отправляем на бэк подтверждение прочтения
      if (isReadNow && String(msg.senderId) !== String(user.id)) {
        markAsReadFull();
      }
    });

    // Загрузка истории
    fetch(`${SOCKET_URL}/api/chat/${projectId}/messages`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setMessages(projectId, data);
        // Если открыли чат — сразу читаем историю
        if (isOpen && !isMinimized) markAsReadFull();
      })
      .catch(err => console.error("[ChatLogic] History load error:", err));

    return () => {
      console.log(`[ChatLogic] Cleaning up project ${projectId}`);
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, user?.id]); 
  // Зависимость только от ID проекта и юзера. 
  // Мы НЕ добавляем isOpen в зависимости, чтобы сокет не переподключался при каждом открытии окна.

  return { sendMessage, markAsReadFull };
};