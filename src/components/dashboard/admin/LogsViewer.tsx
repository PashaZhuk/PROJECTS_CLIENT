import React, { useState, useEffect, useCallback } from 'react';
import { Search, AlertCircle, Info, AlertTriangle, RefreshCw, X, Calendar } from 'lucide-react';
import api from '../../../api/ky';

interface LogEntry {
  level: 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
  userId?: number;
  email?: string;
  name?: string;        // 👈 добавлено
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

const LogsViewer = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [level, setLevel] = useState<string>('');
  const [search, setSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    // Устанавливаем текущую дату в формате YYYY-MM-DD
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

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

  const formatTimestamp = (ts: string) => {
    return new Date(ts).toLocaleString();
  };

  const clearDate = () => {
    // Устанавливаем текущую дату вместо очистки
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    setSelectedDate(`${yyyy}-${mm}-${dd}`);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
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

        {/* Календарь выбора даты – всегда текущая дата */}
        <div className="relative">
          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {selectedDate && (
            <button
              onClick={clearDate}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              title="Сбросить на сегодня"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setLevel('')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
              !level ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Все
          </button>
          <button
            onClick={() => setLevel('info')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
              level === 'info' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            Info
          </button>
          <button
            onClick={() => setLevel('warn')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
              level === 'warn' ? 'bg-yellow-600 text-white' : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
            }`}
          >
            Warn
          </button>
          <button
            onClick={() => setLevel('error')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
              level === 'error' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-700 hover:bg-red-100'
            }`}
          >
            Error
          </button>
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
                      {log.userId && <span className="text-slate-500">User ID: {log.userId}</span>}
                      {log.name && <span className="text-slate-500">Имя: {log.name}</span>}
                      {log.email && <span className="text-slate-500">Email: {log.email}</span>}
                      {log.ip && <span className="text-slate-500">IP: {log.ip}</span>}
                    </div>
                    <div className="text-sm font-medium break-words">
                      {log.message}
                    </div>
                    {log.projectId && (
                      <div className="mt-2 text-xs text-slate-500">
                        Project ID: {log.projectId}
                      </div>
                    )}
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