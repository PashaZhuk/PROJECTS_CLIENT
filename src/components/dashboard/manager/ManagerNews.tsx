import { useState, useEffect, useCallback } from 'react';
import {
  Newspaper,
  Plus,
  ExternalLink,
  Pencil,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle2,
  X,
  Image,
  Link,
} from 'lucide-react';
import { getErrorMessage } from '../shared/UIHelpers';

// ─── Types ───────────────────────────────────────────────────────────────────

interface NewsItem {
  id: number;
  title: string;
  link: string;
  imageUrl: string;
  createdAt: string;
}

interface NewsFormData {
  title: string;
  link: string;
  imageUrl: string;
}

interface Toast {
  id: number;
  type: 'success' | 'error';
  message: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const API_PREFIX = '/api/manager/news';

const EMPTY_FORM: NewsFormData = {
  title: '',
  link: '',
  imageUrl: '',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const apiFetch = async (url: string, options?: RequestInit) => {
  const res = await fetch(url, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.message || body.error || 'Ошибка запроса');
  }
  if (!body.success) {
    throw new Error(body.message || body.error || 'Ошибка сервера');
  }
  return body.data;
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
};

let toastIdCounter = 0;

// ─── Toast Component ─────────────────────────────────────────────────────────

const ToastItem = ({ toast, onDismiss }: { toast: Toast; onDismiss: (id: number) => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div
      className={`flex items-center gap-3 px-5 py-3 rounded-2xl shadow-lg border backdrop-blur-sm animate-in slide-in-from-top-2 duration-300 ${
        toast.type === 'success'
          ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
          : 'bg-red-50 border-red-200 text-red-700'
      }`}
    >
      {toast.type === 'success' ? (
        <CheckCircle2 size={18} className="shrink-0" />
      ) : (
        <AlertCircle size={18} className="shrink-0" />
      )}
      <span className="text-xs font-bold">{toast.message}</span>
      <button onClick={() => onDismiss(toast.id)} className="ml-2 p-1 hover:opacity-60 transition-opacity">
        <X size={14} />
      </button>
    </div>
  );
};

// ─── News Modal ──────────────────────────────────────────────────────────────

interface NewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: NewsFormData) => Promise<void>;
  saving: boolean;
  initialData?: NewsItem | null;
}

const NewsModal = ({ isOpen, onClose, onSave, saving, initialData }: NewsModalProps) => {
  const [form, setForm] = useState<NewsFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof NewsFormData, string>>>({});

  useEffect(() => {
    if (isOpen) {
      setForm(initialData ? { title: initialData.title, link: initialData.link, imageUrl: initialData.imageUrl || '' } : EMPTY_FORM);
      setErrors({});
    }
  }, [isOpen, initialData]);

  const handleChange = (field: keyof NewsFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof NewsFormData, string>> = {};
    if (!form.title.trim()) newErrors.title = 'Обязательное поле';
    if (!form.link.trim()) newErrors.link = 'Обязательное поле';
    else if (!/^https?:\/\/.+/.test(form.link.trim())) newErrors.link = 'Введите корректный URL (http/https)';
    if (form.imageUrl.trim() && !/^https?:\/\/.+/.test(form.imageUrl.trim())) {
      newErrors.imageUrl = 'Введите корректный URL (http/https)';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSave(form);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      {/* Modal */}
      <div className="relative bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-8 py-6 border-b border-slate-100 rounded-t-[2.5rem]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
              <Newspaper size={18} className="text-emerald-600" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">{initialData ? 'Редактировать новость' : 'Добавить новость'}</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                {initialData ? 'Изменение записи' : 'Новая запись'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
              Заголовок <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Заголовок новости"
              className={`w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 ${
                errors.title ? 'ring-2 ring-red-300 bg-red-50' : ''
              }`}
            />
            {errors.title && (
              <p className="text-[10px] font-bold text-red-500 mt-1">{errors.title}</p>
            )}
          </div>

          {/* Link URL */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
              Ссылка <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Link
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="url"
                value={form.link}
                onChange={(e) => handleChange('link', e.target.value)}
                placeholder="https://example.com/news"
                className={`w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 ${
                  errors.link ? 'ring-2 ring-red-300 bg-red-50' : ''
                }`}
              />
            </div>
            {errors.link && (
              <p className="text-[10px] font-bold text-red-500 mt-1">{errors.link}</p>
            )}
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
              URL изображения
            </label>
            <div className="relative">
              <Image
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="url"
                value={form.imageUrl}
                onChange={(e) => handleChange('imageUrl', e.target.value)}
                placeholder="https://example.com/image.jpg (необязательно)"
                className={`w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 ${
                  errors.imageUrl ? 'ring-2 ring-red-300 bg-red-50' : ''
                }`}
              />
            </div>
            {errors.imageUrl && (
              <p className="text-[10px] font-bold text-red-500 mt-1">{errors.imageUrl}</p>
            )}
            {form.imageUrl && !errors.imageUrl && (
              <div className="mt-3 rounded-xl overflow-hidden border border-slate-200">
                <img
                  src={form.imageUrl}
                  alt="Preview"
                  className="w-full h-32 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-6 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-all disabled:opacity-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 disabled:opacity-40 transition-all shadow-lg shadow-emerald-200"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : initialData ? <Pencil size={16} /> : <Plus size={16} />}
              {saving ? 'Сохранение...' : initialData ? 'Сохранить' : 'Добавить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Delete Confirm Modal ────────────────────────────────────────────────────

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, loading }: ConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl w-full max-w-sm animate-in zoom-in-95 duration-200">
        <div className="px-8 py-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
              <AlertCircle size={18} className="text-red-600" />
            </div>
            <h3 className="text-lg font-black text-slate-900">{title}</h3>
          </div>
          <p className="text-sm font-medium text-slate-500 leading-relaxed">{message}</p>
        </div>
        <div className="flex items-center justify-end gap-3 px-8 py-5 border-t border-slate-100">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-all disabled:opacity-50"
          >
            Отмена
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-700 disabled:opacity-40 transition-all shadow-lg shadow-red-200"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
            {loading ? 'Удаление...' : 'Удалить'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── ManagerNews Component ───────────────────────────────────────────────────

const ManagerNews = () => {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Modal state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<NewsItem | null>(null);

  // Delete confirm state
  const [deleteTarget, setDeleteTarget] = useState<NewsItem | null>(null);

  // Toast state
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((type: 'success' | 'error', message: string) => {
    const id = ++toastIdCounter;
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch news
  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch(API_PREFIX);
      setItems(Array.isArray(data) ? data : []);
    } catch (err: any) {
      addToast('error', getErrorMessage(err, 'Ошибка загрузки новостей'));
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // Add news
  const handleAdd = async (formData: NewsFormData) => {
    setActionLoading(true);
    try {
      await apiFetch(API_PREFIX, {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      addToast('success', 'Новость добавлена');
      setAddModalOpen(false);
      fetchNews();
    } catch (err: any) {
      addToast('error', getErrorMessage(err, 'Ошибка сохранения'));
    } finally {
      setActionLoading(false);
    }
  };

  // Edit news
  const handleEdit = async (formData: NewsFormData) => {
    if (!editItem) return;
    setActionLoading(true);
    try {
      await apiFetch(`${API_PREFIX}/${editItem.id}`, {
        method: 'PUT',
        body: JSON.stringify(formData),
      });
      addToast('success', `«${formData.title}» обновлена`);
      setEditItem(null);
      fetchNews();
    } catch (err: any) {
      addToast('error', getErrorMessage(err, 'Ошибка сохранения'));
    } finally {
      setActionLoading(false);
    }
  };

  // Delete news
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      await apiFetch(`${API_PREFIX}/${deleteTarget.id}`, { method: 'DELETE' });
      addToast('success', `«${deleteTarget.title}» удалена`);
      setDeleteTarget(null);
      fetchNews();
    } catch (err: any) {
      addToast('error', getErrorMessage(err, 'Ошибка удаления'));
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-6 w-full max-w-full">
      {/* Toasts */}
      {toasts.length > 0 && (
        <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 max-w-sm">
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} onDismiss={dismissToast} />
          ))}
        </div>
      )}

      {/* Header Card */}
      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center shadow-inner">
              <Newspaper size={28} className="text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">Новости портала</h2>
              <p className="text-slate-400 text-sm font-medium mt-1">
                {loading ? 'Загрузка...' : `Всего: ${items.length} новостей`}
              </p>
            </div>
          </div>
          <button
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
          >
            <Plus size={16} />
            Добавить новость
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="px-8 py-20 text-center">
            <div className="flex flex-col items-center gap-4">
              <Loader2 size={32} className="animate-spin text-slate-300" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Загрузка...
              </span>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="px-8 py-20 text-center">
            <div className="flex flex-col items-center gap-3">
              <Newspaper size={40} className="text-slate-200" />
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                Новостей пока нет
              </span>
              <button
                onClick={() => setAddModalOpen(true)}
                className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 underline"
              >
                Добавить первую новость
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group relative bg-white rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-lg transition-all overflow-hidden"
                >
                  {/* Image */}
                  {item.imageUrl && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block aspect-video overflow-hidden bg-slate-100"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </a>
                  )}

                  {/* Content */}
                  <div className="p-5">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group/link"
                    >
                      <h3 className="text-base font-black text-slate-900 group-hover/link:text-emerald-600 transition-colors flex items-start gap-2">
                        <span className="flex-1">{item.title}</span>
                        <ExternalLink size={14} className="shrink-0 mt-1 text-slate-300 group-hover/link:text-emerald-400 transition-colors" />
                      </h3>
                    </a>

                    {/* Link preview */}
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 text-[10px] font-bold text-slate-400 hover:text-emerald-600 truncate max-w-full transition-colors"
                    >
                      {item.link}
                    </a>

                    {/* Date + Actions */}
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {formatDate(item.createdAt)}
                      </span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setEditItem(item);
                          }}
                          disabled={actionLoading}
                          className="p-2 rounded-lg text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 transition-all disabled:opacity-30"
                          title="Редактировать новость"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setDeleteTarget(item);
                          }}
                          disabled={actionLoading}
                          className="p-2 rounded-lg text-slate-300 hover:text-red-600 hover:bg-red-50 transition-all disabled:opacity-30"
                          title="Удалить новость"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Modal */}
      <NewsModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSave={handleAdd}
        saving={actionLoading}
      />

      {/* Edit Modal */}
      <NewsModal
        isOpen={!!editItem}
        onClose={() => setEditItem(null)}
        onSave={handleEdit}
        saving={actionLoading}
        initialData={editItem}
      />

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Удалить новость"
        message={
          deleteTarget
            ? `Вы уверены, что хотите удалить новость «${deleteTarget.title}»? Это действие необратимо.`
            : ''
        }
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={actionLoading}
      />
    </div>
  );
};

export default ManagerNews;
