import React, { useState, useEffect, useCallback } from 'react';
import { Database, Download, Trash2, Plus, Clock, Loader2, AlertCircle, CheckCircle2, RefreshCw, AlertTriangle, RotateCcw, Upload } from 'lucide-react';

// ─── Types ───

interface BackupFile {
  filename: string;
  sizeBytes: number;
  sizeHuman: string;
  createdAt: string;
}

// ─── Presets for schedule ───

const SCHEDULE_PRESETS = [
  { label: 'Не запускать', desc: 'Ручное создание бэкапов', cron: '' },
  { label: 'Каждый час', desc: 'В начале каждого часа', cron: '0 * * * *' },
  { label: 'Каждые 6 часов', desc: 'В 00:00, 06:00, 12:00, 18:00', cron: '0 */6 * * *' },
  { label: 'Каждый день в 3:00', desc: 'Ночью, когда нагрузка минимальна', cron: '0 3 * * *' },
  { label: 'Каждую неделю (пн, 3:00)', desc: 'После выходных, перед рабочей неделей', cron: '0 3 * * 1' },
];

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

  // Upload
  const [uploading, setUploading] = useState(false);

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

  // ─── Upload backup ───

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('backup', file);

      const res = await fetch('/api/admin/backup/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      const data = await res.json();
      if (data?.success) {
        setMessage({ type: 'success', text: `Файл загружен: ${data.data?.filename || ''}` });
        loadData();
      } else {
        setMessage({ type: 'error', text: data?.error || 'Ошибка загрузки' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Ошибка сети' });
    } finally {
      setUploading(false);
      // Сбрасываем input, чтобы можно было загрузить тот же файл снова
      e.target.value = '';
    }
  }, [loadData]);

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

          {/* Upload backup card */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-sm font-black uppercase tracking-wider text-gray-600 mb-4 flex items-center gap-2">
              <Upload size={16} className="text-purple-600" />
              Загрузить бэкап
            </h2>
            <p className="text-xs text-gray-400 mb-5 leading-relaxed">
              Если портал развёрнут заново — загрузите <code className="text-purple-600 bg-purple-50 px-1 rounded">.sql</code> файл
              с локального компьютера, затем восстановите из него базу данных.
            </p>
            <label className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold text-sm rounded-2xl transition-all shadow-lg shadow-orange-200/50 cursor-pointer">
              <Upload size={18} />
              <span>Выбрать .sql файл</span>
              <input
                type="file"
                accept=".sql"
                className="hidden"
                disabled={uploading}
                onChange={handleUpload}
              />
            </label>
          </div>

          {/* Schedule card */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-sm font-black uppercase tracking-wider text-gray-600 mb-4 flex items-center gap-2">
              <Clock size={16} className="text-purple-600" />
              Расписание
            </h2>

            {/* Preset selector */}
            <div className="space-y-2 mb-4">
              {SCHEDULE_PRESETS.map(p => (
                <label
                  key={p.cron}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                    scheduleInput === p.cron
                      ? 'border-purple-300 bg-purple-50/50 text-purple-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="schedule"
                    checked={scheduleInput === p.cron}
                    onChange={() => setScheduleInput(p.cron)}
                    className="w-4 h-4 text-purple-600 accent-purple-600"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold">{p.label}</div>
                    {p.desc && (
                      <div className="text-[10px] text-gray-400 mt-0.5">{p.desc}</div>
                    )}
                  </div>
                  {p.cron && (
                    <code className="text-[9px] font-mono text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded shrink-0">
                      {p.cron}
                    </code>
                  )}
                </label>
              ))}

              {/* "Другое" — при выборе показывается поле ввода */}
              <label
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                  !SCHEDULE_PRESETS.some(p => p.cron === scheduleInput)
                    ? 'border-purple-300 bg-purple-50/50 text-purple-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <input
                  type="radio"
                  name="schedule"
                  checked={!SCHEDULE_PRESETS.some(p => p.cron === scheduleInput)}
                  onChange={() => {
                    if (scheduleInput === '' || SCHEDULE_PRESETS.some(p => p.cron === scheduleInput)) {
                      setScheduleInput('0 */2 * * *');
                    }
                  }}
                  className="w-4 h-4 text-purple-600 accent-purple-600"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold">Своё выражение</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">Указать cron вручную</div>
                </div>
                <code className="text-[9px] font-mono text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded shrink-0">
                  custom
                </code>
              </label>
            </div>

            {/* Custom cron input (when "Своё выражение" selected) */}
            {!SCHEDULE_PRESETS.some(p => p.cron === scheduleInput) && (
              <div className="mb-4 pl-1">
                <label className="block text-[10px] font-black uppercase tracking-wider text-gray-500 mb-1.5">
                  Cron-выражение
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={scheduleInput}
                    onChange={e => setScheduleInput(e.target.value)}
                    placeholder="0 */2 * * *  (каждые 2 часа)"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 font-mono focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all pr-8"
                  />
                  {scheduleInput && (
                    <button
                      onClick={() => setScheduleInput('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <span className="text-base leading-none">&times;</span>
                    </button>
                  )}
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {[
                    { label: '30 мин', cron: '*/30 * * * *' },
                    { label: '2 часа', cron: '0 */2 * * *' },
                    { label: '12:00 ежедневно', cron: '0 12 * * *' },
                    { label: 'Пн–пт 9:00', cron: '0 9 * * 1-5' },
                  ].map(p => (
                    <button
                      key={p.cron}
                      onClick={() => setScheduleInput(p.cron)}
                      className="px-2 py-1 text-[9px] font-bold bg-gray-100 text-gray-500 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Status + Save */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${schedule.enabled ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  {schedule.enabled ? scheduleInput : 'Неактивно'}
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
            {/* Информация для аварийного восстановления */}
            {!loading && backups.length > 0 && (
              <div className="px-6 py-3 bg-amber-50/50 border-b border-amber-100">
                <p className="text-[10px] text-amber-700 leading-relaxed">
                  📁 Файлы бэкапов хранятся на сервере в папке <code className="font-mono text-[9px] bg-amber-100 px-1 rounded">server/backups/</code>.
                  Если сервер недоступен — восстановите вручную через <code className="font-mono text-[9px] bg-amber-100 px-1 rounded">./restore.sh</code> в папке сервера.
                </p>
              </div>
            )}
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
