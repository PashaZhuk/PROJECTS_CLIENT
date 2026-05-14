import { useState, useEffect, useCallback } from 'react';
import {
  Database,
  Plus,
  Search,
  Filter,
  Pencil,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  RotateCcw,
  X,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Equipment {
  id: number;
  name: string;
  accountingType: string;
  purpose: string;
  serialNumber: string;
  macAddress: string;
  issueDate: string;
  issuedTo: string;
  issuedToWhere: string;
  comments: string;
  category: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

interface EquipmentFormData {
  name: string;
  accountingType: string;
  purpose: string;
  serialNumber: string;
  macAddress: string;
  issueDate: string;
  issuedTo: string;
  issuedToWhere: string;
  comments: string;
  category: string;
  status: string;
}

interface Toast {
  id: number;
  type: 'success' | 'error';
  message: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const ACCOUNTING_TYPES = ['МС', 'ОС', 'MAC адрес', 'вне учета'];

const CATEGORIES = ['ВКС', 'IP ТЕЛЕФОНЫ', 'Сетевое оборудование', 'IP АТС', 'IP шлюзы', 'Прочее'];

const STATUS_OPTIONS: { value: Equipment['status']; label: string }[] = [
  { value: 'in_stock', label: 'В наличии' },
  { value: 'issued', label: 'Выдано' },
  { value: 'sold', label: 'Продано' },
  { value: 'repair', label: 'В ремонте' },
  { value: 'decommissioned', label: 'Списано' },
];

const STATUS_STYLES: Record<string, string> = {
  in_stock: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  issued: 'bg-blue-50 text-blue-600 border-blue-100',
  sold: 'bg-purple-50 text-purple-600 border-purple-100',
  repair: 'bg-amber-50 text-amber-600 border-amber-100',
  decommissioned: 'bg-red-50 text-red-600 border-red-100',
};

const STATUS_LABELS: Record<string, string> = {
  in_stock: 'В наличии',
  issued: 'Выдано',
  sold: 'Продано',
  repair: 'В ремонте',
  decommissioned: 'Списано',
};

const API_PREFIX = '/api/manager/equipment';

const EMPTY_FORM: EquipmentFormData = {
  name: '',
  accountingType: '',
  purpose: '',
  serialNumber: '',
  macAddress: '',
  issueDate: '',
  issuedTo: '',
  issuedToWhere: '',
  comments: '',
  category: '',
  status: 'in_stock',
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
    return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return dateStr;
  }
};

let toastIdCounter = 0;

// ─── Status Badge ────────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: string }) => (
  <span
    className={`inline-block px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
      STATUS_STYLES[status] || 'bg-slate-50 text-slate-600 border-slate-100'
    }`}
  >
    {STATUS_LABELS[status] || status}
  </span>
);

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

// ─── Modal ────────────────────────────────────────────────────────────────────

interface EquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EquipmentFormData) => Promise<void>;
  initialData?: Equipment | null;
  saving: boolean;
}

const EquipmentModal = ({ isOpen, onClose, onSave, initialData, saving }: EquipmentModalProps) => {
  const [form, setForm] = useState<EquipmentFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof EquipmentFormData, string>>>({});

  const isEditing = !!initialData;

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setForm({
          name: initialData.name || '',
          accountingType: initialData.accountingType || '',
          purpose: initialData.purpose || '',
          serialNumber: initialData.serialNumber || '',
          macAddress: initialData.macAddress || '',
          issueDate: initialData.issueDate || '',
          issuedTo: initialData.issuedTo || '',
          issuedToWhere: initialData.issuedToWhere || '',
          comments: initialData.comments || '',
          category: initialData.category || '',
          status: initialData.status || 'in_stock',
        });
      } else {
        setForm(EMPTY_FORM);
      }
      setErrors({});
    }
  }, [isOpen, initialData]);

  const handleChange = (field: keyof EquipmentFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof EquipmentFormData, string>> = {};
    if (!form.name.trim()) newErrors.name = 'Обязательное поле';
    if (!form.category) newErrors.category = 'Выберите категорию';
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
      <div className="relative bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-8 py-6 border-b border-slate-100 rounded-t-[2.5rem]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
              <Database size={18} className="text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">
                {isEditing ? 'Редактировать оборудование' : 'Добавить оборудование'}
              </h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                {isEditing ? `ID: ${initialData!.id}` : 'Новая запись'}
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
          <div className="grid grid-cols-2 gap-6">
            {/* Наименование */}
            <div className="col-span-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Наименование <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Наименование оборудования"
                className={`w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-purple-500 ${
                  errors.name ? 'ring-2 ring-red-300 bg-red-50' : ''
                }`}
              />
              {errors.name && (
                <p className="text-[10px] font-bold text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            {/* Категория */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Категория <span className="text-red-400">*</span>
              </label>
              <select
                value={form.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className={`w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-purple-500 ${
                  errors.category ? 'ring-2 ring-red-300 bg-red-50' : ''
                }`}
              >
                <option value="">Выберите категорию</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-[10px] font-bold text-red-500 mt-1">{errors.category}</p>
              )}
            </div>

            {/* Учёт */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Учёт
              </label>
              <select
                value={form.accountingType}
                onChange={(e) => handleChange('accountingType', e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Не выбрано</option>
                {ACCOUNTING_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Статус */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Статус
              </label>
              <select
                value={form.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-purple-500"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Предназначение */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Предназначение
              </label>
              <input
                type="text"
                value={form.purpose}
                onChange={(e) => handleChange('purpose', e.target.value)}
                placeholder="Назначение"
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Серийный номер */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Серийный номер
              </label>
              <input
                type="text"
                value={form.serialNumber}
                onChange={(e) => handleChange('serialNumber', e.target.value)}
                placeholder="SN"
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* MAC адрес */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                MAC адрес
              </label>
              <input
                type="text"
                value={form.macAddress}
                onChange={(e) => handleChange('macAddress', e.target.value)}
                placeholder="XX:XX:XX:XX:XX:XX"
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Дата выдачи */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Дата выдачи
              </label>
              <input
                type="date"
                value={form.issueDate}
                onChange={(e) => handleChange('issueDate', e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Кому выдано */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Кому выдано
              </label>
              <input
                type="text"
                value={form.issuedTo}
                onChange={(e) => handleChange('issuedTo', e.target.value)}
                placeholder="ФИО или название организации"
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Куда выдано */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Куда выдано
              </label>
              <input
                type="text"
                value={form.issuedToWhere}
                onChange={(e) => handleChange('issuedToWhere', e.target.value)}
                placeholder="Локация / адрес"
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Комментарии */}
            <div className="col-span-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Комментарии
              </label>
              <textarea
                value={form.comments}
                onChange={(e) => handleChange('comments', e.target.value)}
                placeholder="Дополнительная информация..."
                rows={3}
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-purple-500 resize-none"
              />
            </div>
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
              className="flex items-center gap-2 px-8 py-3 bg-purple-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-purple-700 disabled:opacity-40 transition-all shadow-lg shadow-purple-200"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Database size={16} />}
              {saving ? 'Сохранение...' : isEditing ? 'Сохранить' : 'Добавить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Category Accordion Section ──────────────────────────────────────────────

interface CategorySectionProps {
  category: string;
  items: Equipment[];
  expanded: boolean;
  onToggle: () => void;
  onEdit: (item: Equipment) => void;
  onDelete: (item: Equipment) => void;
  actionLoading: boolean;
}

const CategorySection = ({
  category,
  items,
  expanded,
  onToggle,
  onEdit,
  onDelete,
  actionLoading,
}: CategorySectionProps) => {
  return (
    <div className="border-b border-slate-100 last:border-b-0">
      {/* Accordion Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-8 py-5 hover:bg-slate-50/50 transition-colors text-left group"
      >
        <div className="flex items-center gap-3">
          <div
            className={`transition-transform duration-200 ${expanded ? 'rotate-0' : '-rotate-90'}`}
          >
            <ChevronDown size={18} className="text-slate-400" />
          </div>
          <span className="text-base font-black text-slate-900">{category}</span>
          <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-[10px] font-black text-slate-500">
            {items.length}
          </span>
        </div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {expanded ? 'Свернуть' : 'Развернуть'}
        </span>
      </button>

      {/* Accordion Body */}
      {expanded && (
        <div className="overflow-x-auto animate-in slide-in-from-top-1 duration-200">
          {items.length === 0 ? (
            <div className="px-8 py-8 text-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                Нет оборудования в этой категории
              </span>
            </div>
          ) : (
            <table className="w-full text-left table-fixed">
              <thead className="bg-slate-50/80">
                <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <th className="px-6 py-4 text-left w-[20%]">Наименование</th>
                  <th className="px-4 py-4 text-left w-[6%]">Учёт</th>
                  <th className="px-4 py-4 text-left w-[8%]">Предназн.</th>
                  <th className="px-4 py-4 text-left w-[10%]">Серийный №</th>
                  <th className="px-4 py-4 text-left w-[10%]">MAC адрес</th>
                  <th className="px-4 py-4 text-left w-[9%] whitespace-nowrap">Статус</th>
                  <th className="px-4 py-4 text-left w-[8%] whitespace-nowrap">Дата выдачи</th>
                  <th className="px-4 py-4 text-left w-[9%] whitespace-nowrap">Кому выдано</th>
                  <th className="px-4 py-4 text-left w-[9%] whitespace-nowrap">Куда выдано</th>
                  <th className="px-4 py-4 text-left w-[6%]">Комм.</th>
                  <th className="px-4 py-4 text-center w-[5%]"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {items.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => onEdit(item)}
                    className="hover:bg-purple-50/30 cursor-pointer transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-slate-900 truncate max-w-[350px]">
                        {item.name}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-[11px] font-bold text-slate-600">
                        {item.accountingType || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-[11px] text-slate-500 truncate block max-w-[180px]">
                        {item.purpose || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-[11px] font-mono font-bold text-slate-600">
                        {item.serialNumber || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-[11px] font-mono font-bold text-slate-600">
                        {item.macAddress || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-[11px] font-bold text-slate-500">
                        {formatDate(item.issueDate)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-[11px] text-slate-600 truncate block max-w-[180px]">
                        {item.issuedTo || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-[11px] text-slate-600 truncate block max-w-[180px]">
                        {item.issuedToWhere || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-[11px] text-slate-500 truncate block max-w-[200px]" title={item.comments || ''}>
                        {item.comments || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(item);
                          }}
                          className="p-2 rounded-lg text-slate-300 hover:text-purple-600 hover:bg-purple-50 transition-all opacity-0 group-hover:opacity-100"
                          title="Редактировать"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(item);
                          }}
                          disabled={actionLoading}
                          className="p-2 rounded-lg text-slate-300 hover:text-red-600 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30"
                          title="Удалить"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

// ─── EquipmentRegister Component ─────────────────────────────────────────────

const EquipmentRegister = () => {
  // Data state
  const [items, setItems] = useState<Equipment[]>([]);
  const [categories, setCategories] = useState<string[]>(CATEGORIES);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Accordion state — all expanded by default
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(() =>
    CATEGORIES.reduce((acc, cat) => ({ ...acc, [cat]: true }), {}),
  );

  // Loading
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Equipment | null>(null);

  // Toast
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((type: 'success' | 'error', message: string) => {
    const id = ++toastIdCounter;
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch categories on mount
  useEffect(() => {
    (async () => {
      try {
        const data = await apiFetch('/api/manager/equipment/categories');
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
        }
      } catch {
        // fallback to static list
      }
    })();
  }, []);

  // Fetch all equipment (no pagination)
  const fetchEquipment = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (categoryFilter) params.set('category', categoryFilter);
      if (statusFilter) params.set('status', statusFilter);
      if (debouncedSearch) params.set('search', debouncedSearch);
      params.set('perPage', '500');

      const data = await apiFetch(`${API_PREFIX}?${params.toString()}`);
      const fetchedItems: Equipment[] = data.items || data || [];
      setItems(Array.isArray(fetchedItems) ? fetchedItems : []);
    } catch (err: any) {
      addToast('error', err.message || 'Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, statusFilter, debouncedSearch, addToast]);

  useEffect(() => {
    fetchEquipment();
  }, [fetchEquipment]);

  // Group items by category (preserving CATEGORIES order)
  const groupedItems = CATEGORIES.reduce(
    (acc, cat) => {
      const matched = items.filter((item) => item.category === cat);
      // Also catch any items whose category is in the dynamic categories list but not in CATEGORIES
      acc[cat] = matched;
      return acc;
    },
    {} as Record<string, Equipment[]>,
  );

  // Also handle items that belong to categories not in the predefined list
  const otherCategories = items
    .map((item) => item.category)
    .filter((cat, idx, arr) => cat && arr.indexOf(cat) === idx && !CATEGORIES.includes(cat));

  otherCategories.forEach((cat) => {
    if (!groupedItems[cat]) {
      groupedItems[cat] = items.filter((item) => item.category === cat);
    }
  });

  const totalCount = items.length;

  // CRUD handlers
  const handleSave = async (formData: EquipmentFormData) => {
    setActionLoading(true);
    try {
      if (editingItem) {
        await apiFetch(`${API_PREFIX}/${editingItem.id}`, {
          method: 'PUT',
          body: JSON.stringify(formData),
        });
        addToast('success', 'Оборудование обновлено');
      } else {
        await apiFetch(API_PREFIX, {
          method: 'POST',
          body: JSON.stringify(formData),
        });
        addToast('success', 'Оборудование добавлено');
      }
      setModalOpen(false);
      setEditingItem(null);
      fetchEquipment();
    } catch (err: any) {
      addToast('error', err.message || 'Ошибка сохранения');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (item: Equipment) => {
    if (!window.confirm(`Удалить «${item.name}»? Это действие необратимо.`)) return;
    setActionLoading(true);
    try {
      await apiFetch(`${API_PREFIX}/${item.id}`, { method: 'DELETE' });
      addToast('success', `«${item.name}» удалено`);
      fetchEquipment();
    } catch (err: any) {
      addToast('error', err.message || 'Ошибка удаления');
    } finally {
      setActionLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const openEditModal = (item: Equipment) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
  };

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const allExpanded = Object.values(expandedCategories).every(Boolean);
  const anyExpanded = Object.values(expandedCategories).some(Boolean);

  const expandAll = () => {
    const allTrue = CATEGORIES.reduce((acc, cat) => ({ ...acc, [cat]: true }), {} as Record<string, boolean>);
    // Also include dynamic categories
    otherCategories.forEach((cat) => {
      allTrue[cat] = true;
    });
    setExpandedCategories(allTrue);
  };

  const collapseAll = () => {
    const allFalse = CATEGORIES.reduce((acc, cat) => ({ ...acc, [cat]: false }), {} as Record<string, boolean>);
    otherCategories.forEach((cat) => {
      allFalse[cat] = false;
    });
    setExpandedCategories(allFalse);
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
            <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center shadow-inner">
              <Database size={28} className="text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">Ведомость выдачи тестового оборудования</h2>
              <p className="text-slate-400 text-sm font-medium mt-1">
                {loading ? 'Загрузка...' : `Всего: ${totalCount} ед.`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={fetchEquipment}
              disabled={loading}
              className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 shadow-sm transition-all disabled:opacity-40"
              title="Обновить"
            >
              <RotateCcw size={18} className={`text-slate-400 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-purple-700 transition-all shadow-lg shadow-purple-200"
            >
              <Plus size={16} />
              Добавить
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="px-8 py-5 bg-slate-50/50 border-b border-slate-100">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex items-center gap-2 shrink-0">
              <Filter size={16} className="text-slate-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Фильтры
              </span>
            </div>

            <div className="flex flex-wrap gap-3 flex-1">
              {/* Category filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:ring-2 focus:ring-purple-500 shadow-sm"
              >
                <option value="">Все категории</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:ring-2 focus:ring-purple-500 shadow-sm"
              >
                <option value="">Все статусы</option>
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              {/* Search */}
              <div className="relative flex-1 min-w-[200px]">
                <Search
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Поиск по названию, серийному номеру..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:ring-2 focus:ring-purple-500 shadow-sm placeholder:text-slate-300"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Loading overlay for initial load */}
        {loading ? (
          <div className="px-8 py-20 text-center">
            <div className="flex flex-col items-center gap-4">
              <Loader2 size={32} className="animate-spin text-slate-300" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Загрузка...
              </span>
            </div>
          </div>
        ) : totalCount === 0 ? (
          <div className="px-8 py-20 text-center">
            <div className="flex flex-col items-center gap-3">
              <Database size={40} className="text-slate-200" />
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                Оборудование не найдено
              </span>
              <button
                onClick={() => {
                  setCategoryFilter('');
                  setStatusFilter('');
                  setSearchQuery('');
                  setDebouncedSearch('');
                }}
                className="text-[10px] font-bold text-purple-600 hover:text-purple-700 underline"
              >
                Сбросить фильтры
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Expand/Collapse All Controls */}
            <div className="px-8 py-3 bg-slate-50/30 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Разделы
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={expandAll}
                  disabled={allExpanded}
                  className="text-[10px] font-bold text-purple-600 hover:text-purple-700 transition-colors disabled:text-slate-300 disabled:cursor-not-allowed"
                >
                  Развернуть все
                </button>
                <span className="text-slate-200">|</span>
                <button
                  onClick={collapseAll}
                  disabled={!anyExpanded}
                  className="text-[10px] font-bold text-purple-600 hover:text-purple-700 transition-colors disabled:text-slate-300 disabled:cursor-not-allowed"
                >
                  Свернуть все
                </button>
              </div>
            </div>

            {/* Accordion Sections */}
            <div className="divide-y divide-slate-100">
              {CATEGORIES.map((cat) => {
                const catItems = groupedItems[cat] || [];
                // Only show categories that have items (or are explicitly being shown)
                if (catItems.length === 0 && categoryFilter === '' && statusFilter === '' && debouncedSearch === '') return null;
                return (
                  <CategorySection
                    key={cat}
                    category={cat}
                    items={catItems}
                    expanded={expandedCategories[cat] ?? true}
                    onToggle={() => toggleCategory(cat)}
                    onEdit={openEditModal}
                    onDelete={handleDelete}
                    actionLoading={actionLoading}
                  />
                );
              })}
              {/* Show any dynamic categories not in the predefined list */}
              {otherCategories.map((cat) => {
                const catItems = groupedItems[cat] || [];
                if (catItems.length === 0) return null;
                return (
                  <CategorySection
                    key={cat}
                    category={cat}
                    items={catItems}
                    expanded={expandedCategories[cat] ?? true}
                    onToggle={() => toggleCategory(cat)}
                    onEdit={openEditModal}
                    onDelete={handleDelete}
                    actionLoading={actionLoading}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Edit/Add Modal */}
      <EquipmentModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSave={handleSave}
        initialData={editingItem}
        saving={actionLoading}
      />
    </div>
  );
};

export default EquipmentRegister;
