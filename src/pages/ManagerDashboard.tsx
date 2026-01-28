import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  LayoutDashboard, ClipboardList, ShoppingCart, LogOut, 
  Search, MessageSquare, Send, X, ChevronUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Импорт общих компонентов
import { StatsView } from '../components/dashboard/StatsView';
import { ProjectsListView } from '../components/dashboard/ProjectsListView';

const ManagerDashboard = () => {
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'stats' | 'projects' | 'orders'>('projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedProjectId, setExpandedProjectId] = useState<number | null>(null);
  
  // Состояния чата
  const [chatProject, setChatProject] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchAllProjects = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('http://192.168.85.110:5001/api/projects', { credentials: 'include' });
      const data = await response.json();
      setProjects(data);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAllProjects(); }, [fetchAllProjects]);

  // Авто-скролл чата
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, chatProject]);

  const updateProjectStatus = async (projectId: number, newStatus: 'APPROVED' | 'REJECTED'| 'PENDING') => {
  try {
    const response = await fetch(`http://192.168.85.110:5001/api/projects/${projectId}/status`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        // Мы НЕ добавляем Authorization вручную, 
        // так как браузер сам отправит куку 'jwt'
      },
      // ВАЖНО: Разрешает браузеру отправлять куки на другой адрес/порт
      credentials: 'include', 
      body: JSON.stringify({ status: newStatus }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Ошибка при обновлении статуса');
    }

    // Обновляем UI только если в БД все сохранилось
    setProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, status: newStatus } : p
    ));

  } catch (err: any) {
    console.error("Ошибка:", err.message);
    alert(`Не удалось обновить: ${err.message}`);
  }
};

  const filteredProjects = useMemo(() => {
    const search = searchQuery.toLowerCase();
    return projects.filter(p => 
      (p.partner?.name || '').toLowerCase().includes(search) || 
      (p.customerName || '').toLowerCase().includes(search) || 
      p.id.toString().includes(search)
    );
  }, [projects, searchQuery]);

  const stats = useMemo(() => ({
    pending: projects.filter(p => p.status === 'PENDING').length,
    approved: projects.filter(p => p.status === 'APPROVED').length,
    total: projects.length
  }), [projects]);

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans text-slate-900">
      
      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 z-20">
        <div className="p-8">
          <div className="flex items-center gap-3 text-emerald-600">
            <div className="w-11 h-11 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-emerald-100">M</div>
            <div className="flex flex-col">
              <span className="text-slate-900 font-black text-lg leading-tight">Manager<span className="text-emerald-600">Hub</span></span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Global Admin</span>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <NavBtn active={activeTab === 'stats'} onClick={() => setActiveTab('stats')} icon={<LayoutDashboard size={20}/>} label="Обзор" />
          <NavBtn active={activeTab === 'projects'} onClick={() => setActiveTab('projects')} icon={<ClipboardList size={20}/>} label="Проекты" />
          <NavBtn active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} icon={<ShoppingCart size={20}/>} label="Заказы" />
        </nav>
        <div className="p-6 border-t border-slate-100">
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-4 text-slate-400 hover:text-red-500 font-bold text-sm transition-colors">
            <LogOut size={20} /> Выход
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-10 shrink-0">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Поиск по партнеру или ID..." 
              className="w-full pl-12 pr-4 py-3.5 bg-slate-100 rounded-2xl outline-none text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-black text-slate-900">{user?.name}</p>
              <p className="text-[10px] text-emerald-600 font-black uppercase">Manager Account</p>
            </div>
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black shadow-xl">{user?.name?.[0]}</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-10 bg-[#F8FAFC]">
          {activeTab === 'stats' && (
            <StatsView 
              stats={stats} 
              onRefresh={fetchAllProjects} 
              isLoading={loading} 
              title="Панель Управления"
            />
          )}

          {activeTab === 'projects' && (
            <ProjectsListView
              projects={filteredProjects}
              isLoading={loading}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              expandedId={expandedProjectId}
              setExpandedId={setExpandedProjectId}
              isAdminView={true} // Этот флаг включит кнопки управления в ProjectRow
              onStatusUpdate={updateProjectStatus}
              onOpenChat={(p: any) => setChatProject(p)}
            />
          )}
        </main>

        {/* ЧАТ ПЕРЕНЕСЕН В ОТДЕЛЬНЫЙ ФАЙЛ ИЛИ ОСТАВЛЕН ТУТ ДЛЯ КОМПАКТНОСТИ */}
        <ChatWindow 
          chatProject={chatProject} 
          setChatProject={setChatProject}
          messages={messages}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          isMinimized={isChatMinimized}
          setIsMinimized={setIsChatMinimized}
          scrollRef={scrollRef}
          user={user}
        />
      </div>
    </div>
  );
};

// --- Вспомогательные компоненты ---

const NavBtn = ({ active, onClick, icon, label }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all group ${active ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 font-bold' : 'text-slate-500 hover:bg-slate-50'}`}>
    <span className={active ? 'text-white' : 'text-slate-400 group-hover:text-emerald-500 transition-colors'}>{icon}</span>
    <span className="text-sm tracking-tight">{label}</span>
  </button>
);

// Компонент чата (логику можно оставить здесь, так как она уникальна для менеджера)
const ChatWindow = ({ chatProject, setChatProject, messages, newMessage, setNewMessage, isMinimized, setIsMinimized, scrollRef, user }: any) => {
  if (!chatProject) return null;

  if (isMinimized) {
    return (
      <button 
        onClick={() => setIsMinimized(false)}
        className="fixed right-0 top-1/2 -translate-y-1/2 bg-slate-900 text-white p-4 rounded-l-3xl shadow-2xl hover:bg-emerald-600 transition-all duration-300 z-[60] flex flex-col items-center gap-3 border-y border-l border-white/10"
      >
        <MessageSquare size={24} />
        <span className="[writing-mode:vertical-lr] rotate-180 text-[10px] font-black uppercase tracking-[0.2em] py-2">
          Чат: PRJ-{chatProject.id}
        </span>
      </button>
    );
  }

  return (
    <div className="absolute inset-0 bg-slate-900/5 z-50 flex justify-end">
      <div className="w-[450px] bg-white h-full shadow-[-30px_0_60px_rgba(0,0,0,0.12)] flex flex-col animate-in slide-in-from-right duration-300 border-l border-slate-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-black">
              {chatProject.partner?.name?.[0] || 'P'}
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">Чат с партнером</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase truncate max-w-[150px]">{chatProject.partner?.name}</p>
            </div>
          </div>
          <div className="flex gap-1">
            <button onClick={() => setIsMinimized(true)} className="p-2 hover:bg-slate-100 rounded-lg transition-all"><ChevronUp className="rotate-90" size={20}/></button>
            <button onClick={() => setChatProject(null)} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all"><X size={20}/></button>
          </div>
        </div>
        
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg: any, idx: number) => (
            <div key={idx} className={`flex flex-col ${msg.senderId === user?.id ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.senderId === user?.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 border border-slate-200'}`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 border-t">
          <div className="relative flex items-center">
            <input 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Введите сообщение..."
              className="w-full pl-4 pr-12 py-3 bg-slate-50 border rounded-xl outline-none focus:border-emerald-500 transition-all text-sm"
            />
            <button className="absolute right-2 p-2 bg-emerald-600 text-white rounded-lg shadow-md hover:bg-emerald-700"><Send size={16}/></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;