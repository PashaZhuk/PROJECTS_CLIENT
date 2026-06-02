import { useState, useEffect, useCallback } from 'react';
import {
  History,
  Activity,
  Loader2,
  RefreshCw,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  X,
} from 'lucide-react';
import { getErrorMessage } from '../shared/UIHelpers';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface EventLog {
  id: number;
  action: string;
  description: string;
  entityType: string;
  entityId: number | null;
  userId: number;
  createdAt: string;
  user?: { name: string | null; companyName: string | null; email: string | null } | null;
}

interface EventLogResponse {
  items: EventLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ACTION_LABELS: Record<string, string> = {
  status_changed: 'Изменён статус',
  equipment_added: 'Добавлено оборудование',
  equipment_edited: 'Изменено оборудование',
  equipment_deleted: 'Удалено оборудование',
  news_added: 'Добавлена новость',
  news_deleted: 'Удалена новость',
  broadcast_sent: 'Отправлена рассылка',
};

const ACTIONS = Object.entries(ACTION_LABELS);

const TYPE_LABELS: Record<string, string> = {
  project: 'Проект',
  equipment: 'Оборудование',
  news: 'Новость',
  broadcast: 'Рассылка',
};

const TYPE_STYLES: Record<string, string> = {
  project: 'bg-blue-50 text-blue-700 border-blue-200',
  equipment: 'bg-purple-50 text-purple-700 border-purple-200',
  news: 'bg-amber-50 text-amber-700 border-amber-200',
  broadcast: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const formatDateTime = (iso: string): string => {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('ru-RU', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch { return iso; }
};

const getActionLabel = (action: string): string => ACTION_LABELS[action] || action;
const getTypeLabel = (t: string): string => TYPE_LABELS[t] || t;
const getTypeStyle = (t: string): string => TYPE_STYLES[t] || 'bg-slate-50 text-slate-700 border-slate-200';

// ---------------------------------------------------------------------------
// Badge
// ---------------------------------------------------------------------------

const TypeBadge = ({ entityType }: { entityType: string }) => (
  <span className={`inline-block px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getTypeStyle(entityType)}`}>
    {getTypeLabel(entityType)}
  </span>
);

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------

const Pagination = ({ page, totalPages, onPage }: { page: number; totalPages: number; onPage: (n: number) => void }) => {
  if (totalPages <= 1) return null;
  const pages: (number | string)[] = [];
  const range = 2;
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - range && i <= page + range)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <div className="flex items-center justify-center gap-2 py-6">
      <button
        onClick={() => onPage(page - 1)}
        disabled={page <= 1}
        className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft size={16} />
      </button>
      {pages.map((p, i) =>
        typeof p === 'number' ? (
          <button
            key={i}
            onClick={() => onPage(p)}
            className={`min-w-[36px] h-9 rounded-xl text-xs font-bold transition-all ${
              p === page
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {p}
          </button>
        ) : (
          <span key={i} className="text-slate-300 text-xs px-1">...</span>
        )
      )}
      <button
        onClick={() => onPage(page + 1)}
        disabled={page >= totalPages}
        className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

const MonitoringHistory = () => {
  const [events, setEvents] = useState<EventLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [actionFilter, setActionFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // -----------------------------------------------------------------------
  // Data fetching
  // -----------------------------------------------------------------------

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', '200');
      if (actionFilter) params.set('action', actionFilter);

      const res = await fetch(`/api/manager/events?${params.toString()}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body = await res.json();
      if (body.success && body.data) {
        const d: EventLogResponse = body.data;
        setEvents(d.items || []);
        setTotal(d.total || 0);
        setTotalPages(d.totalPages || 1);
      } else {
        throw new Error('Неверный формат ответа');
      }
    } catch (err: any) {
      setError(getErrorMessage(err, 'Ошибка загрузки'));
    } finally {
      setLoading(false);
    }
  }, [page, actionFilter]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // -----------------------------------------------------------------------
  // Search — client-side filter on description
  // -----------------------------------------------------------------------

  const displayed = searchQuery
    ? events.filter((e) =>
        JSON.stringify(e).toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : events;

  // -----------------------------------------------------------------------
  // Loading state
  // -----------------------------------------------------------------------

  if (loading && events.length === 0) {
    return (
      <div className="animate-in fade-in duration-500">
        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100">
            <h2 className="text-2xl font-black text-slate-900">История событий</h2>
            <p className="text-slate-400 text-sm font-medium mt-1">Мониторинг действий и изменений</p>
          </div>
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="animate-spin text-slate-300" size={36} />
            <span className="text-sm font-medium text-slate-400">Загрузка событий…</span>
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // Error state
  // -----------------------------------------------------------------------

  if (error && events.length === 0) {
    return (
      <div className="animate-in fade-in duration-500">
        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100">
            <h2 className="text-2xl font-black text-slate-900">История событий</h2>
            <p className="text-slate-400 text-sm font-medium mt-1">Мониторинг действий и изменений</p>
          </div>
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
              <AlertCircle size={32} className="text-red-400" />
            </div>
            <span className="text-sm font-bold text-red-500">Не удалось загрузить события</span>
            <span className="text-xs text-slate-400 max-w-sm text-center">{error}</span>
            <button onClick={fetchEvents} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-emerald-700 transition-all shadow-md shadow-emerald-200">
              <RefreshCw size={14} /> Повторить
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // Empty state
  // -----------------------------------------------------------------------

  if (events.length === 0) {
    return (
      <div className="animate-in fade-in duration-500">
        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100">
            <h2 className="text-2xl font-black text-slate-900">История событий</h2>
            <p className="text-slate-400 text-sm font-medium mt-1">Мониторинг действий и изменений</p>
          </div>
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
              <Activity size={28} className="text-slate-300" />
            </div>
            <span className="text-sm font-bold text-slate-500">Ещё нет событий</span>
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // Data display
  // -----------------------------------------------------------------------

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900">История событий</h2>
            <p className="text-slate-400 text-sm font-medium mt-1">Мониторинг действий и изменений</p>
          </div>
          <button onClick={fetchEvents} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-500 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-100 disabled:opacity-40 transition-all">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Обновить
          </button>
        </div>

        {/* Filters */}
        <div className="px-8 pt-6 pb-2 flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Поиск по событиям..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            )}
          </div>

          {/* Action filter */}
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-slate-400 shrink-0" />
            <select
              value={actionFilter}
              onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Все действия</option>
              {ACTIONS.map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          {/* Summary */}
          <div className="flex items-center text-xs font-bold text-slate-400 shrink-0">
            <History size={14} className="mr-1" />
            {total} записей
          </div>
        </div>

        {/* Table */}
        <div className="p-8 pt-4">
          <div className="hidden md:grid grid-cols-13 gap-4 px-4 py-3 bg-slate-50 rounded-xl mb-1">
            <div className="col-span-3 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Дата/время</div>
            <div className="col-span-2 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Действие</div>
            <div className="col-span-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Описание</div>
            <div className="col-span-2 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Кто</div>
            <div className="col-span-1 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">ID</div>
            <div className="col-span-1 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Тип</div>
          </div>

          <div className="space-y-0 divide-y divide-slate-100">
            {displayed.map((event) => (
              <div
                key={event.id}
                className="grid grid-cols-1 md:grid-cols-13 gap-3 md:gap-4 items-center px-4 py-4 hover:bg-slate-50 transition-all"
              >
                {/* Дата/время */}
                <div className="col-span-3 text-center">
                  <span className="text-xs font-bold text-slate-600">{formatDateTime(event.createdAt)}</span>
                </div>

                {/* Действие */}
                <div className="col-span-2 text-center">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-bold text-slate-700">
                    {getActionLabel(event.action)}
                  </span>
                </div>

                {/* Описание */}
                <div className="col-span-4 text-center">
                  <div className="text-sm font-medium text-slate-700 leading-snug">
                    {event.description}
                    {event.entityId && (
                      <span className="text-[10px] text-slate-400 ml-1 font-mono">#{event.entityId}</span>
                    )}
                  </div>
                </div>

                {/* Кто */}
                <div className="col-span-2 text-center">
                  <span className="text-[11px] font-bold text-slate-600 truncate block">
                    {event.user?.companyName || event.user?.name || event.user?.email || '—'}
                  </span>
                </div>

                {/* ID */}
                <div className="col-span-1 text-center">
                  <span className="text-[10px] font-mono text-slate-400">#{event.id}</span>
                </div>

                {/* Тип */}
                <div className="col-span-1 text-center">
                  <TypeBadge entityType={event.entityType} />
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <Pagination page={page} totalPages={totalPages} onPage={setPage} />
        </div>
      </div>
    </div>
  );
};

export default MonitoringHistory;
