import React, { useState, useEffect, useCallback } from 'react';
import { Database, Download, Trash2, Plus, Clock, Loader2, AlertCircle, CheckCircle2, RefreshCw, AlertTriangle, RotateCcw } from 'lucide-react';

// ─── Types ───

interface BackupFile {
  filename: string;
  sizeBytes: number;
  sizeHuman: string;
  createdAt: string;
}

// ─── DbBackup ───

const DbBackup = () => {
  // Backups list
  const [backups, setBackups] = useState<BackupFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create backup
  const [creating, setCreating] = useState(false);

  // Schedule
  const [schedule, setSchedule] = useState<{ enabled: boolean; cron: string | null }>({ enabled: false, cron: null });
  const [scheduleInput, setScheduleInput] = useState('');
  const [savingSchedule, setSavingSchedule] = useState(false);

  // Messages
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Restore
  const [confirmRestoreFilename, setConfirmRestoreFilename] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(false);

  // ─── Load ───

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [backupRes, schedRes] = await Promise.all([
        fetch('/api/admin/backup/list', { credentials: 'include' }),
        fetch('/api/admin/backup/schedule', { credentials: 'include' }),
      ]);

      const backupData = await backupRes.json();
      const schedData = await schedRes.json();

      if (backupData?.success && Array.isArray(backupData.data)) {
        setBackups(backupData.data);
      }
      if (schedData?.success && schedData.data) {
        setSchedule(schedData.data);
        setScheduleInput(schedData.data.cron || '');
      }
    } catch {
      setError('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // Auto-dismiss message
  useEffect(() => {
    if (message?.type === 'success') {
      const t = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(t);
    }
  }, [message]);

  // ─── Create backup ───

  const handleCreate = useCallback(async () => {
    setCreating(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/backup/create', {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      if (data?.success) {
        setMessage({ type: 'success', text: `Бэкап создан: ${data.data?.filename || ''}` });
        loadData();
      } else {
        setMessage({ type: 'error', text: data?.error || 'Ошибка создания бэкапа' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Ошибка сети' });
    } finally {
      setCreating(false);
    }
  }, [loadData]);

  // ─── Delete backup ───

  const handleDelete = useCallback(async (filename: string) => {
    if (!window.confirm(`Удалить бэкап "${filename}"?`)) return;

    try {
      const res = await fetch(`/api/admin/backup/${encodeURIComponent(filename)}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (data?.success) {
        setMessage({ type: 'success', text: 'Бэкап удалён' });
        loadData();
      } else {
        setMessage({ type: 'error', text: data?.error || 'Ошибка удаления' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Ошибка сети' });
    }
  }, [loadData]);

  // ─── Download backup ───

  const handleDownload = useCallback((filename: string) => {
    const a = document.createElement('a');
    a.href = `/api/admin/backup/download/${encodeURIComponent(filename)}`;
    a.download = filename;
    a.click();
  }, []);

  // ─── Restore backup ───

  const handleRestore = useCallback(async () => {
    if (!confirmRestoreFilename) return;

    setRestoring(true);
    setMessage(null);
    setConfirmRestoreFilename(null);

    try {
      const res = await fetch(`/api/admin/backup/restore/${encodeURIComponent(confirmRestoreFilename)}`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      if (data?.success) {
        setMessage({ type: 'success', text: 'База данных восстановлена из бэкапа' });
      } else {
        setMessage({ type: 'error', text: data?.error || 'Ошибка восстановления' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Ошибка сети' });
    } finally {
      setRestoring(false);
    }
  }, [confirmRestoreFilename]);

  // ─── Save schedule ───

  const handleSaveSchedule = useCallback(async () => {
    setSavingSchedule(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/backup/schedule', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ cron: scheduleInput }),
      });
      const data = await res.json();
      if (data?.success) {
        setMessage({ type: 'success', text: 'Расписание обновлено' });
        setSchedule(data.data);
      } else {
        setMessage({ type: 'error', text: data?.error || 'Ошибка сохранения расписания' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Ошибка сети' });
    } finally {
      setSavingSchedule(false);
    }
  }, [scheduleInput]);

  // ─── Format size for download link ───

  const getDownloadUrl = (filename: string) => `/api/admin/backup/download/${encodeURIComponent(filename)}`;

  // ─── Render ───

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Бэкап <span className="text-purple-600">БД</span>
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Создание, скачивание и автоматическое резервное копирование базы данных
        </p>
      </div>

      {/* Toast */}
      {message && (
        <div className={`mb-6 flex items-center gap-3 px-5 py-3 rounded-2xl border shadow-lg animate-in fade-in slide-in-from-top-4 duration-300 ${
          message.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {message.type === 'success' ? <CheckCircle2 size={20} className="shrink-0" /> : <AlertCircle size={20} className="shrink-0" />}
          <span className="text-sm font-bold flex-1">{message.text}</span>
          <button onClick={() => setMessage(null)} className="p-1 rounded-lg hover:bg-black/5">&times;</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* ─── LEFT: Create + Schedule ─── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Create backup card */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-sm font-black uppercase tracking-wider text-gray-600 mb-4 flex items-center gap-2">
              <Plus size={16} className="text-purple-600" />
              Создать бэкап
            </h2>
            <p className="text-xs text-gray-400 mb-5 leading-relaxed">
              Создаёт полный дамп базы данных через <code className="text-purple-600 bg-purple-50 px-1 rounded">pg_dump</code>.
              Файл сохраняется на сервере и будет доступен для скачивания.
            </p>
            <button
              onClick={handleCreate}
              disabled={creating}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:from-gray-300 disabled:to-gray-300 text-white font-bold text-sm rounded-2xl transition-all shadow-lg shadow-purple-200/50 disabled:shadow-none"
            >
              {creating ? (
                <><Loader2 size={18} className="animate-spin" /> Создание...</>
              ) : (
                <><Database size={18} /> Создать бэкап сейчас</>
              )}
            </button>
          </div>

          {/* Schedule card */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-sm font-black uppercase tracking-wider text-gray-600 mb-4 flex items-center gap-2">
              <Clock size={16} className="text-purple-600" />
              Расписание
            </h2>

            <label className="block text-[10px] font-black uppercase tracking-wider text-gray-500 mb-1.5">
              Cron-выражение
            </label>
            <input
              type="text"
              value={scheduleInput}
              onChange={e => setScheduleInput(e.target.value)}
              placeholder='0 3 * * * (каждый день в 3:00)'
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 font-mono focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all mb-2"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${schedule.enabled ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  {schedule.enabled ? `Активно: ${schedule.cron}` : 'Неактивно'}
                </span>
              </div>
              <button
                onClick={handleSaveSchedule}
                disabled={savingSchedule}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:from-gray-300 disabled:to-gray-300 text-white font-bold text-xs rounded-xl transition-all shadow-md disabled:shadow-none"
              >
                {savingSchedule ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                <span>Сохранить</span>
              </button>
            </div>

            {/* Common presets */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-2">Быстрые预设</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Каждый час', cron: '0 * * * *' },
                  { label: 'Каждый день в 3:00', cron: '0 3 * * *' },
                  { label: 'Каждую неделю (пн, 3:00)', cron: '0 3 * * 1' },
                  { label: 'Отключить', cron: '' },
                ].map(p => (
                  <button
                    key={p.cron}
                    onClick={() => setScheduleInput(p.cron)}
                    className="px-3 py-1.5 text-[10px] font-bold bg-gray-100 text-gray-500 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ─── RIGHT: Backups list ─── */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-black uppercase tracking-wider text-gray-600 flex items-center gap-2">
                <Database size={16} className="text-purple-600" />
                Сохранённые бэкапы
                {backups.length > 0 && (
                  <span className="text-[10px] font-bold text-gray-400 ml-1">({backups.length})</span>
                )}
              </h2>
              <button
                onClick={loadData}
                disabled={loading}
                className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-purple-600 transition-all disabled:opacity-50"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>

            {/* Body */}
            {loading && backups.length === 0 ? (
              <div className="flex items-center justify-center p-16">
                <Loader2 size={28} className="animate-spin text-purple-600" />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <AlertCircle size={32} className="text-red-300 mb-3" />
                <p className="text-sm font-bold text-gray-400">{error}</p>
              </div>
            ) : backups.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <Database size={40} className="text-gray-200 mb-4" />
                <p className="text-sm font-bold text-gray-400">Нет сохранённых бэкапов</p>
                <p className="text-xs text-gray-300 mt-1">Нажмите «Создать бэкап сейчас» чтобы сделать первый дамп</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {backups.map(b => (
                  <div key={b.filename} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors">
                    {/* Icon */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-50 text-purple-600 shrink-0">
                      <Database size={18} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-slate-800 truncate">
                        {b.filename}
                      </div>
                      <div className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-3">
                        <span>{b.createdAt}</span>
                        <span className="text-gray-300">•</span>
                        <span>{b.sizeHuman}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <a
                        href={getDownloadUrl(b.filename)}
                        download={b.filename}
                        className="p-2.5 rounded-xl hover:bg-emerald-50 text-gray-400 hover:text-emerald-600 transition-all"
                        title="Скачать"
                      >
                        <Download size={16} />
                      </a>
                      <button
                        onClick={() => setConfirmRestoreFilename(b.filename)}
                        className="p-2.5 rounded-xl hover:bg-amber-50 text-gray-400 hover:text-amber-600 transition-all"
                        title="Восстановить БД из этого бэкапа"
                      >
                        <RotateCcw size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(b.filename)}
                        className="p-2.5 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all"
                        title="Удалить"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Confirm restore modal ─── */}
      {confirmRestoreFilename && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setConfirmRestoreFilename(null)} />
          <div className="relative bg-white rounded-3xl shadow-2xl border border-red-200 w-full max-w-md p-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-5">
                <AlertTriangle size={32} className="text-red-500" />
              </div>
              <h2 className="text-lg font-black text-slate-800 mb-2">Восстановление базы данных</h2>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">
                Вы уверены, что хотите восстановить базу данных из бэкапа
                <br />
                <span className="font-bold text-slate-700">{confirmRestoreFilename}</span>?
              </p>
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 w-full">
                <p className="text-xs font-bold text-red-700 leading-relaxed">
                  ⚠️ Все текущие данные будут заменены данными из бэкапа.
                  Это действие необратимо.
                </p>
              </div>
              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={() => setConfirmRestoreFilename(null)}
                  disabled={restoring}
                  className="flex-1 px-6 py-3 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-all disabled:opacity-50"
                >
                  Отмена
                </button>
                <button
                  onClick={handleRestore}
                  disabled={restoring}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:from-gray-300 disabled:to-gray-300 text-white font-bold text-sm rounded-xl transition-all shadow-lg disabled:shadow-none"
                >
                  {restoring ? (
                    <><Loader2 size={16} className="animate-spin" /> Восстановление...</>
                  ) : (
                    <><RotateCcw size={16} /> Восстановить</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DbBackup;
