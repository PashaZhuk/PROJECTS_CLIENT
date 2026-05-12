import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, AlertCircle, Info, AlertTriangle, RefreshCw, Calendar, X } from 'lucide-react';
import api from '../../../api/ky';

interface LogEntry {
  level: 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
  userId?: number;
  email?: string;
  name?: string;
  companyName?: string;
  displayName?: string;
  ip?: string;
  [key: string]: any;
}

const levelColors = {
  info: 'bg-blue-100 text-blue-700 border-blue-200',
  warn: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  error: 'bg-red-100 text-red-700 border-red-200',
};

const levelIcons = {
  info: <Info size={16} />,
  warn: <AlertTriangle size={16} />,
  error: <AlertCircle size={16} />,
};

const toDisplayDate = (isoDate: string): string => {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('-');
  return `${day}.${month}.${year}`;
};

const toIsoDate = (displayDate: string): string => {
  const match = displayDate.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!match) return '';
  const [, day, month, year] = match;
  return `${year}-${month}-${day}`;
};

const LogsViewer = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [level, setLevel] = useState<string>('');
  const [search, setSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [displayDate, setDisplayDate] = useState<string>(toDisplayDate(selectedDate));
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const datePickerRef = useRef<HTMLInputElement>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (level) params.append('level', level);
      if (search) params.append('search', search);
      if (selectedDate) params.append('date', selectedDate);
      params.append('limit', '500');
      const response: any = await api.get(`admin/logs?${params.toString()}`).json();
      setLogs(response.logs || []);
      setTotal(response.returned || 0);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setLoading(false);
    }
  }, [level, search, selectedDate]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleNativeDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newIso = e.target.value;
    if (newIso) {
      setSelectedDate(newIso);
      setDisplayDate(toDisplayDate(newIso));
    }
  };

  const handleManualDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '');
    if (raw.length > 8) raw = raw.slice(0, 8);
    let formatted = '';
    if (raw.length > 0) {
      formatted = raw.slice(0, 2);
      if (raw.length > 2) formatted += '.' + raw.slice(2, 4);
      if (raw.length > 4) formatted += '.' + raw.slice(4, 8);
    }
    setDisplayDate(formatted);
    if (raw.length === 8) {
      const iso = toIsoDate(formatted);
      if (iso && !isNaN(new Date(iso).getTime())) {
        setSelectedDate(iso);
      }
    }
  };

  const handleManualDateBlur = () => {
    if (!/^\d{2}\.\d{2}\.\d{4}$/.test(displayDate)) {
      setDisplayDate(toDisplayDate(selectedDate));
    }
  };

  const openCalendar = () => {
    if (datePickerRef.current) {
      try {
        if ('showPicker' in HTMLInputElement.prototype) {
          datePickerRef.current.showPicker();
        } else {
          datePickerRef.current.click();
        }
      } catch (err) {
        datePickerRef.current.click();
      }
    }
  };

  const getUserDisplay = (log: LogEntry) => {
    if (log.displayName) return log.displayName;
    if (log.companyName) return log.companyName;
    if (log.name) return log.name;
    return `User ${log.userId || '?'}`;
  };

  const formatTimestamp = (ts: string) => {
    return new Date(ts).toLocaleString();
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      <style>{`
        input[type="date"]::-webkit-clear-button {
          display: none;
        }
      `}</style>

      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Логи системы</h2>
          <p className="text-sm text-slate-500 mt-1">Последние события и ошибки</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            title="Обновить"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Поиск по логам (по тексту)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="relative w-44">
          <input
            ref={datePickerRef}
            type="date"
            value={selectedDate}
            onChange={handleNativeDateChange}
            className="absolute opacity-0 pointer-events-none w-0 h-0"
            style={{ top: '50%', left: '20px' }}
          />
          <div className="relative flex items-center">
            <button
              type="button"
              onClick={openCalendar}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors z-10"
            >
              <Calendar size={18} />
            </button>
            <input
              type="text"
              placeholder="ДД.ММ.ГГГГ"
              value={displayDate}
              onChange={handleManualDateChange}
              onBlur={handleManualDateBlur}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="flex gap-2">
          {['', 'info', 'warn', 'error'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevel(lvl)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                level === lvl 
                  ? (lvl === '' ? 'bg-slate-900 text-white' : 
                     lvl === 'info' ? 'bg-blue-600 text-white' : 
                     lvl === 'warn' ? 'bg-yellow-600 text-white' : 'bg-red-600 text-white')
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {lvl === '' ? 'Все' : lvl.charAt(0).toUpperCase() + lvl.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto p-4">
        {loading && (
          <div className="flex justify-center py-12">
            <RefreshCw className="animate-spin text-slate-400" size={32} />
          </div>
        )}
        {!loading && logs.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            Логи не найдены
          </div>
        )}
        {!loading && logs.length > 0 && (
          <div className="space-y-3">
            {logs.map((log, idx) => (
              <div
                key={idx}
                className={`border rounded-xl p-4 ${levelColors[log.level]} bg-opacity-30`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{levelIcons[log.level]}</div>
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-3 text-xs font-mono mb-2">
                      <span className="text-slate-500">{formatTimestamp(log.timestamp)}</span>
                      {log.userId && <span className="text-slate-500">ID: {log.userId}</span>}
                      {getUserDisplay(log) && <span className="text-slate-500">Пользователь: {getUserDisplay(log)}</span>}
                      {log.email && <span className="text-slate-500">Email: {log.email}</span>}
                      {log.ip && <span className="text-slate-500">IP: {log.ip}</span>}
                    </div>
                    <div className="text-sm font-medium break-words">
                      {log.message}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="text-right text-xs text-slate-400 pt-4">
              Показано {logs.length} из {total} (последних)
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogsViewer;