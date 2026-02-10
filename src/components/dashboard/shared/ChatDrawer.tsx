import { useEffect, useState, useCallback, useRef, useLayoutEffect } from 'react';
import { 
  MessageSquare, X, Send, Loader2, 
  Minus, Maximize2, Check, CheckCheck 
} from 'lucide-react';
import { io, Socket } from 'socket.io-client';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  project: any;
  user: any;
  variant?: 'blue' | 'emerald';
  onMessagesRead?: (projectId: number) => void;
}

const SOCKET_URL = 'http://192.168.85.110:5001';

export const ChatDrawer = ({
  isOpen, onClose, project, user, variant = 'blue', onMessagesRead 
}: ChatDrawerProps) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  // НОВЫЙ ФЛАГ: Принудительно скрывает уведомления, когда чат в фокусе
  const [forceHideBadge, setForceHideBadge] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const isBlue = variant === 'blue';
  const themeClass = isBlue ? 'bg-blue-600 shadow-blue-100' : 'bg-emerald-600 shadow-emerald-100';
  const accentText = isBlue ? 'text-blue-600' : 'text-emerald-600';
  const btnClass = isBlue ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700';

  // Улучшенный подсчет: если forceHideBadge активен — всегда 0
  const unreadCount = (forceHideBadge || isMinimized === false && isOpen)
    ? 0 
    : messages.filter(msg => !msg.isSystem && msg.senderId !== user?.id && !msg.isRead).length;

  const markAsRead = useCallback(async () => {
    if (!project?.id || !isOpen || isMinimized) return;
    
    // 1. Мгновенно выключаем кружок визуально
    setForceHideBadge(true);
    
    try {
      // 2. Локально помечаем все сообщения прочитанными
      setMessages(prev => prev.map(m => m.isSystem ? m : { ...m, isRead: true }));

      const response = await fetch(`${SOCKET_URL}/api/chat/${project.id}/read`, {
        method: 'PATCH',
        credentials: 'include'
      });
      
      if (response.ok && onMessagesRead) {
        onMessagesRead(project.id);
      }
    } catch (err) {
      console.error("Ошибка при сбросе статуса прочитано:", err);
    }
  }, [project?.id, isOpen, isMinimized, onMessagesRead]);

  const fetchMessages = useCallback(async (showLoader = false) => {
    if (!project?.id) return;
    if (showLoader) setIsLoading(true);
    try {
      const response = await fetch(`${SOCKET_URL}/api/chat/${project.id}/messages`, { 
        credentials: 'include' 
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
        // Если при загрузке чат уже открыт — сразу гасим флаг
        if (isOpen && !isMinimized) setForceHideBadge(true);
      }
    } catch (err) {
      console.error("Ошибка загрузки чата:", err);
    } finally {
      setIsLoading(false);
    }
  }, [project?.id, isOpen, isMinimized]);

  useEffect(() => {
    if (isOpen && project?.id && user) {
      fetchMessages(true);
      markAsRead();

      const socket = io(SOCKET_URL, { withCredentials: true });
      socketRef.current = socket;

      socket.emit('join_project', { 
        projectId: project.id, 
        userName: user.name, 
        userRole: user.role 
      });

      socket.on('new_message', (msg) => {
        setMessages(prev => {
          if (prev.some(m => m.id === msg.id)) return prev;
          const shouldMarkRead = !isMinimized;
          return [...prev, { ...msg, isRead: shouldMarkRead }];
        });

        if (!isMinimized) {
          setForceHideBadge(true);
          markAsRead();
        }
      });

      socket.on('system_message', (sysMsg) => {
        setMessages(prev => [...prev, { ...sysMsg, isSystem: true, id: Date.now() }]);
      });

      socket.on('messages_read', ({ readerId }) => {
        if (readerId !== user?.id) {
          setMessages(prev => prev.map(m => m.isSystem ? m : ({ ...m, isRead: true })));
        }
      });

      return () => { socket.disconnect(); };
    } else {
      setMessages([]);
      setIsMinimized(false);
      setForceHideBadge(false);
    }
  }, [isOpen, project?.id, isMinimized, user, markAsRead, fetchMessages]);

  // Следим за минимизацией: если развернули — гасим кружок
  useEffect(() => {
    if (!isMinimized && isOpen) {
      setForceHideBadge(true);
      markAsRead();
    } else {
      setForceHideBadge(false);
    }
  }, [isMinimized, isOpen, markAsRead]);

  useLayoutEffect(() => {
    if (scrollRef.current && !isMinimized) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isMinimized]);

  const handleSend = async () => {
    if (!newMessage.trim() || !project?.id) return;
    const textToSend = newMessage;
    setNewMessage(''); 
    try {
      const response = await fetch(`${SOCKET_URL}/api/chat/${project.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ text: textToSend }),
      });
      
      if (response.ok) {
        const savedMsg = await response.json();
        setMessages(prev => {
          if (prev.some(m => m.id === savedMsg.id)) return prev;
          return [...prev, savedMsg];
        });
      }
    } catch (err) {
      console.error("Ошибка отправки:", err);
    }
  };

  if (!isOpen || !project) return null;

  return (
    <>
      {!isMinimized && (
        <div 
          className="fixed inset-0 z-100 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300 cursor-pointer" 
          onClick={() => setIsMinimized(true)} 
        />
      )}
      
      <div 
        className={`fixed right-0 z-101 bg-white shadow-2xl transition-all duration-500 flex flex-col border-l border-slate-100
          ${isMinimized 
            ? 'bottom-6 right-6 w-80 h-16 rounded-2xl border hover:border-blue-400' 
            : 'bottom-0 w-full max-w-lg h-full'}`}
      >
        {/* Header */}
        <div 
          className={`p-4 border-b flex justify-between items-center bg-white shrink-0 ${isMinimized ? 'cursor-pointer rounded-2xl' : ''}`}
          onClick={() => isMinimized && setIsMinimized(false)}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className={`w-10 h-10 text-white rounded-xl flex items-center justify-center shadow-lg ${themeClass}`}>
                <MessageSquare size={20} />
              </div>
              {/* Кружок уведомлений */}
              {unreadCount > 0 && (
                <div className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white ring-2 ring-white animate-bounce shadow-sm">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </div>
              )}
            </div>
            <div className="overflow-hidden">
              <h3 className="text-sm font-black text-slate-900 truncate">PRJ-{project.id}</h3>
              {!isMinimized && (
                <p className={`text-[10px] font-black uppercase tracking-widest truncate ${accentText}`}>
                  {project.customerName}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }} className="p-2 hover:bg-slate-100 rounded-lg transition-all text-slate-400 hover:text-slate-900">
              {isMinimized ? <Maximize2 size={18} /> : <Minus size={18} />}
            </button>
            <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="p-2 hover:bg-red-50 rounded-lg transition-all text-slate-400 hover:text-red-500">
              <X size={20} />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30 scroll-smooth">
              {isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <Loader2 className={`animate-spin ${accentText}`} size={32} />
                </div>
              ) : messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-300 text-center p-10">
                  <MessageSquare size={48} className="mb-4 opacity-10" />
                  <p className="text-xs font-bold uppercase tracking-widest">Сообщений пока нет</p>
                </div>
              ) : (
                messages.map((msg, idx) => {
                  if (msg.isSystem) {
                    return (
                      <div key={msg.id || idx} className="flex justify-center my-2">
                        <div className="bg-slate-200/50 px-4 py-1 rounded-full border border-white shadow-sm">
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest text-center">
                            {msg.text}
                          </p>
                        </div>
                      </div>
                    );
                  }

                  const isMe = msg.senderId === user?.id;
                  const displayName = msg.sender?.name || msg.senderName || 'Пользователь';
                  
                  return (
                    <div key={msg.id || idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      {!isMe && (
                        <div className="flex items-center gap-2 mb-1.5 px-1">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                            {displayName}
                          </span>
                        </div>
                      )}

                      <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm shadow-sm transition-all ${
                        isMe ? `${themeClass} text-white rounded-tr-none` : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                      }`}>
                        <p className="leading-relaxed whitespace-pre-wrap font-medium">{msg.text}</p>
                        <div className={`flex items-center gap-1 justify-end mt-1.5 ${isMe ? 'opacity-70' : 'opacity-40'}`}>
                          <span className="text-[9px] font-bold uppercase tracking-tighter">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {isMe && (
                            <span className="ml-0.5">
                              {msg.isRead ? <CheckCheck size={13} className="text-white" /> : <Check size={13} className="text-white/70" />}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-6 bg-white border-t shrink-0">
              <div className="relative flex items-center gap-3 bg-slate-100 p-2 rounded-2xl focus-within:ring-2 focus-within:ring-blue-500/10 transition-all">
                <input 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder="Напишите сообщение..."
                  maxLength={3000}
                  className="w-full pl-4 py-3 bg-transparent border-none outline-none text-sm font-semibold text-slate-700 placeholder:text-slate-400"
                />
                <button 
                  onClick={handleSend} 
                  disabled={!newMessage.trim()} 
                  className={`p-3.5 text-white rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:grayscale shrink-0 ${btnClass}`}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};