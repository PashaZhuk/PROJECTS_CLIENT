import { useEffect, useCallback, useRef } from 'react';
import { getSocket, SOCKET_URL } from '../api/socket';
import { useChatStore } from '../store/useChatStore';

export const useChatLogic = (
  projectId: number | undefined,
  user: any,
  isOpen: boolean,
  isMinimized: boolean
) => {
  const { setMessages, addMessage, markMessagesAsReadLocally, setActiveChatId, markMyMessagesAsRead } = useChatStore();
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
      const response = await fetch(`${SOCKET_URL}/api/chat/${projectId}/read`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      console.log('[useChatLogic] ✅ Read receipt response:', { status: response.status, data });
    } catch (err) {
      console.error('[ChatLogic] ❌ Send read receipt error:', err);
    }
  }, [projectId, user?.id]);

  const joinProjectRoom = useCallback(() => {
    const socket = getSocket();
    if (!projectId || !user?.id || !socket) return;
    if (!hasJoinedRoomRef.current) {
      socket.emit('join_project', { projectId, userId: user.id, userName: user.name, userRole: user.role });
      hasJoinedRoomRef.current = true;
    }
  }, [projectId, user?.id, user?.name, user?.role]);

  useEffect(() => {
    if (isOpen && !isMinimized && projectId && user?.id) {
      joinProjectRoom();
      setActiveChatId(projectId);
      markMessagesAsReadLocally(projectId, user.id);
      sendReadReceipt();
    } else if (!isOpen || isMinimized) {
      setActiveChatId(null);
      hasJoinedRoomRef.current = false;
    }
  }, [isOpen, isMinimized, projectId, user?.id, setActiveChatId, markMessagesAsReadLocally, sendReadReceipt, joinProjectRoom]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || !projectId || !user?.id) return;
    try {
      const res = await fetch(`${SOCKET_URL}/api/chat/${projectId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ text }),
      });
      const savedMsg = await res.json();
      addMessage(projectId, { ...savedMsg, isRead: false });
    } catch (err) {
      console.error('[ChatLogic] ❌ Send error:', err);
    }
  };

  useEffect(() => {
    if (!projectId) return;
    fetch(`${SOCKET_URL}/api/chat/${projectId}/messages`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setMessages(projectId, data);
        if (isOpenRef.current && !isMinimizedRef.current && user?.id) {
          markMessagesAsReadLocally(projectId, user.id);
          sendReadReceipt();
        }
      })
      .catch(console.error);
  }, [projectId, setMessages, user?.id, markMessagesAsReadLocally, sendReadReceipt]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    const logAllEvents = (event: string, ...args: any[]) => {
      console.log('[useChatLogic] 📡 RAW SOCKET EVENT:', event, args);
    };
    socket.onAny(logAllEvents);
    return () => {
      socket.offAny(logAllEvents);
    };
  }, []);

  useEffect(() => {
    if (!projectId) return;
    const socket = getSocket();
    if (!socket) return;
    const handleMessagesRead = ({ projectId: readProjectId, readerId, messageIds }: { 
      projectId: number; 
      readerId: number;
      messageIds?: number[];
    }) => {
      if (readProjectId === projectId && user?.id && String(readerId) !== String(user.id)) {
        markMyMessagesAsRead(projectId, readerId);
      }
    };
    socket.on('messages_read', handleMessagesRead);
    return () => {
      socket.off('messages_read', handleMessagesRead);
    };
  }, [projectId, user?.id, markMyMessagesAsRead]);

  return { sendMessage };
};