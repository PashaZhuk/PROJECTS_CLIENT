import { useState, useEffect, useCallback } from 'react';
import {
  History,
  Activity,
  Loader2,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';

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

const TYPE_STYLES: Record<string, string> = {
  project: 'bg-blue-50 text-blue-700 border-blue-200',
  equipment: 'bg-purple-50 text-purple-700 border-purple-200',
  news: 'bg-amber-50 text-amber-700 border-amber-200',
  broadcast: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const TYPE_LABELS: Record<string, string> = {
  project: 'Проект',
  equipment: 'Оборудование',
  news: 'Новость',
  broadcast: 'Рассылка',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const formatDateTime = (iso: string): string => {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
};

const getActionLabel = (action: string): string =>
  ACTION_LABELS[action] || action;

const getTypeLabel = (entityType: string): string =>
  TYPE_LABELS[entityType] || entityType;

const getTypeStyle = (entityType: string): string =>
  TYPE_STYLES[entityType] || 'bg-slate-50 text-slate-700 border-slate-200';

// ---------------------------------------------------------------------------
// Badge components
// ---------------------------------------------------------------------------

const TypeBadge = ({ entityType }: { entityType: string }) => (
  <span
    className={`inline-block px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getTypeStyle(entityType)}`}
  >
    {getTypeLabel(entityType)}
  </span>
);

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

const MonitoringHistory = () => {
  const [events, setEvents] = useState<EventLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // -----------------------------------------------------------------------
  // Data fetching
  // -----------------------------------------------------------------------

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/manager/events', {
        credentials: 'include',
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body = await res.json();
      if (body.success && Array.isArray(body.data)) {
        setEvents(body.data);
      } else {
        throw new Error('Неверный формат ответа');
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // -----------------------------------------------------------------------
  // Loading state
  // -----------------------------------------------------------------------

  if (loading) {
    return (
      <div className="animate-in fade-in duration-500">
        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100">
            <h2 className="text-2xl font-black text-slate-900">
              История событий контроля
            </h2>
            <p className="text-slate-400 text-sm font-medium mt-1">
              Мониторинг действий и изменений
            </p>
          </div>
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="animate-spin text-slate-300" size={36} />
            <span className="text-sm font-medium text-slate-400">
              Загрузка событий…
            </span>
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
            <h2 className="text-2xl font-black text-slate-900">
              История событий контроля
            </h2>
            <p className="text-slate-400 text-sm font-medium mt-1">
              Мониторинг действий и изменений
            </p>
          </div>
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
              <AlertCircle size={32} className="text-red-400" />
            </div>
            <span className="text-sm font-bold text-red-500">
              Не удалось загрузить события
            </span>
            <span className="text-xs text-slate-400 max-w-sm text-center">
              {error}
            </span>
            <button
              onClick={fetchEvents}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-emerald-700 transition-all shadow-md shadow-emerald-200"
            >
              <RefreshCw size={14} />
              Повторить
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
            <h2 className="text-2xl font-black text-slate-900">
              История событий контроля
            </h2>
            <p className="text-slate-400 text-sm font-medium mt-1">
              Мониторинг действий и изменений
            </p>
          </div>
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
              <Activity size={28} className="text-slate-300" />
            </div>
            <span className="text-sm font-bold text-slate-500">
              Ещё нет событий
            </span>
            <span className="text-xs text-slate-400 max-w-xs text-center leading-relaxed">
              Когда менеджер выполнит какие-либо действия — изменит статус
              проекта, добавит оборудование, отправит рассылку или создаст
              новость — они отобразятся в этом журнале.
            </span>
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
        <div className="p-8 border-b border-slate-100 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              История событий контроля
            </h2>
            <p className="text-slate-400 text-sm font-medium mt-1">
              Мониторинг действий и изменений
            </p>
          </div>
          <button
            onClick={fetchEvents}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-500 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-100 disabled:opacity-40 transition-all"
            title="Обновить"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Обновить
          </button>
        </div>

        {/* Summary bar */}
        <div className="px-8 pt-6 pb-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <History size={14} className="text-slate-400" />
              Всего записей: {events.length}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="p-8 pt-4">
          {/* Table header */}
          <div className="hidden md:grid grid-cols-13 gap-4 px-4 py-3 bg-slate-50 rounded-xl mb-1">
            <div className="col-span-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Дата/время
            </div>
            <div className="col-span-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Действие
            </div>
            <div className="col-span-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Описание
            </div>
            <div className="col-span-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Кто
            </div>
            <div className="col-span-2 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">
              Тип
            </div>
          </div>

          {/* Rows */}
          <div className="space-y-1">
            {events.map((event) => (
              <div
                key={event.id}
                className="grid grid-cols-1 md:grid-cols-13 gap-3 md:gap-4 items-start md:items-center px-4 py-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200"
              >
                {/* Дата/время */}
                <div className="col-span-3 flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600">
                    {formatDateTime(event.createdAt)}
                  </span>
                </div>

                {/* Действие */}
                <div className="col-span-2 pl-6 md:pl-0">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-bold text-slate-700">
                    {getActionLabel(event.action)}
                  </span>
                </div>

                {/* Описание */}
                <div className="col-span-4 pl-6 md:pl-0">
                  <span className="text-sm font-medium text-slate-700 leading-snug">
                    {event.description}
                  </span>
                </div>

                {/* Кто */}
                <div className="col-span-2 pl-6 md:pl-0">
                  <span className="text-[11px] font-bold text-slate-600 truncate block">
                    {event.user?.companyName || event.user?.name || event.user?.email || '—'}
                  </span>
                </div>

                {/* Тип */}
                <div className="col-span-2 pl-6 md:pl-0 text-right">
                  <TypeBadge entityType={event.entityType} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitoringHistory;
