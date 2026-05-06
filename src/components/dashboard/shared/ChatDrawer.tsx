import { useState, useRef, useLayoutEffect, useMemo } from 'react';
import { MessageSquare, X, Send, Loader2, Minus, Maximize2, Check, CheckCheck } from 'lucide-react';
import { useChatStore } from '../../../store/useChatStore';
import { useChatLogic } from '../../../hooks/useChatLogic';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  project: any;
  user: any;
  variant?: 'blue' | 'emerald';
}

export const ChatDrawer = ({ 
  isOpen, 
  onClose, 
  project, 
  user, 
  variant = 'blue'
}: ChatDrawerProps) => {
  const [newMessage, setNewMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const loading = useChatStore(state => state.loading);
  const messages = useChatStore(state => state.messages);

  const { sendMessage } = useChatLogic(
    project?.id, 
    user, 
    isOpen, 
    isMinimized
  );

  // Мемоизируем сообщения конкретного проекта, гарантируя массив
  const projectMessages = useMemo(() => {
    const msgs = project?.id ? messages[project.id] : undefined;
    return Array.isArray(msgs) ? msgs : [];
  }, [messages, project?.id]);

  // Автопрокрутка вниз при новых сообщениях или открытии
  useLayoutEffect(() => {
    if (scrollRef.current && !isMinimized) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [projectMessages, isOpen, isMinimized]);

  if (!isOpen) return null;

  const onHandleSend = () => {
    if (!newMessage.trim()) return;
    sendMessage(newMessage);
    setNewMessage('');
  };

  const btnClass = variant === 'emerald' 
    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' 
    : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200';

  const headerClass = variant === 'emerald' ? 'bg-emerald-600' : 'bg-blue-600';

  return (
    <div 
      className={`fixed bottom-0 right-4 z-50 w-full max-w-[400px] transition-all duration-300 transform ${
        isMinimized ? 'translate-y-[calc(100%-56px)]' : 'translate-y-0'
      }`}
    >
      <div className="bg-white rounded-t-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[600px]">
        
        {/* Шапка чата */}
        <div 
          className={`${headerClass} p-4 text-white flex items-center justify-between cursor-pointer shrink-0 transition-colors`}
          onClick={() => isMinimized && setIsMinimized(false)}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <MessageSquare size={20} />
            </div>
            <div className="overflow-hidden">
              <h3 className="font-bold text-sm leading-tight">Чат по проекту</h3>
              <p className="text-[10px] opacity-80 truncate max-w-[180px]">
                {project?.name || project?.customerName || 'Загрузка...'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }} 
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title={isMinimized ? "Развернуть" : "Свернуть"}
            >
              {isMinimized ? <Maximize2 size={18} /> : <Minus size={18} />}
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onClose(); }} 
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Закрыть"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Тело чата */}
        <div 
          ref={scrollRef} 
          className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 scroll-smooth"
        >
          {loading && projectMessages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="animate-spin text-slate-300" size={32} />
            </div>
          ) : projectMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
              <div className="p-4 bg-slate-100 rounded-full">
                <MessageSquare size={32} className="opacity-20" />
              </div>
              <p className="text-xs font-medium uppercase tracking-wider">История пуста</p>
            </div>
          ) : (
            projectMessages.map((msg: any) => {
              const isMe = String(msg.senderId) === String(user?.id);
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2 shadow-sm ${
                    isMe 
                      ? `${headerClass} text-white rounded-tr-none shadow-blue-100` 
                      : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none shadow-sm'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                      {msg.text}
                    </p>
                    <div className={`flex items-center gap-1.5 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <span className={`text-[10px] font-medium ${isMe ? 'text-white/70' : 'text-slate-400'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isMe && (
                        <span className="text-white/80">
                          {msg.isRead ? (
                            <CheckCheck size={13} className="inline-block" />
                          ) : (
                            <Check size={13} className="inline-block" />
                          )}
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
          <div className="flex gap-2 bg-slate-100 p-2 rounded-2xl focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500/20 transition-all border border-transparent focus-within:bg-white focus-within:border-slate-200">
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
              placeholder="Введите сообщение..."
            />
            <button 
              onClick={onHandleSend} 
              disabled={!newMessage.trim()}
              className={`p-3 text-white rounded-xl transition-all active:scale-95 disabled:opacity-40 disabled:active:scale-100 shadow-lg ${btnClass}`}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};