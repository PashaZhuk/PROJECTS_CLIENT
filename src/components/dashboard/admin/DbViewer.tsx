import { useState, useEffect, useCallback } from 'react';
import { Database, Search, ChevronLeft, ChevronRight, Loader2, AlertCircle, CheckCircle2, X, Pencil } from 'lucide-react';

// ─── Types ───

interface ColumnInfo {
  name: string;
  type: string;
  nullable: boolean;
  isPk: boolean;
  readOnly: boolean;
}

interface TableInfo {
  name: string;
  columns: ColumnInfo[];
}

interface TableDataResponse {
  data: Record<string, unknown>[];
  total: number;
  page: number;
  perPage: number;
  columns: ColumnInfo[];
}

// ─── Helpers ───

function formatCellValue(value: unknown): string {
  if (value === null || value === undefined) return <span className="text-gray-300 italic">NULL</span> as any;
  if (typeof value === 'object') {
    try { return JSON.stringify(value); }
    catch { return String(value); }
  }
  return String(value);
}


// ─── DbViewer ───

const DbViewer = () => {
  // Table list
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [loadingTables, setLoadingTables] = useState(true);

  // Data
  const [tableData, setTableData] = useState<TableDataResponse | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  // Edit modal
  const [editingRow, setEditingRow] = useState<Record<string, unknown> | null>(null);
  const [editForm, setEditForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Per page
  const perPage = 25;

  // Load tables on mount
  useEffect(() => {
    fetch('/api/admin/db/tables', { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        if (data?.success && Array.isArray(data.data)) {
          setTables(data.data);
          if (data.data.length > 0) {
            setSelectedTable(data.data[0].name);
          }
        }
      })
      .catch(() => setError('Ошибка загрузки списка таблиц'))
      .finally(() => setLoadingTables(false));
  }, []);

  // Load table data when table/page/search changes
  useEffect(() => {
    if (!selectedTable) return;

    setLoadingData(true);
    setError(null);

    const params = new URLSearchParams({
      page: String(page),
      perPage: String(perPage),
    });
    if (search) params.set('search', search);

    fetch(`/api/admin/db/tables/${encodeURIComponent(selectedTable)}?${params}`, {
      credentials: 'include',
    })
      .then(r => r.json())
      .then(data => {
        if (data?.success && data.data) {
          setTableData(data.data);
        } else {
          setError(data?.error || 'Ошибка загрузки данных');
        }
      })
      .catch(() => setError('Ошибка сети'))
      .finally(() => setLoadingData(false));
  }, [selectedTable, page, search]);

  // Auto-dismiss save message
  useEffect(() => {
    if (saveMessage?.type === 'success') {
      const t = setTimeout(() => setSaveMessage(null), 3000);
      return () => clearTimeout(t);
    }
  }, [saveMessage]);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const currentTableInfo = tables.find(t => t.name === selectedTable);
  const totalPages = tableData ? Math.ceil(tableData.total / perPage) : 0;

  // ─── Edit handlers ───

  const openEditor = useCallback((row: Record<string, unknown>, columns: ColumnInfo[]) => {
    const form: Record<string, string> = {};
    for (const col of columns) {
      const val = row[col.name];
      form[col.name] = val === null || val === undefined ? '' : String(val);
    }
    setEditingRow(row);
    setEditForm(form);
    setSaveMessage(null);
  }, []);

  const handleEditChange = useCallback((field: string, value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSave = useCallback(async () => {
    if (!editingRow || !selectedTable) return;

    // Find PK column to get the row ID
    const pkCol = currentTableInfo?.columns.find(c => c.isPk) || currentTableInfo?.columns[0];
    if (!pkCol) return;

    const rowId = editingRow[pkCol.name];
    if (rowId === undefined || rowId === null) return;

    setSaving(true);
    setSaveMessage(null);

    // Build update payload — convert types
    const payload: Record<string, unknown> = {};
    for (const col of currentTableInfo!.columns) {
      if (col.isPk) continue;
      const val = editForm[col.name];
      if (val === '' && col.nullable) {
        payload[col.name] = null;
      } else if (['integer', 'bigint'].some(t => col.type.startsWith(t))) {
        payload[col.name] = val ? parseInt(val, 10) : null;
      } else if (['numeric', 'real', 'double precision'].some(t => col.type.startsWith(t))) {
        payload[col.name] = val ? parseFloat(val) : null;
      } else if (col.type === 'boolean') {
        payload[col.name] = val === 'true';
      } else {
        payload[col.name] = val;
      }
    }

    try {
      const res = await fetch(`/api/admin/db/tables/${encodeURIComponent(selectedTable)}/${rowId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data?.success) {
        setSaveMessage({ type: 'success', text: 'Строка обновлена' });
        // Refresh data
        setPage(1);
      } else {
        setSaveMessage({ type: 'error', text: data?.error || 'Ошибка сохранения' });
      }
    } catch {
      setSaveMessage({ type: 'error', text: 'Ошибка сети' });
    } finally {
      setSaving(false);
    }
  }, [editingRow, selectedTable, editForm, currentTableInfo]);

  // ─── Render ───

  if (loadingTables) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 size={32} className="animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          База данных <span className="text-purple-600">портала</span>
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Просмотр и редактирование таблиц
        </p>
      </div>

      {/* Table selector + search row */}
      <div className="flex gap-4 mb-6 items-start">
        {/* Selector */}
        <div className="w-64 shrink-0">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Таблица</label>
          <select
            value={selectedTable}
            onChange={e => { setSelectedTable(e.target.value); setPage(1); setSearch(''); setSearchInput(''); }}
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
          >
            {tables.map(t => (
              <option key={t.name} value={t.name}>{t.name}</option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="flex-1">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Поиск</label>
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Поиск по всем текстовым полям..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Info badge */}
        <div className="shrink-0 pt-6">
          <div className="px-4 py-2.5 bg-purple-50 rounded-xl text-xs font-bold text-purple-700 whitespace-nowrap">
            {tableData ? `${tableData.total} записей` : '—'}
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Save toast */}
      {saveMessage && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl border shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 ${
          saveMessage.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-emerald-200/50'
            : 'bg-red-50 border-red-200 text-red-700 shadow-red-200/50'
        }`}>
          {saveMessage.type === 'success' ? <CheckCircle2 size={22} /> : <AlertCircle size={22} />}
          <span className="text-sm font-bold">{saveMessage.text}</span>
          <button onClick={() => setSaveMessage(null)} className="ml-2 p-1 rounded-lg hover:bg-black/5">
            <span className="text-lg leading-none">&times;</span>
          </button>
        </div>
      )}

      {/* Data table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        {loadingData ? (
          <div className="flex items-center justify-center p-16">
            <Loader2 size={28} className="animate-spin text-purple-600" />
          </div>
        ) : tableData && tableData.data.length > 0 ? (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    {tableData.columns.map(col => (
                      <th key={col.name} className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-wider text-gray-500 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span>{col.name}</span>
                          {col.isPk && <span className="text-[8px] px-1 py-0.5 rounded bg-purple-100 text-purple-700">PK</span>}
                        </div>
                      </th>
                    ))}
                    <th className="px-4 py-3 w-16" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {tableData.data.map((row, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-purple-50/40 transition-colors cursor-pointer"
                      onClick={() => openEditor(row, tableData.columns)}
                    >
                      {tableData.columns.map(col => (
                        <td key={col.name} className="px-4 py-2.5 text-xs text-gray-700 max-w-[250px] truncate" title={formatCellValue(row[col.name]) as string}>
                          {formatCellValue(row[col.name])}
                        </td>
                      ))}
                      <td className="px-4 py-2.5 text-right">
                        <Pencil size={14} className="text-gray-300 hover:text-purple-600 transition-colors" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
              <span className="text-xs text-gray-500 font-medium">
                {tableData.total > 0
                  ? `${(page - 1) * perPage + 1}–${Math.min(page * perPage, tableData.total)} из ${tableData.total}`
                  : 'Нет данных'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-xs font-bold text-gray-600 min-w-[60px] text-center">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-16 text-center">
            <Database size={40} className="text-gray-200 mb-4" />
            <p className="text-sm font-bold text-gray-400">
              {search ? 'Ничего не найдено' : 'В таблице нет данных'}
            </p>
          </div>
        )}
      </div>

      {/* ─── Row Editor Modal ─── */}
      {editingRow && currentTableInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setEditingRow(null)} />
          
          {/* Modal */}
          <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-200 w-full max-w-2xl max-h-[80vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0">
              <h2 className="text-base font-black text-slate-800">
                Редактирование строки
                {currentTableInfo.columns.find(c => c.isPk) && (
                  <span className="text-purple-600 ml-1">
                    #{String(editingRow[currentTableInfo.columns.find(c => c.isPk)!.name])}
                  </span>
                )}
              </h2>
              <button
                onClick={() => setEditingRow(null)}
                className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              {currentTableInfo.columns.map(col => {
                if (col.isPk) return null; // Skip PK

                const val = editForm[col.name] ?? '';
                const isLongText = col.type.startsWith('text') || (typeof val === 'string' && val.length > 100);

                return (
                  <div key={col.name}>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-gray-500 mb-1.5">
                      {col.name}
                      {col.type && <span className="text-gray-300 font-normal normal-case ml-1">({col.type})</span>}
                      {col.nullable && <span className="text-amber-500 ml-1">nullable</span>}
                      {col.readOnly && <span className="text-gray-400 ml-1 text-[9px] border border-gray-200 px-1.5 py-0.5 rounded-md">только для чтения</span>}
                    </label>
                    {col.readOnly ? (
                      <div className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-400 cursor-not-allowed select-all">
                        {val || <span className="italic">—</span>}
                      </div>
                    ) : isLongText ? (
                      <textarea
                        value={val}
                        onChange={e => handleEditChange(col.name, e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none transition-all"
                      />
                    ) : (
                      <input
                        type="text"
                        value={val}
                        onChange={e => handleEditChange(col.name, e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 shrink-0 bg-gray-50/50 rounded-b-3xl">
              <button
                onClick={() => setEditingRow(null)}
                className="px-6 py-3 text-sm font-bold text-gray-500 hover:bg-white rounded-xl transition-all"
              >
                Отмена
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center justify-center gap-2 px-8 py-3 min-w-[160px] bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:from-gray-300 disabled:to-gray-300 text-white font-bold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-purple-200/50 disabled:shadow-none"
              >
                {saving ? (
                  <><Loader2 size={16} className="animate-spin" /> Сохранение...</>
                ) : (
                  'Сохранить'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DbViewer;
