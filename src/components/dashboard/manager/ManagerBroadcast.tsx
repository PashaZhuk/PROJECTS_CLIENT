import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../../../store/useAuthStore';
import api from '../../../api/ky';
import { Send, Paperclip, X, Search, Mail, CheckCircle, AlertCircle, Loader2, FileWarning, FileText } from 'lucide-react';
import { getErrorMessage } from '../shared/UIHelpers';

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

interface FileWithError {
  file: File;
  error?: string;
}

// --- Константы лимитов (синхронизированы с сервером) ---
const MAX_SUBJECT_LENGTH = 255;
const MAX_MESSAGE_LENGTH = 50000;
const MAX_TOTAL_ATTACHMENT_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB (лимит Yandex SMTP)
const ALLOWED_FILE_TYPES = '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.txt';
const ALLOWED_EXTENSIONS_LABEL = 'PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, TXT';

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const ManagerBroadcast = () => {
  const user = useAuthStore((state) => state.user);

  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<FileWithError[]>([]);

  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ sent: number; failed: number } | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Валидация полей для показа предупреждений ---
  const subjectWarning = subject.length > MAX_SUBJECT_LENGTH
    ? `Превышен лимит темы (${subject.length}/${MAX_SUBJECT_LENGTH})`
    : '';

  const messageWarning = message.length > MAX_MESSAGE_LENGTH
    ? `Превышен лимит сообщения (${message.length.toLocaleString()}/${MAX_MESSAGE_LENGTH.toLocaleString()})`
    : '';

  // Суммарный размер вложений (объявлен до canSend)
  const totalAttachmentSize = files.reduce((sum, fw) => sum + fw.file.size, 0);
  const attachmentSizeWarning = totalAttachmentSize > MAX_TOTAL_ATTACHMENT_SIZE_BYTES;
  const attachmentSizeInfo = files.length > 0
    ? `Вложения: ${formatFileSize(totalAttachmentSize)} / 25 MB`
    : '';

  const canSend =
    selectedIds.size > 0 &&
    subject.trim().length > 0 &&
    subject.length <= MAX_SUBJECT_LENGTH &&
    message.trim().length > 0 &&
    message.length <= MAX_MESSAGE_LENGTH &&
    !sending &&
    !attachmentSizeWarning;

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

  const validateFile = (file: File): string | null => {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_FILE_TYPES.includes(ext)) {
      return `Недопустимый тип файла. Разрешены: ${ALLOWED_EXTENSIONS_LABEL}`;
    }
    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const newFiles: FileWithError[] = [];

    Array.from(e.target.files).forEach((file) => {
      const fileError = validateFile(file);
      newFiles.push({ file, error: fileError || undefined });
    });

    setFiles((prev) => [...prev, ...newFiles]);
    // Сброс input, чтобы можно было выбрать тот же файл повторно
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setError('');
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
    setError('');

    if (subject.length > MAX_SUBJECT_LENGTH) {
      setError(`Тема слишком длинная (${subject.length}/${MAX_SUBJECT_LENGTH})`);
      return;
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      setError(`Сообщение слишком длинное (${message.length.toLocaleString()}/${MAX_MESSAGE_LENGTH.toLocaleString()})`);
      return;
    }

    const invalidFiles = files.filter((f) => f.error);
    if (invalidFiles.length > 0) {
      setError('Удалите файлы с ошибками перед отправкой');
      return;
    }

    setSending(true);
    setResult(null);

    try {
      const attachments: FileAttachment[] = await Promise.all(
        files.map(async (fw) => ({
          filename: fw.file.name,
          content: await readFileAsBase64(fw.file),
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
      // Пробуем вытащить ошибку валидации с сервера
      try {
        const body = await err.response?.json();
        if (body?.errors) {
          const msgs = body.errors.map((e: any) => e.message).join('; ');
          setError(msgs);
        } else if (body?.message) {
          setError(body.message);
        } else {
          setError(body?.error || 'Ошибка при отправке');
        }
      } catch {
        setError(getErrorMessage(err, 'Ошибка при отправке'));
      }
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
              {/* Тема */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                  Тема
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Тема письма..."
                  maxLength={MAX_SUBJECT_LENGTH + 50} // небольшой запас, чтобы можно было допечатать до исправления
                  className={`w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 ${
                    subjectWarning ? 'ring-2 ring-red-300 bg-red-50' : ''
                  }`}
                />
                {/* Счётчик символов темы */}
                <div className={`flex justify-end mt-1 ${
                  subject.length > MAX_SUBJECT_LENGTH ? 'text-red-500' : 'text-slate-400'
                }`}>
                  <span className="text-[11px] font-medium">
                    {subject.length}/{MAX_SUBJECT_LENGTH}
                  </span>
                </div>
                {/* Предупреждение темы */}
                {subjectWarning && (
                  <div className="flex items-center gap-1.5 mt-1 px-1">
                    <FileWarning size={12} className="text-red-500 shrink-0" />
                    <span className="text-[11px] font-bold text-red-500">{subjectWarning}</span>
                  </div>
                )}
              </div>

              {/* Сообщение */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                  Сообщение
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Текст сообщения..."
                  rows={8}
                  maxLength={MAX_MESSAGE_LENGTH + 500}
                  className={`w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 resize-none ${
                    messageWarning ? 'ring-2 ring-red-300 bg-red-50' : ''
                  }`}
                />
                {/* Счётчик символов сообщения */}
                <div className={`flex justify-end mt-1 ${
                  message.length > MAX_MESSAGE_LENGTH ? 'text-red-500' : 'text-slate-400'
                }`}>
                  <span className="text-[11px] font-medium">
                    {message.length.toLocaleString()}/{MAX_MESSAGE_LENGTH.toLocaleString()}
                  </span>
                </div>
                {/* Предупреждение сообщения */}
                {messageWarning && (
                  <div className="flex items-center gap-1.5 mt-1 px-1">
                    <FileWarning size={12} className="text-red-500 shrink-0" />
                    <span className="text-[11px] font-bold text-red-500">{messageWarning}</span>
                  </div>
                )}
              </div>

              {/* Вложения */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                  Вложения {attachmentSizeInfo && `(${attachmentSizeInfo})`}
                </label>
                <label className="flex items-center gap-3 px-4 py-3 bg-slate-50 border-2 border-dashed rounded-xl cursor-pointer transition-all border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30">
                  <Paperclip size={18} className="text-slate-400" />
                  <span className="text-sm font-medium text-slate-500">
                    {`Прикрепить файлы (${ALLOWED_EXTENSIONS_LABEL})`}
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept={ALLOWED_FILE_TYPES}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <p className="text-[10px] text-slate-400 mt-1 px-1">
                  Максимальный общий размер вложений — 25 MB (лимит почтового сервера)
                </p>

                {/* Суммарный размер вложений / предупреждение */}
                {attachmentSizeWarning && (
                  <div className="flex items-center gap-1.5 mt-2 px-1">
                    <FileWarning size={12} className="text-red-500 shrink-0" />
                    <span className="text-[11px] font-bold text-red-500">
                      Общий размер вложений ({formatFileSize(totalAttachmentSize)}) превышает лимит 25 MB
                    </span>
                  </div>
                )}

                {/* Список прикреплённых файлов */}
                {files.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {files.map((fw, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg ${
                          fw.error ? 'bg-red-50 border border-red-200' : 'bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          {fw.error ? (
                            <FileWarning size={14} className="text-red-500 shrink-0" />
                          ) : (
                            <FileText size={14} className="text-emerald-500 shrink-0" />
                          )}
                          <div className="min-w-0">
                            <span className={`text-xs font-medium truncate block ${fw.error ? 'text-red-600' : 'text-slate-600'}`}>
                              {fw.file.name}
                            </span>
                            <span className={`text-[10px] ${fw.error ? 'text-red-400' : 'text-slate-400'}`}>
                              {formatFileSize(fw.file.size)}
                              {fw.error && ` — ${fw.error}`}
                            </span>
                          </div>
                        </div>
                        <button onClick={() => removeFile(idx)} className="text-slate-400 hover:text-red-500 ml-2 shrink-0">
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Ошибка */}
              {error && (
                <div className="flex items-start gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                  <span className="text-xs font-bold text-red-600">{error}</span>
                </div>
              )}

              {/* Результат */}
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
                disabled={!canSend}
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
