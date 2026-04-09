import { useEffect, useCallback, useRef } from 'react';
import { socket, SOCKET_URL } from '../api/socket';
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
    if (!projectId || !user?.id) {
      console.log('[useChatLogic] ❌ sendReadReceipt skipped:', { projectId, userId: user?.id });
      return;
    }
    console.log('[useChatLogic] 📡 Sending read receipt for project:', projectId);
    try {
      const response = await fetch(`${SOCKET_URL}/api/chat/${projectId}/read`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log('[useChatLogic] ✅ Read receipt response:', { status: response.status, data });
    } catch (err) {
      console.error('[ChatLogic] ❌ Send read receipt error:', err);
    }
  }, [projectId, user?.id]);

  const joinProjectRoom = useCallback(() => {
    if (!projectId || !user?.id) return;
    if (!hasJoinedRoomRef.current) {
      console.log('[useChatLogic] 🔌 Force joining project room:', `project_${projectId}`);
      socket.emit('join_project', { projectId, userId: user.id, userName: user.name, userRole: user.role });
      hasJoinedRoomRef.current = true;
    }
  }, [projectId, user?.id, user?.name, user?.role]);

  useEffect(() => {
    console.log('[useChatLogic] 🚪 Open effect triggered:', { 
      isOpen, 
      isMinimized, 
      projectId, 
      userId: user?.id,
      willMarkAsRead: isOpen && !isMinimized && projectId && user?.id
    });
    
    if (isOpen && !isMinimized && projectId && user?.id) {
      console.log('[useChatLogic] 🔴 WILL MARK MESSAGES AS READ AND SEND RECEIPT');
      joinProjectRoom();
      setActiveChatId(projectId);
      markMessagesAsReadLocally(projectId, user.id);
      sendReadReceipt();
    } else if (!isOpen || isMinimized) {
      console.log('[useChatLogic] 🟢 Clearing active chat');
      setActiveChatId(null);
      hasJoinedRoomRef.current = false;
    }
  }, [isOpen, isMinimized, projectId, user?.id, setActiveChatId, markMessagesAsReadLocally, sendReadReceipt, joinProjectRoom]);

  const sendMessage = async (text: string) => {
    console.log('[useChatLogic] 📤 sendMessage called:', { text, projectId, userId: user?.id });
    
    if (!text.trim() || !projectId || !user?.id) {
      console.log('[useChatLogic] ❌ sendMessage skipped - missing data');
      return;
    }
    
    try {
      const res = await fetch(`${SOCKET_URL}/api/chat/${projectId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ text }),
      });
      
      const savedMsg = await res.json();
      console.log('[useChatLogic] ✅ Message sent, response:', savedMsg);
      
      addMessage(projectId, { ...savedMsg, isRead: false });
      console.log('[useChatLogic] ✅ Message added with isRead: false');
      
    } catch (err) {
      console.error('[ChatLogic] ❌ Send error:', err);
    }
  };

  useEffect(() => {
    if (!projectId) return;

    console.log('[useChatLogic] 📥 Loading message history for project:', projectId);
    
    fetch(`${SOCKET_URL}/api/chat/${projectId}/messages`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        console.log('[useChatLogic] ✅ Loaded messages:', data.length);
        setMessages(projectId, data);
        if (isOpenRef.current && !isMinimizedRef.current && user?.id) {
          console.log('[useChatLogic] 🔴 Marking messages as read after load');
          markMessagesAsReadLocally(projectId, user.id);
          sendReadReceipt();
        }
      })
      .catch(console.error);
  }, [projectId, setMessages, user?.id, markMessagesAsReadLocally, sendReadReceipt]);

  useEffect(() => {
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

    console.log('[useChatLogic] 🎧 Setting up messages_read listener for project:', projectId);
    
    const handleMessagesRead = ({ projectId: readProjectId, readerId, messageIds }: { 
      projectId: number; 
      readerId: number;
      messageIds?: number[];
    }) => {
      console.log('[useChatLogic] 🔵 MESSAGES_READ EVENT RECEIVED:', { 
        readProjectId, 
        readerId, 
        currentUserId: user?.id,
        messageIds,
        isMatch: readProjectId === projectId,
        isDifferentUser: user?.id && String(readerId) !== String(user.id),
        stack: new Error().stack
      });
      
      if (readProjectId === projectId && user?.id && String(readerId) !== String(user.id)) {
        console.log('[useChatLogic] ✅ UPDATING MESSAGE READ STATUS - changing single check to double check');
        markMyMessagesAsRead(projectId, readerId);
      } else {
        console.log('[useChatLogic] ⏭️ Skipping messages_read update (same user or mismatch)');
      }
    };

    socket.on('messages_read', handleMessagesRead);

    return () => {
      console.log('[useChatLogic] 🎧 Removing messages_read listener');
      socket.off('messages_read', handleMessagesRead);
    };
  }, [projectId, user?.id, markMyMessagesAsRead]);

  return { sendMessage };
};