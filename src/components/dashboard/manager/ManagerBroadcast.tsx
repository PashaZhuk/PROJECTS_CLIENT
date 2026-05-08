import { useState, useEffect } from 'react';
import { useAuthStore } from '../../../store/useAuthStore';
import api from '../../../api/ky';
import { Send, Paperclip, X, Search, Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface Partner {
  id: number;
  email: string;
  companyName: string | null;
  unp: string | null;
  name: string | null;
}

interface FileAttachment {
  filename: string;
  content: string;
  encoding: string;
}

const ManagerBroadcast = () => {
  const user = useAuthStore((state) => state.user);

  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ sent: number; failed: number } | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res: any = await api.get('manager/partners').json();
        if (res.success) {
          setPartners(res.data);
        }
      } catch (err) {
        console.error('Failed to load partners', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPartners();
  }, []);

  const filteredPartners = partners.filter(
    (p) =>
      p.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.unp?.includes(searchQuery)
  );

  const toggleSelect = (id: number) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
    setSelectAll(next.size === partners.length);
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedIds(new Set());
      setSelectAll(false);
    } else {
      setSelectedIds(new Set(partners.map((p) => p.id)));
      setSelectAll(true);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSend = async () => {
    if (selectedIds.size === 0 || !subject || !message) {
      setError('Заполните все поля');
      return;
    }

    setSending(true);
    setError('');
    setResult(null);

    try {
      const attachments: FileAttachment[] = await Promise.all(
        files.map(async (file) => ({
          filename: file.name,
          content: await readFileAsBase64(file),
          encoding: 'base64',
        }))
      );

      const res: any = await api
        .post('manager/send-broadcast', {
          json: {
            recipientIds: Array.from(selectedIds),
            subject,
            message: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #333;">${subject}</h2>
              ${message.replace(/\n/g, '<br/>')}
              <hr style="margin-top: 30px; border: 0; border-top: 1px solid #eee;">
              <p style="font-size: 12px; color: #888;">С уважением, ${user?.name || 'IPMATIKA B2B'}</p>
            </div>`,
            attachments: attachments.length > 0 ? attachments : undefined,
          },
        })
        .json();

      if (res.success) {
        setResult(res.data);
        setSelectedIds(new Set());
        setSelectAll(false);
        setSubject('');
        setMessage('');
        setFiles([]);
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка при отправке');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100">
          <h2 className="text-2xl font-black text-slate-900">Доведение информации</h2>
          <p className="text-slate-400 text-sm font-medium mt-1">Рассылка уведомлений партнерам</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* левая колонка — выбор получателей */}
          <div className="p-8 border-r border-slate-100">
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Поиск партнера..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 mb-3 px-1">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={toggleSelectAll}
                className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Выбрать всех ({partners.length})
              </span>
            </div>

            <div className="space-y-1 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="animate-spin text-slate-300" size={24} />
                </div>
              ) : filteredPartners.length === 0 ? (
                <p className="text-slate-400 font-medium text-sm text-center py-8">
                  Партнеры не найдены
                </p>
              ) : (
                filteredPartners.map((p) => (
                  <label
                    key={p.id}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                      selectedIds.has(p.id)
                        ? 'bg-emerald-50 border border-emerald-200'
                        : 'hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.has(p.id)}
                      onChange={() => toggleSelect(p.id)}
                      className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-slate-800 truncate">
                        {p.companyName || p.name || 'Без названия'}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Mail size={10} className="text-slate-400 shrink-0" />
                        <span className="text-[11px] text-slate-400 font-medium truncate">{p.email}</span>
                        {p.unp && (
                          <span className="text-[10px] text-slate-300 font-medium">УНП: {p.unp}</span>
                        )}
                      </div>
                    </div>
                  </label>
                ))
              )}
            </div>

            <div className="mt-4 px-1">
              <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg">
                Выбрано: {selectedIds.size} из {partners.length}
              </div>
            </div>
          </div>

          {/* правая колонка — форма письма */}
          <div className="p-8">
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                  Тема
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Тема письма..."
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                  Сообщение
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Текст сообщения..."
                  rows={8}
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                  Вложения
                </label>
                <label className="flex items-center gap-3 px-4 py-3 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-emerald-300 hover:bg-emerald-50/30 transition-all">
                  <Paperclip size={18} className="text-slate-400" />
                  <span className="text-sm font-medium text-slate-500">Прикрепить файлы</span>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                {files.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {files.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg"
                      >
                        <span className="text-xs font-medium text-slate-600 truncate">{file.name}</span>
                        <button onClick={() => removeFile(idx)} className="text-red-400 hover:text-red-600">
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {error && (
                <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle size={16} className="text-red-500 shrink-0" />
                  <span className="text-xs font-bold text-red-600">{error}</span>
                </div>
              )}

              {result && (
                <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <CheckCircle size={16} className="text-emerald-500 shrink-0" />
                  <span className="text-xs font-bold text-emerald-600">
                    Отправлено: {result.sent}
                    {result.failed > 0 && `, ошибок: ${result.failed}`}
                  </span>
                </div>
              )}

              <button
                onClick={handleSend}
                disabled={sending || selectedIds.size === 0 || !subject || !message}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-200"
              >
                {sending ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Send size={18} />
                )}
                {sending ? 'Отправка...' : 'Отправить'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerBroadcast;