import { useState, useRef, useLayoutEffect, useEffect, useMemo } from 'react';
import { MessageSquare, X, Send, Loader2, Minus, Maximize2, Check, CheckCheck } from 'lucide-react';
import { useChatStore } from '../../../store/useChatStore';
import { useChatLogic } from '../../../hooks/useChatLogic';

export const ChatDrawer = ({ isOpen, onClose, project, user, variant = 'blue' }: any) => {
  const [newMessage, setNewMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Достаем данные из стора
  const loading = useChatStore(state => state.loading);
  const messages = useChatStore(state => state.messages);
  const getUnreadCount = useChatStore(state => state.getUnreadCount);

  // Подключаем логику. 
  // ВАЖНО: Мы передаем зависимости, чтобы хук знал, когда переподключаться.
  const { sendMessage, markAsReadFull } = useChatLogic(project?.id, user, isOpen, isMinimized);

  // Сообщения конкретно этого проекта
  const projectMessages = useMemo(() => {
    return project?.id ? messages[project.id] || [] : [];
  }, [messages, project?.id]);

  // Лог для проверки рендера
  console.log(`[ChatDrawer] Render project ${project?.id}`, { 
    isOpen, 
    isMinimized, 
    messagesCount: projectMessages.length 
  });

  // Счетчик непрочитанных
  const unreadCount = useMemo(() => {
    if (!isOpen || !isMinimized || !project?.id || !user?.id) return 0;
    return getUnreadCount(project.id, user.id);
  }, [projectMessages, isOpen, isMinimized, project?.id, user?.id, getUnreadCount]);

  // Автоскролл вниз при новых сообщениях
  useLayoutEffect(() => {
    if (scrollRef.current && !isMinimized) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [projectMessages, isMinimized]);

  // Отправка сообщения
  const onHandleSend = async () => {
    const text = newMessage.trim();
    if (!text || !project?.id) return;

    console.log("[ChatDrawer] Triggering sendMessage", text);
    setNewMessage(''); // Очищаем сразу для UI-отклика
    await sendMessage(text);
  };

  if (!isOpen || !project) return null;

  const themeClass = variant === 'blue' ? 'bg-blue-600' : 'bg-emerald-600';
  const btnClass = variant === 'blue' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700';

  return (
    <div className={`fixed right-0 z-[100] bg-white shadow-2xl transition-all duration-500 flex flex-col border-l border-slate-100
        ${isMinimized ? 'bottom-6 right-6 w-80 h-16 rounded-2xl border' : 'bottom-0 w-full max-w-lg h-full'}`}>
      
      {/* Шапка чата */}
      <div 
        className="p-4 border-b flex justify-between items-center bg-white shrink-0 cursor-pointer" 
        onClick={() => isMinimized && setIsMinimized(false)}
      >
        <div className="flex items-center gap-3">
          <div className={`relative w-10 h-10 text-white rounded-xl flex items-center justify-center shadow-lg ${themeClass}`}>
            <MessageSquare size={20} />
            {isMinimized && unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-[10px] px-1.5 py-0.5 rounded-full ring-2 ring-white font-black animate-bounce">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 leading-none">PRJ-{project.id}</h3>
            <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tight">Чат по проекту</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
            {isMinimized ? <Maximize2 size={18} /> : <Minus size={18} />}
          </button>
          <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
            <X size={20} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Область сообщений */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
            {loading && projectMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
                <Loader2 className="animate-spin" size={24} />
                <span className="text-xs font-bold uppercase tracking-widest">Загрузка...</span>
              </div>
            ) : projectMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-300">
                <MessageSquare size={48} className="mb-2 opacity-20" />
                <p className="text-xs font-bold uppercase">Сообщений пока нет</p>
              </div>
            ) : (
              projectMessages.map((msg: any, idx: number) => {
                // Принудительно приводим к строке для сравнения
                const isMe = String(msg.senderId) === String(user?.id);
                
                return (
                  <div key={msg.id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                      isMe 
                        ? `${themeClass} text-white rounded-tr-none shadow-blue-100` 
                        : 'bg-white border border-slate-100 rounded-tl-none text-slate-700'
                    }`}>
                      <p className="leading-relaxed break-words">{msg.text}</p>
                      <div className={`flex justify-end items-center gap-1 mt-1 text-[9px] font-bold ${isMe ? 'text-white/70' : 'text-slate-400'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {isMe && (
                          <span className="ml-0.5">
                            {msg.isRead ? <CheckCheck size={12}/> : <Check size={12}/>}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Поле ввода */}
          <div className="p-4 bg-white border-t shrink-0">
            <div className="flex gap-2 bg-slate-100 p-2 rounded-2xl focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
              <input 
                value={newMessage} 
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    onHandleSend();
                  }
                }}
                className="flex-1 bg-transparent px-3 outline-none text-sm font-medium text-slate-700 placeholder:text-slate-400"
                placeholder="Напишите сообщение..."
              />
              <button 
                onClick={onHandleSend} 
                disabled={!newMessage.trim()}
                className={`p-3 text-white rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 ${btnClass}`}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};