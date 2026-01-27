import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  LayoutDashboard, ClipboardList, ChevronDown, ChevronUp,
  LogOut, FileText, Clock, CheckCircle2,
  RefreshCw, Edit3, Search, Info, MessageSquare, Layers, Globe, Video,
  PlusCircle, Calendar, Hash, Building2, ShoppingCart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import DynamicProjectForm from '../components/DynamicProjectForm';

// --- TYPES & CONSTANTS ---

interface Project {
  id: number;
  customerName: string;
  customerInn: string;
  formType: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  dynamicData?: {
    specification?: Array<{ model: string; count: number }>;
    [key: string]: any;
  };
}

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

const API_URL = 'http://192.168.85.110:5001/api/projects';

// --- MAIN COMPONENT ---

const UserDashboard = () => {
  const { logout, user } = useAuth();

  const [activeTab, setActiveTab] = useState<'stats' | 'my-projects' | 'create-project'>('stats');
  const [isProjectsMenuOpen, setIsProjectsMenuOpen] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [expandedProjectId, setExpandedProjectId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL, { credentials: 'include' });
      if (!response.ok) throw new Error('Ошибка загрузки данных');
      const data = await response.json();
      const sortedData = data.sort((a: Project, b: Project) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setProjects(sortedData);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const filteredProjects = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return projects.filter(p =>
      p.customerName?.toLowerCase().includes(query) ||
      p.id.toString().includes(query) ||
      p.formType.toLowerCase().includes(query)
    );
  }, [projects, searchQuery]);

  const stats = useMemo(() => ({
    pending: projects.filter(p => p.status === 'PENDING').length,
    approved: projects.filter(p => p.status === 'APPROVED').length,
    total: projects.length
  }), [projects]);

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setSelectedCategory(project.formType);
    setActiveTab('create-project');
  };

  const resetFormState = () => {
    setEditingProject(null);
    setSelectedCategory(null);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      {/* SIDEBAR */}
      <aside className="w-72 bg-slate-900 text-slate-400 flex flex-col shrink-0 shadow-2xl z-10">
        <div className="p-8">
          <div className="flex items-center gap-3 text-white font-bold text-xl tracking-tighter">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/50 font-black">P</div>
            Partner<span className="text-blue-500">Portal</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 space-y-2">
          <SidebarButton
            active={activeTab === 'stats'}
            onClick={() => { setActiveTab('stats'); setExpandedProjectId(null); }}
            icon={<LayoutDashboard size={20} />}
            label="Обзор"
          />

          <div className="py-2">
            <button
              onClick={() => setIsProjectsMenuOpen(!isProjectsMenuOpen)}
              className="w-full flex items-center justify-between px-4 py-3 hover:text-white transition-all group"
            >
              <div className="flex items-center gap-3">
                <ClipboardList size={20} className="group-hover:text-blue-400" />
                <span className="font-bold text-[11px] uppercase tracking-widest">Проекты</span>
              </div>
              {isProjectsMenuOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {isProjectsMenuOpen && (
              <div className="mt-1 space-y-1 ml-4 border-l border-slate-800">
                <SidebarSubButton
                  active={activeTab === 'my-projects'}
                  onClick={() => { setActiveTab('my-projects'); resetFormState(); }}
                  label="Мои регистрации"
                />
                <SidebarSubButton
                  active={activeTab === 'create-project'}
                  onClick={() => { setActiveTab('create-project'); resetFormState(); }}
                  label="Зарегистрировать новый проект"
                />
              </div>
            )}
          </div>
        </nav>

        <div className="p-6 border-t border-slate-800/50">
          <div className="bg-slate-800/40 rounded-2xl p-4 mb-4">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Аккаунт</p>
            <p className="text-white text-sm font-bold truncate">{user?.name || 'Пользователь'}</p>
          </div>
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all font-bold text-xs uppercase tracking-widest">
            <LogOut size={18} /> Выйти
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-8 lg:p-12 relative">
        {activeTab === 'stats' && (
          <StatsView stats={stats} onRefresh={fetchProjects} isLoading={loading} />
        )}

        {activeTab === 'my-projects' && (
          <ProjectsListView
            projects={filteredProjects}
            isLoading={loading}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            expandedId={expandedProjectId}
            setExpandedId={setExpandedProjectId}
            onEdit={handleEdit}
            onCreateNew={() => { setActiveTab('create-project'); resetFormState(); }}
          />
        )}

        {activeTab === 'create-project' && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700">
            {!editingProject && !selectedCategory ? (
              <CategorySelection onSelect={setSelectedCategory} />
            ) : (
              <DynamicProjectForm
                category={selectedCategory!}
                initialData={editingProject}
                isEditing={!!editingProject}
                onBack={() => {
                  resetFormState();
                  if (editingProject) setActiveTab('my-projects');
                }}
                onSubmit={async () => {
                  await fetchProjects();
                  resetFormState();
                  setActiveTab('my-projects');
                }}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
};

// --- SUB-VIEWS ---

const StatsView = ({ stats, onRefresh, isLoading }: any) => (
  <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <div className="flex justify-between items-end">
      <div>
        <h1 className="text-5xl font-black text-slate-900 tracking-tight">
          Менеджер <span className="text-blue-600">Проектов</span>
        </h1>
        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-4 flex items-center gap-2">
          <Calendar size={12} className="text-blue-500" /> 
          {new Date().toLocaleDateString('ru-RU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
      <button
        onClick={onRefresh}
        disabled={isLoading}
        className="group p-4 bg-white border border-slate-200 rounded-[1.5rem] text-slate-400 hover:text-blue-600 shadow-sm hover:shadow-xl hover:shadow-blue-100 transition-all active:scale-90 disabled:opacity-50"
      >
        <RefreshCw size={24} className={isLoading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"} />
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <StatCard icon={<Clock />} label="На проверке" value={stats.pending} color="orange" />
      <StatCard icon={<CheckCircle2 />} label="Успешно" value={stats.approved} color="emerald" />
      <StatCard icon={<FileText />} label="Всего заявок" value={stats.total} color="blue" />
    </div>
  </div>
);

const ProjectsListView = ({ projects, isLoading, searchQuery, setSearchQuery, expandedId, setExpandedId, onEdit, onCreateNew }: any) => (
  <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg">
          <ClipboardList size={24} />
        </div>
        <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Реестр проектов</h2>
      </div>

      <div className="relative w-full md:w-96 group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
        <input
          type="text"
          placeholder="Поиск по заказчику или ID..."
          className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-medium shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>

    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
      {isLoading ? (
        <LoadingState />
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/30">
              {['ID / Тип', 'Заказчик', 'Статус', 'Дата', 'Действия'].map((h) => (
                <th key={h} className="p-6 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {projects.length > 0 ? (
              projects.map((p: Project) => (
                <ProjectTableRow 
                  key={p.id} 
                  project={p} 
                  isExpanded={expandedId === p.id}
                  onToggleExpand={() => setExpandedId(expandedId === p.id ? null : p.id)}
                  onEdit={() => onEdit(p)}
                />
              ))
            ) : (
              <EmptyState isSearch={!!searchQuery} onAction={onCreateNew} />
            )}
          </tbody>
        </table>
      )}
    </div>
  </div>
);

const ProjectTableRow = ({ project, isExpanded, onToggleExpand, onEdit }: any) => {
  return (
    <React.Fragment>
      <tr 
        className={`hover:bg-slate-50/50 transition-all border-b border-slate-50 last:border-0 cursor-pointer ${isExpanded ? 'bg-blue-50/10' : ''}`}
        onClick={onToggleExpand}
      >
        {/* ID и Тип */}
        <td className="p-6 text-center">
          <div className="flex flex-col items-center">
            <span className="font-mono text-[11px] font-black text-blue-600">PRJ-{project.id}</span>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">
              {project.formType.replace('_', ' ')}
            </span>
          </div>
        </td>

        {/* Заказчик */}
        <td className="p-6 text-center">
          <div className="flex flex-col items-center">
            <span className="font-black text-slate-800 text-sm">{project.customerName || 'Не указан'}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
              ИНН: {project.customerInn || '—'}
            </span>
          </div>
        </td>

        {/* Статус */}
        <td className="p-6 text-center">
          <div className="flex justify-center">
            <StatusBadge status={project.status} />
          </div>
        </td>

        {/* Дата */}
        <td className="p-6 text-center">
          <span className="text-[11px] text-slate-400 font-black uppercase">
            {new Date(project.createdAt).toLocaleDateString('ru-RU')}
          </span>
        </td>

        {/* Действия */}
        <td className="p-6" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-2 justify-center">
            <button 
              onClick={onToggleExpand}
              className={`p-3 rounded-2xl transition-all ${isExpanded ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400 hover:bg-blue-600 hover:text-white'}`}
            >
              {isExpanded ? <ChevronUp size={18} /> : <FileText size={18} />}
            </button>
            {project.status === 'PENDING' && (
              <button 
                onClick={onEdit}
                className="p-3 bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white rounded-2xl transition-all"
              >
                <Edit3 size={18} />
              </button>
            )}
          </div>
        </td>
      </tr>

      {isExpanded && (
        <tr className="bg-slate-50/30">
          <td colSpan={5} className="p-8">
            <div className="bg-white rounded-[2.5rem] border border-slate-200 p-12 shadow-2xl animate-in slide-in-from-top-4 duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                
                {/* 1. Общие данные */}
                <div className="space-y-8">
                  <h4 className="flex items-center gap-2 text-[11px] font-black uppercase text-blue-600 tracking-[0.2em] border-b border-slate-100 pb-4">
                    <Building2 size={16}/> Информация по сделке
                  </h4>
                  <div className="space-y-4">
                    {Object.entries(project.dynamicData || {}).map(([key, value]) => {
                      if (['specification', 'items', 'customerName', 'customerInn'].includes(key) || !value) return null;
                      return <DataRow key={key} label={FIELD_LABELS[key] || key} value={String(value)} />;
                    })}
                  </div>
                </div>

                {/* 2. Спецификация */}
                <div className="space-y-8">
                  <h4 className="flex items-center gap-2 text-[11px] font-black uppercase text-emerald-600 tracking-[0.2em] border-b border-slate-100 pb-4">
                    <ShoppingCart size={16}/> Спецификация
                  </h4>
                  <div className="bg-emerald-50/50 rounded-[2rem] p-8 border border-emerald-100/50">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-emerald-500/70 font-black uppercase tracking-widest">
                          <th className="text-left pb-4 italic">Модель</th>
                          <th className="text-right pb-4 italic">Кол-во</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-emerald-100/30">
                        {(project.dynamicData?.specification || []).length > 0 ? (
                          project.dynamicData?.specification?.map((item: any, i: number) => (
                            <tr key={i}>
                              <td className="py-3 font-bold text-slate-700 uppercase">{item.model}</td>
                              <td className="py-3 text-right font-black text-emerald-700">{item.count} <span className="opacity-50">шт.</span></td>
                            </tr>
                          ))
                        ) : (
                          <tr><td colSpan={2} className="py-4 text-center text-slate-400">Нет позиций</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 3. Системные данные */}
                <div className="space-y-8">
                  <h4 className="text-[11px] font-black uppercase text-slate-900 tracking-[0.2em] border-b border-slate-100 pb-4 flex items-center gap-2">
                    <Globe size={16}/> История изменений
                  </h4>
                  <div className="space-y-6">
                    <LogEntry icon={<Clock size={16}/>} label="Дата создания" value={new Date(project.createdAt).toLocaleString()} />
                    <LogEntry icon={<RefreshCw size={16}/>} label="Обновлено" value={new Date(project.updatedAt).toLocaleString()} />
                  </div>
                  <div className="pt-10">
                    <button className="w-full py-5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3">
                      <MessageSquare size={18} /> Связаться с поддержкой
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </td>
        </tr>
      )}
    </React.Fragment>
  );
};

// --- SMALL UI HELPERS ---

const DataRow = ({ label, value }: { label: string, value: string }) => (
  <div className="flex flex-col border-b border-slate-50 pb-2">
    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{label}</span>
    <span className="text-[13px] font-bold text-slate-700 mt-1 leading-tight">{value}</span>
  </div>
);

const LogEntry = ({ icon, label, value }: any) => (
  <div className="flex items-center justify-between text-[11px] font-bold">
    <span className="text-slate-400 flex items-center gap-2 italic">{icon} {label}</span>
    <span className="text-slate-700">{value}</span>
  </div>
);

const SidebarButton = ({ active, onClick, icon, label }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all ${active ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40 font-bold' : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800/50'}`}
  >
    {icon} <span className="text-[11px] uppercase tracking-widest font-black">{label}</span>
  </button>
);

const SidebarSubButton = ({ active, onClick, label }: any) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-5 py-3 rounded-xl text-[10px] uppercase tracking-widest font-black transition-all ${active ? 'text-blue-400' : 'text-slate-600 hover:text-white'}`}
  >
    • {label}
  </button>
);

const StatCard = ({ icon, label, value, color }: any) => {
  const colors: any = {
    orange: "bg-orange-50 text-orange-500 border-orange-100",
    emerald: "bg-emerald-50 text-emerald-500 border-emerald-100",
    blue: "bg-blue-50 text-blue-500 border-blue-100"
  };
  return (
    <div className="p-8 rounded-[2.5rem] border bg-white shadow-lg transition-transform hover:-translate-y-1 duration-300">
      <div className={`w-14 h-14 ${colors[color]} rounded-2xl flex items-center justify-center mb-6 shadow-inner`}>
        {React.cloneElement(icon, { size: 28 })}
      </div>
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">{label}</p>
      <p className="text-4xl font-black text-slate-900 mt-2 tracking-tighter">{value}</p>
    </div>
  );
};

const CategorySelection = ({ onSelect }: { onSelect: (val: string) => void }) => (
  <div className="py-12 text-center">
    <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Этап 1</span>
    <h2 className="text-4xl font-black text-slate-900 uppercase mb-12 tracking-tighter">Выберите направление</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <CategoryCard title="Yealink Phones" desc="IP-Телефония" icon={<Layers />} onClick={() => onSelect('YEALINK_PHONES')} />
      <CategoryCard title="Networking" desc="Сетевое оборудование" icon={<Globe />} onClick={() => onSelect('NETWORKING')} />
      <CategoryCard title="Video Conf" desc="ВКС системы" icon={<Video />} onClick={() => onSelect('VIDEO_CONFERENCE')} />
    </div>
  </div>
);

const CategoryCard = ({ title, desc, icon, onClick }: any) => (
  <button onClick={onClick} className="bg-white p-10 rounded-[3rem] border border-slate-100 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-100 transition-all text-left group active:scale-95">
    <div className="w-16 h-16 bg-slate-50 text-slate-300 group-hover:bg-blue-600 group-hover:text-white rounded-[1.5rem] flex items-center justify-center mb-8 transition-all duration-500 shadow-inner">
      {React.cloneElement(icon, { size: 32 })}
    </div>
    <h3 className="font-black text-slate-900 text-lg uppercase leading-none">{title}</h3>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-3">{desc}</p>
  </button>
);

const StatusBadge = ({ status }: { status: string }) => {
  const styles: any = {
    PENDING: "bg-orange-50 text-orange-600 border-orange-100",
    APPROVED: "bg-emerald-50 text-emerald-600 border-emerald-100",
    REJECTED: "bg-red-50 text-red-600 border-red-100"
  };
  const labels: any = { PENDING: "На проверке", APPROVED: "Одобрен", REJECTED: "Отклонен" };
  return (
    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.1em] border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

const LoadingState = () => (
  <div className="flex flex-col items-center justify-center h-96 gap-4">
    <RefreshCw size={48} className="animate-spin text-blue-600" />
    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Синхронизация...</p>
  </div>
);

const EmptyState = ({ isSearch, onAction }: { isSearch: boolean, onAction: () => void }) => (
  <tr>
    <td colSpan={5} className="py-32 text-center">
      <div className="flex flex-col items-center justify-center">
        <div className="w-24 h-24 bg-slate-50 rounded-[3rem] flex items-center justify-center text-slate-200 mb-6 border border-slate-100">
          <ClipboardList size={40} />
        </div>
        <h3 className="text-xl font-black text-slate-900 uppercase">
          {isSearch ? "Совпадений нет" : "Реестр пуст"}
        </h3>
        <p className="text-slate-400 text-sm mt-2 mb-10 max-w-[280px] mx-auto leading-relaxed">
          {isSearch ? "Попробуйте изменить запрос." : "Начните работу, зарегистрировав проект."}
        </p>
        {!isSearch && (
          <button onClick={onAction} className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all">
            Добавить проект
          </button>
        )}
      </div>
    </td>
  </tr>
);

export default UserDashboard;