import { useState, useEffect } from 'react';
import {
  FileText,
  Send,
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Users,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// ВРЕМЕННЫЕ МОК-ДАННЫЕ
// ---------------------------------------------------------------------------
// TODO: Удалить, когда будет готов эндпоинт GET /api/manager/broadcast-log
// Бэкенд пока не имеет таблицы лога рассылок, поэтому используем заглушку.
// После внедрения бэкенда достаточно удалить этот блок, заменить вызов fetchLog
// и убрать флаг apiAvailable.
// ---------------------------------------------------------------------------

interface BroadcastEntry {
  id: number;
  sentAt: string;
  subject: string;
  recipients: string[];
  status: 'sent' | 'error';
  content: string;
}

const MOCK_BROADCASTS: BroadcastEntry[] = [
  {
    id: 1,
    sentAt: '2026-05-14T10:30:00Z',
    subject: 'Изменение условий сотрудничества',
    recipients: [
      'ooo-park@example.com',
      'ip-ivanov@example.com',
      'zao-tehno@example.com',
    ],
    status: 'sent',
    content:
      'Уважаемые партнёры! Обращаем ваше внимание на изменение условий сотрудничества с 1 июня 2026 года. Новые ставки комиссии и порядок расчётов описаны в приложенном документе. Просим ознакомиться в течение 10 рабочих дней.',
  },
  {
    id: 2,
    sentAt: '2026-05-13T15:00:00Z',
    subject: 'Приглашение на вебинар',
    recipients: ['ip-sokolov@example.com', 'ooo-vector@example.com'],
    status: 'sent',
    content:
      'Приглашаем вас на вебинар «Новые возможности платформы IPMATIKA», который состоится 20 мая в 14:00 (МСК). Ссылка для подключения будет направлена дополнительно. Продолжительность — 45 минут.',
  },
  {
    id: 3,
    sentAt: '2026-05-12T09:15:00Z',
    subject: 'Сбой в системе — обновление',
    recipients: ['ooo-lider@example.com'],
    status: 'error',
    content:
      'Произошёл сбой в системе электронного документооборота. Ведутся восстановительные работы. Ожидаемое время решения — 2 часа. Приносим извинения за доставленные неудобства.',
  },
  {
    id: 4,
    sentAt: '2026-05-11T08:45:00Z',
    subject: 'График работы в праздничные дни',
    recipients: [
      'ooo-park@example.com',
      'ip-ivanov@example.com',
      'zao-tehno@example.com',
      'ip-sokolov@example.com',
      'ooo-vector@example.com',
    ],
    status: 'sent',
    content:
      'Уважаемые партнёры! Сообщаем график работы в предстоящие праздничные дни: 9 мая — выходной, 10 мая — сокращённый день до 16:00. Техническая поддержка работает в штатном режиме.',
  },
];

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

// ---------------------------------------------------------------------------
// Компонент
// ---------------------------------------------------------------------------

const BroadcastJournal = () => {
  const [broadcasts, setBroadcasts] = useState<BroadcastEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [apiAvailable, setApiAvailable] = useState(false);

  // -----------------------------------------------------------------------
  // Загрузка данных
  // -----------------------------------------------------------------------
  // TODO: Когда бэкенд реализует GET /api/manager/broadcast-log,
  //       удалить fallback на MOCK_BROADCASTS и убрать флаг apiAvailable.
  // -----------------------------------------------------------------------

  const fetchLog = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/manager/broadcast-log', {
        credentials: 'include',
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setBroadcasts(data.data);
        setApiAvailable(true);
      } else {
        throw new Error('Неверный формат ответа');
      }
    } catch (err: any) {
      // Бэкенд ещё не реализован — показываем мок-данные
      console.warn(
        '[BroadcastJournal] API /api/manager/broadcast-log недоступен, используются демо-данные:',
        err.message,
      );
      setBroadcasts(MOCK_BROADCASTS);
      setApiAvailable(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLog();
  }, []);

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
  // Состояние: ошибка (когда даже мок-данные не загрузились — на всякий случай)
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

        {/* Баннер "API в разработке" — пока бэкенд не готов */}
        {!apiAvailable && (
          <div className="mx-8 mt-6 flex items-start gap-3 px-5 py-4 bg-amber-50 border border-amber-200 rounded-2xl">
            <Clock size={18} className="text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-amber-700">
                API в разработке
              </p>
              <p className="text-xs font-medium text-amber-600 mt-1 leading-relaxed">
                Эндпоинт <code className="bg-amber-100 px-1.5 rounded text-[11px]">GET /api/manager/broadcast-log</code>{' '}
                ещё не реализован. Ниже отображаются&nbsp;демонстрационные&nbsp;данные.
                После внедрения бэкенда здесь будет отображаться реальная история рассылок.
              </p>
            </div>
          </div>
        )}

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

                      {/* Получатели */}
                      <div className="col-span-3 pl-6 md:pl-0">
                        <div className="flex items-center gap-2">
                          <Users size={12} className="text-slate-400 shrink-0" />
                          <span className="text-xs font-bold text-slate-500">
                            {entry.recipients.length}{' '}
                            {entry.recipients.length === 1
                              ? 'получатель'
                              : entry.recipients.length < 5
                              ? 'получателя'
                              : 'получателей'}
                          </span>
                        </div>
                      </div>

                      {/* Статус */}
                      <div className="col-span-3 pl-6 md:pl-0 text-right">
                        {renderStatusBadge(entry.status)}
                      </div>
                    </button>

                    {/* Расширенный блок с содержимым письма и списком получателей */}
                    {isExpanded && (
                      <div className="mx-4 mb-3 px-5 py-5 bg-slate-50 rounded-2xl border border-slate-200 animate-in slide-in-from-top-1 duration-200">
                        {/* Содержимое письма */}
                        <div className="mb-5">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                            Содержание письма
                          </p>
                          <div className="bg-white rounded-xl px-4 py-3 border border-slate-100">
                            <p className="text-xs font-medium text-slate-700 leading-relaxed whitespace-pre-wrap">
                              {entry.content}
                            </p>
                          </div>
                        </div>

                        {/* Список получателей */}
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                            Получатели ({entry.recipients.length})
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {entry.recipients.map((email) => (
                              <span
                                key={email}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg border border-slate-100 text-[11px] font-medium text-slate-600"
                              >
                                <Send size={10} className="text-slate-400" />
                                {email}
                              </span>
                            ))}
                          </div>
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
