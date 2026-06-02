import { useState, useEffect, useCallback } from 'react';
import {
  FileText,
  Send,
  AlertCircle,
  CheckCircle2,
  Loader2,
  RefreshCw,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { getErrorMessage } from '../shared/UIHelpers';

// ---------------------------------------------------------------------------
// Типы
// ---------------------------------------------------------------------------

interface BroadcastEntry {
  id: number;
  subject: string;
  message: string;
  recipients: number;
  status: 'sent' | 'error';
  sentAt: string;
}

interface BroadcastLogResponse {
  success: boolean;
  data: BroadcastEntry[];
}

// ---------------------------------------------------------------------------
// Вспомогательные функции
// ---------------------------------------------------------------------------

const formatDate = (iso: string): string => {
  const d = new Date(iso);
  return d.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const truncateSubject = (s: string, max = 50): string =>
  s.length > max ? s.slice(0, max) + '…' : s;

const pluralizeRecipients = (count: number): string => {
  if (count === 1) return 'получатель';
  if (count >= 2 && count <= 4) return 'получателя';
  return 'получателей';
};

// ---------------------------------------------------------------------------
// Компонент
// ---------------------------------------------------------------------------

const BroadcastJournal = () => {
  const [broadcasts, setBroadcasts] = useState<BroadcastEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // -----------------------------------------------------------------------
  // Загрузка данных
  // -----------------------------------------------------------------------

  const fetchLog = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/manager/broadcast-log', {
        credentials: 'include',
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: BroadcastLogResponse = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setBroadcasts(json.data);
      } else {
        throw new Error('Неверный формат ответа');
      }
    } catch (err: any) {
      console.error('[BroadcastJournal] Ошибка загрузки:', err.message);
      setError(getErrorMessage(err, 'Не удалось загрузить журнал рассылок'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLog();
  }, [fetchLog]);

  // -----------------------------------------------------------------------
  // Render helpers
  // -----------------------------------------------------------------------

  const toggleExpand = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const renderStatusBadge = (status: 'sent' | 'error') => {
    if (status === 'sent') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold uppercase tracking-wider border border-emerald-200">
          <CheckCircle2 size={12} />
          Отправлено
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-[11px] font-bold uppercase tracking-wider border border-red-200">
        <AlertCircle size={12} />
        Ошибка
      </span>
    );
  };

  // -----------------------------------------------------------------------
  // Состояние: загрузка
  // -----------------------------------------------------------------------

  if (loading) {
    return (
      <div className="animate-in fade-in duration-500">
        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100">
            <h2 className="text-2xl font-black text-slate-900">
              Журнал рассылок
            </h2>
            <p className="text-slate-400 text-sm font-medium mt-1">
              История отправленных информационных писем
            </p>
          </div>
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-slate-300" size={36} />
            <span className="text-sm font-medium text-slate-400">
              Загрузка журнала рассылок…
            </span>
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // Состояние: ошибка
  // -----------------------------------------------------------------------

  if (error && broadcasts.length === 0) {
    return (
      <div className="animate-in fade-in duration-500">
        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100">
            <h2 className="text-2xl font-black text-slate-900">
              Журнал рассылок
            </h2>
            <p className="text-slate-400 text-sm font-medium mt-1">
              История отправленных информационных писем
            </p>
          </div>
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
              <AlertCircle size={32} className="text-red-400" />
            </div>
            <span className="text-sm font-bold text-red-500">
              Не удалось загрузить журнал рассылок
            </span>
            <span className="text-xs text-slate-400 max-w-sm text-center">
              {error}
            </span>
            <button
              onClick={fetchLog}
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
  // Основной рендер
  // -----------------------------------------------------------------------

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      {/* Карточка журнала */}
      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
        {/* Заголовок */}
        <div className="p-8 border-b border-slate-100 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              Журнал рассылок
            </h2>
            <p className="text-slate-400 text-sm font-medium mt-1">
              История отправленных информационных писем
            </p>
          </div>
          <button
            onClick={fetchLog}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-500 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-100 disabled:opacity-40 transition-all"
            title="Обновить"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Обновить
          </button>
        </div>

        {/* Пустое состояние */}
        {broadcasts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
              <Send size={28} className="text-slate-300" />
            </div>
            <span className="text-sm font-bold text-slate-500">
              Ещё не было рассылок
            </span>
            <span className="text-xs text-slate-400 max-w-xs text-center">
              Когда вы отправите информационное письмо через раздел «Доведение информации»,
              оно появится в этом журнале.
            </span>
          </div>
        )}

        {/* Таблица */}
        {broadcasts.length > 0 && (
          <div className="p-8">
            {/* Сводка */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <FileText size={14} className="text-slate-400" />
                Всего записей: {broadcasts.length}
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
                <CheckCircle2 size={14} />
                Успешно:{' '}
                {broadcasts.filter((b) => b.status === 'sent').length}
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-red-500">
                <AlertCircle size={14} />
                Ошибок:{' '}
                {broadcasts.filter((b) => b.status === 'error').length}
              </div>
            </div>

            {/* Заголовки таблицы */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 bg-slate-50 rounded-xl mb-1">
              <div className="col-span-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Дата
              </div>
              <div className="col-span-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Тема
              </div>
              <div className="col-span-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Получателей
              </div>
              <div className="col-span-3 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">
                Статус
              </div>
            </div>

            {/* Строки */}
            <div className="space-y-1">
              {broadcasts.map((entry) => {
                const isExpanded = expandedId === entry.id;
                return (
                  <div key={entry.id}>
                    {/* Основная строка (кликабельная) */}
                    <button
                      onClick={() => toggleExpand(entry.id)}
                      className="w-full grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-start md:items-center px-4 py-4 rounded-2xl hover:bg-slate-50 transition-all text-left border border-transparent hover:border-slate-200"
                    >
                      {/* Дата */}
                      <div className="col-span-2 flex items-center gap-2">
                        {isExpanded ? (
                          <ChevronDown
                            size={14}
                            className="text-slate-400 shrink-0"
                          />
                        ) : (
                          <ChevronRight
                            size={14}
                            className="text-slate-300 shrink-0"
                          />
                        )}
                        <span className="text-xs font-bold text-slate-600">
                          {formatDate(entry.sentAt)}
                        </span>
                      </div>

                      {/* Тема */}
                      <div className="col-span-4 pl-6 md:pl-0">
                        <span className="text-sm font-bold text-slate-800">
                          {truncateSubject(entry.subject)}
                        </span>
                      </div>

                      {/* Получателей (количество) */}
                      <div className="col-span-3 pl-6 md:pl-0">
                        <div className="flex items-center gap-2">
                          <Send size={12} className="text-slate-400 shrink-0" />
                          <span className="text-xs font-bold text-slate-500">
                            {entry.recipients}{' '}
                            {pluralizeRecipients(entry.recipients)}
                          </span>
                        </div>
                      </div>

                      {/* Статус */}
                      <div className="col-span-3 pl-6 md:pl-0 text-right">
                        {renderStatusBadge(entry.status)}
                      </div>
                    </button>

                    {/* Расширенный блок с полным текстом письма */}
                    {isExpanded && (
                      <div className="mx-4 mb-3 px-5 py-5 bg-slate-50 rounded-2xl border border-slate-200 animate-in slide-in-from-top-1 duration-200">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                            Содержание письма
                          </p>
                          <div className="bg-white rounded-xl px-4 py-3 border border-slate-100">
                            <p className="text-xs font-medium text-slate-700 leading-relaxed whitespace-pre-wrap">
                              {entry.message}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center gap-2 text-[11px] font-medium text-slate-400">
                          <Send size={12} className="text-slate-300" />
                          Получателей: {entry.recipients}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BroadcastJournal;
