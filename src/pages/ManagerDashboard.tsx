import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  LayoutDashboard, ClipboardList, ShoppingCart, Search, LogOut, 
  User as UserIcon, CheckCircle, XCircle, TrendingUp, Clock, 
  RefreshCw, AlertCircle, ChevronUp, Globe, Building2, FileText,
  Send, X, MessageSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const FIELD_LABELS: Record<string, string> = {
  customerName: 'Наименование Заказчика',
  customerInn: 'УНП Заказчика',
  purchasingOrg: 'Закупочная организация',
  purchasingInn: 'УНП закупочной орг.',
  intermediatePartner: 'Поставка через партнера',
  customerWebsite: 'Сайт Заказчика',
  installationAddr: 'Адрес установки',
  ipAtcType: 'Тип IP-АТС',
  currentTelephony: 'Текущая телефония',
  executionDate: 'Дата реализации',
  purchaseMethod: 'Форма закупки',
  industry: 'Сфера деятельности',
  usageScenario: 'Сценарий использования',
  competitors: 'Конкуренты',
  budgetStatus: 'Статус бюджета',
  deliverySchedule: 'График поставки',
  keyRequirements: 'Ключевые требования',
  additionalEquipment: 'Доп. оборудование/ПО',
  ydmpPlanning: 'Планирование YDMP',
  plannedActions: 'Планируемые действия',
  comments: 'Дополнительные комментарии'
};

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
  const [isChatMinimized, setIsChatMinimized] = useState(false)
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

  // Скролл чата вниз
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, chatProject]);

  const updateProjectStatus = async (projectId: number, newStatus: 'APPROVED' | 'REJECTED') => {
    try {
      await fetch(`http://192.168.85.110:5001/api/projects/${projectId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status: newStatus } : p));
    } catch (err) { console.error(err); }
  };

  const filteredProjects = projects.filter(p => {
    const search = searchQuery.toLowerCase();
    return (p.partner?.name || '').toLowerCase().includes(search) || 
           (p.customerName || '').toLowerCase().includes(search) || 
           p.id.toString().includes(search);
  });

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans text-slate-900">
      
      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 z-20">
        <div className="p-8">
          <div className="flex items-center gap-3 text-emerald-600 font-bold text-xl">
            <div className="w-11 h-11 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-black">M</div>
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
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-4 text-slate-400 hover:text-red-500 font-bold text-sm">
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
              className="w-full pl-12 pr-4 py-3.5 bg-slate-100 rounded-2xl outline-none text-sm font-medium focus:ring-2 focus:ring-emerald-500/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-black text-slate-900">{user?.name}</p>
              <p className="text-[10px] text-emerald-600 font-black uppercase">Manager Account</p>
            </div>
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black">{user?.name?.[0]}</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-10 bg-[#F8FAFC]">
          {activeTab === 'projects' && (
            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
              <h2 className="text-3xl font-black text-slate-900 uppercase">Реестр проектов</h2>
              
              <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/30">
                      {['ID', 'Партнер / Компания', 'Заказчик', 'Статус', 'Дата', 'Действия'].map((h) => (
                        <th key={h} className="p-6 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProjects.map(proj => (
                      <React.Fragment key={proj.id}>
                        <tr 
                          className={`hover:bg-slate-50/50 transition-all border-b border-slate-50 last:border-0 cursor-pointer ${expandedProjectId === proj.id ? 'bg-emerald-50/10' : ''}`}
                          onClick={() => setExpandedProjectId(expandedProjectId === proj.id ? null : proj.id)}
                        >
                          <td className="p-6 text-center font-mono text-[11px] font-black text-emerald-600">PRJ-{proj.id}</td>
                          <td className="p-6 text-center">
                            <div className="flex flex-col items-center">
                              <span className="font-black text-slate-800 text-sm">{proj.partner?.name || '444'}</span>
                              <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">Личный кабинет</span>
                            </div>
                          </td>
                          <td className="p-6 text-center text-slate-600 text-sm font-bold">
                            {proj.customerName || 'Не указан'}
                          </td>
                          <td className="p-6 text-center"><StatusBadge status={proj.status} /></td>
                          <td className="p-6 text-center text-[11px] text-slate-400 font-black uppercase">{new Date(proj.createdAt).toLocaleDateString('ru-RU')}</td>
                          <td className="p-6">
                            <div className="flex items-center gap-2 justify-center">
                              <button className={`p-3 rounded-2xl transition-all ${expandedProjectId === proj.id ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400 hover:bg-emerald-600 hover:text-white'}`}>
                                {expandedProjectId === proj.id ? <ChevronUp size={18} /> : <FileText size={18} />}
                              </button>
                              {proj.status === 'PENDING' && (
                                <>
                                  <button onClick={(e) => { e.stopPropagation(); updateProjectStatus(proj.id, 'APPROVED'); }} className="p-3 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-2xl transition-all"><CheckCircle size={18} /></button>
                                  <button onClick={(e) => { e.stopPropagation(); updateProjectStatus(proj.id, 'REJECTED'); }} className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all"><XCircle size={18} /></button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>

                        {expandedProjectId === proj.id && (
                          <tr className="bg-slate-50/30">
                            <td colSpan={6} className="p-8">
                              <div className="bg-white rounded-[2rem] border border-slate-200 p-10 shadow-2xl animate-in slide-in-from-top-4 duration-500">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                                  {/* Общие данные */}
                                  <div className="space-y-6">
                                    <h4 className="flex items-center gap-2 text-[11px] font-black uppercase text-emerald-600 tracking-widest border-b border-slate-100 pb-4">
                                      <FileText size={16}/> Общие данные о проекте
                                    </h4>
                                    <div className="space-y-0.5">
                                      <DataRow label="Наименование Заказчика" value={proj.customerName} />
                                      <DataRow label="УНП Заказчика" value={proj.customerInn} />
                                      {Object.entries(proj.dynamicData || {}).map(([key, value]) => {
                                        if (key === 'specification' || key === 'items') return null;
                                        return <DataRow key={key} label={FIELD_LABELS[key] || key} value={String(value)} />;
                                      })}
                                    </div>
                                  </div>

                                  {/* Спецификация */}
                                  <div className="space-y-8">
                                    <div className="space-y-6">
                                      <h4 className="flex items-center gap-2 text-[11px] font-black uppercase text-blue-600 tracking-widest border-b border-slate-100 pb-4">
                                        <ShoppingCart size={16}/> Спецификация
                                      </h4>
                                      <div className="bg-blue-50/50 rounded-3xl p-6 border border-blue-100/50">
                                        <table className="w-full text-xs">
                                          <thead>
                                            <tr className="text-blue-400 font-black uppercase tracking-widest">
                                              <th className="text-left pb-2 italic">Модель оборудования</th>
                                              <th className="text-right pb-2 italic">Кол-во</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {(proj.dynamicData?.specification || []).map((item: any, i: number) => (
                                              <tr key={i} className="border-t border-blue-100/30">
                                                <td className="py-2.5 font-bold text-slate-700 uppercase tracking-tight">{item.model}</td>
                                                <td className="py-2.5 text-right font-black text-blue-700">{item.count} <span className="text-[10px] opacity-50">шт.</span></td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                    <div className="space-y-4">
                                      <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Building2 size={14}/> Профиль партнера
                                      </h4>
                                      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                        <p className="text-sm font-black text-slate-800">{proj.partner?.name}</p>
                                        <p className="text-[10px] text-slate-400 font-black uppercase mt-1 tracking-widest">УНП: {proj.partner?.companyInn || 'НЕ УКАЗАН'}</p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Системные логи и действия */}
                                  <div className="space-y-8">
                                    <div className="space-y-6">
                                      <h4 className="text-[11px] font-black uppercase text-slate-900 tracking-widest border-b border-slate-100 pb-4 flex items-center gap-2">
                                        <Globe size={16}/> Системные события
                                      </h4>
                                      <div className="space-y-4">
                                        <LogEntry icon={<Clock size={16}/>} label="Дата подачи заявки" value={new Date(proj.createdAt).toLocaleString()} />
                                        <LogEntry icon={<RefreshCw size={16}/>} label="Последнее обновление" value={new Date(proj.updatedAt).toLocaleString()} />
                                      </div>
                                    </div>
                                    <div className="pt-10">
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); setChatProject(proj); }}
                                        className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
                                      >
                                        <MessageSquare size={16} /> Связаться с партнером
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>

        {/* --- ОКНО ЧАТА С МИНИМАЛЬНЫМ РАЗМЫТИЕМ --- */}
        {/* --- ОБНОВЛЕННОЕ ОКНО ЧАТА БЕЗ РАЗМЫТИЯ --- */}
{chatProject && (
  <>
    {isChatMinimized ? (
      /* --- КНОПКА ДЛЯ РАЗВЕРТЫВАНИЯ (Свернутый вид) --- */
      <button 
        onClick={() => setIsChatMinimized(false)}
        className="fixed right-0 top-1/2 -translate-y-1/2 bg-slate-900 text-white p-4 rounded-l-3xl shadow-2xl hover:bg-emerald-600 transition-all duration-300 group z-[60] flex flex-col items-center gap-3 border-y border-l border-white/10"
      >
        <div className="relative">
          <MessageSquare size={24} />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full animate-pulse"></span>
        </div>
        <span className="[writing-mode:vertical-lr] rotate-180 text-[10px] font-black uppercase tracking-[0.2em] py-2">
          Чат: PRJ-{chatProject.id}
        </span>
      </button>
    ) : (
      /* --- ПОЛНОРАЗМЕРНЫЙ ЧАТ (Без размытия фона) --- */
      <div className="absolute inset-0 bg-slate-900/5 z-50 flex justify-end">
        <div className="w-[450px] bg-white h-full shadow-[-30px_0_60px_rgba(0,0,0,0.12)] flex flex-col animate-in slide-in-from-right duration-300 border-l border-slate-200">
          
          {/* Header чата */}
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-black shadow-lg shadow-emerald-100">
                {chatProject.partner?.name?.[0] || 'P'}
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 leading-tight">Обсуждение проекта</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate max-w-[180px]">
                  {chatProject.partner?.name}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              {/* Кнопка Свернуть */}
              <button 
                onClick={() => setIsChatMinimized(true)}
                className="p-2.5 hover:bg-slate-100 text-slate-400 rounded-xl transition-all"
                title="Свернуть"
              >
                <ChevronUp className="rotate-90" size={20}/>
              </button>
              {/* Кнопка Закрыть */}
              <button 
                onClick={() => { setChatProject(null); setIsChatMinimized(false); }} 
                className="p-2.5 hover:bg-red-50 hover:text-red-500 text-slate-400 rounded-xl transition-all"
              >
                <X size={20}/>
              </button>
            </div>
          </div>

          {/* Инфо-плашка */}
          <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">ID: PRJ-{chatProject.id}</span>
            <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest truncate max-w-[180px]">
              {chatProject.customerName}
            </span>
          </div>

          {/* Тело чата */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-30">
                <MessageSquare size={32} className="text-slate-300 mb-2" />
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Нет сообщений</p>
              </div>
            ) : (
              messages.map((msg, idx) => {
                const isMine = msg.senderId === user?.id;
                return (
                  <div key={idx} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[88%] p-4 rounded-2xl text-sm leading-relaxed ${
                      isMine ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-slate-100 text-slate-700 rounded-tl-none border border-slate-200'
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-[8px] font-black text-slate-400 mt-2 uppercase tracking-tighter px-1">
                      {isMine ? 'Менеджер' : 'Партнер'} • {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Ввод */}
          <div className="p-6 bg-white border-t border-slate-100">
            <div className="relative flex items-center">
              <input 
                type="text"
                placeholder="Напишите сообщение..."
                className="w-full pl-5 pr-14 py-4 bg-slate-50 rounded-2xl outline-none text-sm font-medium border border-slate-200 focus:border-emerald-500/30 transition-all"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button className="absolute right-2.5 p-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-100">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </>
)}
      </div>
    </div>
  );
};

// Вспомогательные компоненты
const NavBtn = ({ active, onClick, icon, label }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all group ${active ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 font-bold' : 'text-slate-500 hover:bg-slate-50'}`}>
    <span className={active ? 'text-white' : 'text-slate-400 group-hover:text-emerald-500 transition-colors'}>{icon}</span>
    <span className="text-sm tracking-tight">{label}</span>
  </button>
);

const DataRow = ({ label, value }: { label: string, value: any }) => (
  <div className="flex justify-between gap-6 py-2.5 border-b border-slate-50 last:border-0 items-start">
    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter pt-1 min-w-[140px]">{label}:</span>
    <span className="text-xs font-bold text-slate-700 text-right leading-relaxed">{String(value || '—')}</span>
  </div>
);

const LogEntry = ({ icon, label, value }: any) => (
  <div className="flex gap-4">
    <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400 border border-slate-100 h-fit">{icon}</div>
    <div className="flex flex-col">
      <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-none">{label}</span>
      <span className="text-xs font-bold text-slate-700 mt-1">{value}</span>
    </div>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const styles: any = {
    PENDING: 'bg-orange-100 text-orange-700 ring-1 ring-orange-200',
    APPROVED: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200',
    REJECTED: 'bg-red-100 text-red-700 ring-1 ring-red-200'
  };
  const labels: any = { PENDING: 'ПРОВЕРКА', APPROVED: 'ОДОБРЕН', REJECTED: 'ОТКАЗ' };
  return <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase ${styles[status]}`}>{labels[status]}</span>;
};

export default ManagerDashboard;