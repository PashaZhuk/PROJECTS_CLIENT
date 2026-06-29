import React, { useState, useEffect, useCallback } from 'react';
import { Save, MapPin, Phone, Clock, Headphones, Building2, Loader2, AlertCircle, CheckCircle2, Info, ChevronLeft, Settings, ArrowRight } from 'lucide-react';
import YandexMap from '../../ui/YandexMap';
import { broadcastSaved } from '../../../lib/broadcast';

// ─── Типы ────────────────────────────────────────────

interface ContactsForm {
  companyName: string;
  address: string;
  city: string;
  phone: string;
  mobile: string;
  email: string;
  supportEmail: string;
  supportPhone: string;
  workingHours: string;
  yandexMapId: string;
}

type FormErrors = Partial<Record<keyof ContactsForm, string>>;

interface SettingsTool {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

interface SettingsSection {
  title: string;
  description?: string;
  tools: SettingsTool[];
}

// ─── Конфигурация инструментов ────────────────────────

const STATIC_SECTION: SettingsSection = {
  title: 'Корректировка статических элементов портала',
  description: 'Редактирование контактных данных, реквизитов и прочей публичной информации',
  tools: [
    {
      id: 'branding',
      label: 'Брендинг',
      description: 'Логотип компании и название',
      icon: <Building2 size={20} />,
    },
    {
      id: 'contacts',
      label: 'Контакты',
      description: 'Адрес, телефоны, email, Яндекс.Карта',
      icon: <MapPin size={20} />,
    },
    {
      id: 'motto',
      label: 'Лозунг дня',
      description: 'Текст под датой в шапке портала',
      icon: <Info size={20} />,
    },
  ],
};

// ─── Default / Validation ─────────────────────────────

const defaultForm: ContactsForm = {
  companyName: 'ООО "АйПиМатика Бел"',
  address: '220081, Минская обл., Минский р-н, Боровлянский с/с, д. Копище, ул. Лопатина, д. 6, пом. 3',
  city: 'г. Минск',
  phone: '+375(17) 361-96-96',
  mobile: '+375(29) 361-96-96',
  email: 'info@ipmatika.by',
  supportEmail: 'support@ipmatika.by',
  supportPhone: '+375(29) 378-96-96',
  workingHours: 'понедельник-четверг — 9:00-18:00, пятница — 9:00-17:00',
  yandexMapId: '85112499592fc9fcb766262465c1b80ca62edb09cd1f5b1caa6045fc3a6fc2e0',
};

const PHONE_REGEX = /^\+375\(\d{2}\)\s?\d{3}-?\d{2}-?\d{2}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(form: ContactsForm): FormErrors {
  const errors: FormErrors = {};

  if (!form.companyName.trim()) errors.companyName = 'Обязательное поле';
  else if (form.companyName.length > 200) errors.companyName = 'Максимум 200 символов';

  if (!form.city.trim()) errors.city = 'Обязательное поле';
  else if (form.city.length > 100) errors.city = 'Максимум 100 символов';

  if (!form.address.trim()) errors.address = 'Обязательное поле';
  else if (form.address.length > 500) errors.address = 'Максимум 500 символов';

  if (!form.phone.trim()) errors.phone = 'Обязательное поле';
  else if (!PHONE_REGEX.test(form.phone.trim())) errors.phone = 'Формат: +375(17) 361-96-96';

  if (!form.mobile.trim()) errors.mobile = 'Обязательное поле';
  else if (!PHONE_REGEX.test(form.mobile.trim())) errors.mobile = 'Формат: +375(29) 361-96-96';

  if (!form.email.trim()) errors.email = 'Обязательное поле';
  else if (!EMAIL_REGEX.test(form.email.trim())) errors.email = 'Неверный формат email';

  if (!form.supportEmail.trim()) errors.supportEmail = 'Обязательное поле';
  else if (!EMAIL_REGEX.test(form.supportEmail.trim())) errors.supportEmail = 'Неверный формат email';

  if (!form.supportPhone.trim()) errors.supportPhone = 'Обязательное поле';
  else if (!PHONE_REGEX.test(form.supportPhone.trim())) errors.supportPhone = 'Формат: +375(29) 378-96-96';

  if (!form.workingHours.trim()) errors.workingHours = 'Обязательное поле';
  else if (form.workingHours.length > 500) errors.workingHours = 'Максимум 500 символов';

  if (form.yandexMapId.trim() && form.yandexMapId.trim().length < 10) {
    errors.yandexMapId = 'ID выглядит слишком коротким';
  }

  return errors;
}

// ─── Вспомогательные компоненты ────────────────────────

const ValidatedInput = ({
  value, onChange, placeholder, error, type, mono, rows, maxLength,
}: {
  value: string; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string; error?: string; type?: string; mono?: boolean; rows?: number; maxLength?: number;
}) => {
  const Tag = rows ? 'textarea' : 'input';
  return (
    <div>
      <Tag
        {...(rows ? { rows } : { type: type || 'text' })}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-none ${
          error
            ? 'border-red-300 focus:ring-red-400 bg-red-50'
            : 'border-gray-200 focus:ring-purple-400'
        } ${mono ? 'font-mono' : ''}`}
      />
      <div className="flex justify-between items-start mt-0.5 min-h-[18px]">
        {error ? (
          <span className="text-[11px] text-red-500 font-medium">{error}</span>
        ) : (
          <span />
        )}
        {maxLength && (
          <span className={`text-[10px] font-medium ${
            value.length > maxLength * 0.9 ? 'text-red-400' : 'text-gray-400'
          }`}>
            {value.length}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
};

const Section = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
    <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
      {icon}
      <h3 className="text-sm font-bold uppercase tracking-wider text-gray-600">{title}</h3>
    </div>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-[13px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
    {children}
  </div>
);

// ─── ToolSelector ──────────────────────────────────────

const ToolSelector = ({ onSelect }: { onSelect: (toolId: string) => void }) => {
  const sections: SettingsSection[] = [STATIC_SECTION];

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Настройки <span className="text-purple-600">портала</span>
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Выберите раздел для редактирования
        </p>
      </div>

      {/* Sections */}
      {sections.map((section) => (
        <div key={section.title} className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Section header */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Settings size={18} className="text-purple-600 shrink-0" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700">
                {section.title}
              </h2>
            </div>
            {section.description && (
              <p className="text-[13px] text-gray-400 mt-1 ml-[26px]">
                {section.description}
              </p>
            )}
          </div>

          {/* Tools list */}
          <div className="divide-y divide-gray-50">
            {section.tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => onSelect(tool.id)}
                className="w-full flex items-center gap-4 px-6 py-4 hover:bg-purple-50/50 transition-colors text-left group"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-100 transition-colors shrink-0">
                  {tool.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-slate-800 group-hover:text-purple-700 transition-colors">
                    {tool.label}
                  </div>
                  <div className="text-[13px] text-slate-400 mt-0.5">
                    {tool.description}
                  </div>
                </div>
                <ArrowRight size={18} className="text-slate-300 group-hover:text-purple-400 group-hover:translate-x-1 transition-all shrink-0" />
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── ContactsEditor ────────────────────────────────────

const ContactsEditor = ({ onBack }: { onBack: () => void }) => {
  const [form, setForm] = useState<ContactsForm>(defaultForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  // Авто-скрытие toast через 3 сек
  useEffect(() => {
    if (message?.type === 'success') {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    fetch('/api/admin/settings/contacts')
      .then(r => r.json())
      .then(data => {
        if (data?.success && data.data) {
          setForm(prev => ({ ...prev, ...data.data }));
        }
      })
      .catch(() => setMessage({ type: 'error', text: 'Ошибка загрузки настроек' }))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = useCallback((field: keyof ContactsForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const value = e.target.value;
    setForm(prev => ({ ...prev, [field]: value }));
    // Сбрасываем ошибку конкретного поля при вводе
    setErrors(prev => ({ ...prev, [field]: undefined }));
    setMessage(null);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Валидация перед отправкой
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      setMessage({ type: 'error', text: 'Исправьте ошибки в форме' });
      return;
    }

    setSaving(true);

    try {
      const res = await fetch('/api/admin/settings/contacts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ value: form }),
      });
      const data = await res.json();
      if (data?.success) {
        setMessage({ type: 'success', text: 'Контакты сохранены' });
        broadcastSaved('setting', 'updated');
      } else {
        setMessage({ type: 'error', text: data?.error || 'Ошибка сохранения' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Ошибка сети' });
    } finally {
      setSaving(false);
    }
  };

  const hasMapId = Boolean(form.yandexMapId);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 size={32} className="animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header with back button */}
      <div className="flex items-start gap-4">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 mt-1 rounded-xl border border-gray-200 text-gray-400 hover:text-purple-600 hover:border-purple-200 hover:bg-purple-50 transition-all shrink-0"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Контакты <span className="text-purple-600">портала</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Редактирование контактной информации и карты
          </p>
        </div>
      </div>

      {/* Toast-уведомление поверх всего */}
      {message && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl border shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 ${
          message.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-emerald-200/50' 
            : 'bg-red-50 border-red-200 text-red-700 shadow-red-200/50'
        }`}>
          {message.type === 'success' ? <CheckCircle2 size={22} className="shrink-0" /> : <AlertCircle size={22} className="shrink-0" />}
          <span className="text-sm font-bold">{message.text}</span>
          <button
            onClick={() => setMessage(null)}
            className="ml-2 p-1 rounded-lg hover:bg-black/5 transition-colors"
          >
            <span className="text-lg leading-none">&times;</span>
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Основная информация */}
        <Section title="Основная информация" icon={<Building2 size={18} className="text-purple-600" />}>
          <Field label="Название компании">
            <ValidatedInput value={form.companyName} onChange={handleChange('companyName')} placeholder='ООО "АйПиМатика Бел"' error={errors.companyName} maxLength={200} />
          </Field>
          <Field label="Город">
            <ValidatedInput value={form.city} onChange={handleChange('city')} placeholder="г. Минск" error={errors.city} maxLength={100} />
          </Field>
          <Field label="Адрес">
            <ValidatedInput value={form.address} onChange={handleChange('address')} placeholder="Полный адрес" error={errors.address} rows={2} maxLength={500} />
          </Field>
        </Section>

        {/* Отдел продаж */}
        <Section title="Отдел продаж" icon={<Phone size={18} className="text-green-600" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Телефон / Факс">
              <ValidatedInput value={form.phone} onChange={handleChange('phone')} placeholder="+375(17) 361-96-96" error={errors.phone} />
            </Field>
            <Field label="Мобильный">
              <ValidatedInput value={form.mobile} onChange={handleChange('mobile')} placeholder="+375(29) 361-96-96" error={errors.mobile} />
            </Field>
          </div>
          <Field label="Email">
            <ValidatedInput type="email" value={form.email} onChange={handleChange('email')} placeholder="info@ipmatika.by" error={errors.email} />
          </Field>
        </Section>

        {/* Сервисный центр */}
        <Section title="Сервисный центр" icon={<Headphones size={18} className="text-purple-600" />}>
          <Field label="Телефон">
            <ValidatedInput value={form.supportPhone} onChange={handleChange('supportPhone')} placeholder="+375(29) 378-96-96" error={errors.supportPhone} />
          </Field>
          <Field label="Email">
            <ValidatedInput type="email" value={form.supportEmail} onChange={handleChange('supportEmail')} placeholder="support@ipmatika.by" error={errors.supportEmail} />
          </Field>
        </Section>

        {/* Режим работы и карта */}
        <Section title="Режим работы и карта" icon={<Clock size={18} className="text-amber-600" />}>
          <Field label="Режим работы">
            <ValidatedInput value={form.workingHours} onChange={handleChange('workingHours')} placeholder="понедельник-четверг — 9:00-18:00, пятница — 9:00-17:00" error={errors.workingHours} rows={2} maxLength={500} />
          </Field>
          <div className="relative">
            <Field label="ID Яндекс.Карты">
              <div className="flex gap-2 items-start">
                <div className="flex-1 relative">
                  <ValidatedInput value={form.yandexMapId} onChange={handleChange('yandexMapId')} placeholder="85112499592fc9fcb766262465c1b80ca62edb09cd1f5b1caa6045fc3a6fc2e0" error={errors.yandexMapId} mono />
                </div>
                {/* Подсказка */}
                <div className="group relative shrink-0 mt-2">
                  <Info size={18} className="text-gray-400 hover:text-purple-600 cursor-help transition-colors" />
                  <div className="absolute right-0 top-full mt-2 w-80 p-4 bg-gray-900 text-white text-[13px] rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="font-bold text-purple-300 mb-2 text-sm">Как сменить карту</div>
                    <ol className="space-y-1.5 list-decimal list-inside leading-relaxed">
                      <li>Зайдите на <a href="https://constructor.maps.yandex.ru" target="_blank" rel="noopener" className="text-blue-300 hover:underline">constructor.maps.yandex.ru</a></li>
                      <li>Найдите новый адрес в поиске</li>
                      <li>Поставьте метку на нужном месте</li>
                      <li>Настройте внешний вид карты</li>
                      <li>Нажмите «Сохранить и продолжить»</li>
                      <li>Скопируйте ID из ссылки:</li>
                    </ol>
                    <code className="block mt-2 p-2 bg-gray-800 rounded-lg text-[10px] break-all text-gray-300 leading-relaxed">
                      ...constructor%3a<span className="text-yellow-300 font-bold">ID</span>&amp;width...
                    </code>
                    <div className="mt-2 text-gray-400 text-[10px]">
                      Вставьте скопированный ID в поле выше и сохраните
                    </div>
                    <div className="absolute -top-1.5 right-4 w-3 h-3 bg-gray-900 rotate-45" />
                  </div>
                </div>
              </div>
            </Field>
          </div>
          {hasMapId && (
            <div className="mt-2 rounded-2xl overflow-hidden border border-gray-200">
              <YandexMap mapId={form.yandexMapId} height={250} />
            </div>
          )}
        </Section>

        {/* Кнопка сохранения */}
        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={saving}
            className="group relative flex items-center justify-center px-10 py-4 min-w-[240px] bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:from-gray-300 disabled:to-gray-300 text-white font-bold text-sm tracking-wider uppercase rounded-2xl transition-all duration-300 active:scale-[0.97] disabled:active:scale-100 shadow-lg shadow-purple-200/60 hover:shadow-xl hover:shadow-purple-300/40 disabled:shadow-none overflow-hidden will-change-transform"
          >
            {/* Default: видно когда не saving */}
            <span className={`absolute inset-0 flex items-center justify-center gap-3 transition-all duration-200 ${
              saving ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
            }`}>
              <Save size={18} className="group-hover:scale-110 transition-transform duration-200" />
              <span>Сохранить контакты</span>
            </span>
            {/* Spinner: видно когда saving */}
            <span className={`absolute inset-0 flex items-center justify-center gap-3 transition-all duration-200 ${
              saving ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}>
              <Loader2 size={18} className="animate-spin" />
              <span>Сохранение...</span>
            </span>
            {/* Невидимый заполнитель — сохраняет размеры кнопки */}
            <span className="invisible inline-flex items-center gap-3">
              <Save size={18} />
              <span>Сохранить контакты</span>
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

// ─── BrandingEditor ────────────────────────────────────

const BrandingEditor = ({ onBack }: { onBack: () => void }) => {
  const [companyName, setCompanyName] = useState('АйПиМатика Бел - B2B');
  const [logoSrc, setLogoSrc] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetch('/api/admin/settings/branding')
      .then(r => r.json())
      .then(data => {
        if (data?.success && data.data) {
          const val = typeof data.data === 'string' ? JSON.parse(data.data) : data.data;
          if (val.companyName) setCompanyName(val.companyName);
          if (val.logo) setLogoSrc(val.logo);
        }
      })
      .catch(() => setMessage({ type: 'error', text: 'Ошибка загрузки брендинга' }))
      .finally(() => setLoading(false));
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500 * 1024) {
      setMessage({ type: 'error', text: 'Файл слишком большой. Максимум 500 КБ.' });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setLogoSrc(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/settings/branding', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ value: { companyName, logo: logoSrc } }),
      });
      const data = await res.json();
      if (data?.success) {
        setMessage({ type: 'success', text: 'Брендинг сохранён' });
        broadcastSaved('setting', 'updated');
      } else {
        setMessage({ type: 'error', text: data?.error || 'Ошибка сохранения' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Ошибка сети' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 size={32} className="animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-start gap-4">
        <button onClick={onBack} className="flex items-center justify-center w-10 h-10 mt-1 rounded-xl border border-gray-200 text-gray-400 hover:text-purple-600 hover:border-purple-200 hover:bg-purple-50 transition-all shrink-0">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Брендинг</h1>
          <p className="text-slate-500 text-sm mt-1">Логотип компании и название портала</p>
        </div>
      </div>

      {message && (
        <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl border shadow-lg ${
          message.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {message.type === 'success' ? <CheckCircle2 size={22} /> : <AlertCircle size={22} />}
          <span className="text-sm font-bold">{message.text}</span>
          <button onClick={() => setMessage(null)} className="ml-auto p-1 rounded-lg hover:bg-black/5">&times;</button>
        </div>
      )}

      <Section title="Логотип" icon={<Building2 size={18} className="text-purple-600" />}>
        <div className="flex items-start gap-6">
          <div className="flex flex-col items-center gap-3">
            <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50">
              {logoSrc ? (
                <img src={logoSrc} alt="Логотип" className="w-full h-full object-contain" />
              ) : (
                <span className="text-[10px] text-gray-400 font-bold text-center px-2">Нет логотипа</span>
              )}
            </div>
            <label className="px-4 py-2 bg-purple-600 text-white text-[13px] font-bold rounded-xl hover:bg-purple-700 cursor-pointer transition-colors">
              Загрузить
              <input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" onChange={handleFileUpload} className="hidden" />
            </label>
            {logoSrc && (
              <button onClick={() => setLogoSrc('')} className="text-[11px] text-red-500 font-bold hover:underline">
                Удалить
              </button>
            )}
          </div>
          <div className="flex-1 text-[13px] text-gray-400 leading-relaxed">
            <p className="font-bold mb-1">Рекомендации:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Формат: PNG, WebP или SVG</li>
              <li>Максимум 500 КБ</li>
              <li>Квадратное изображение (1:1)</li>
              <li>Прозрачный фон — предпочтительно</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section title="Название компании" icon={<Info size={18} className="text-purple-600" />}>
        <Field label="Название в шапке портала">
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            maxLength={100}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
          />
        </Field>
      </Section>

      <div className="flex justify-end pt-4 border-t border-gray-100">
        <button
          onClick={handleSave}
          disabled={saving}
          className="group relative flex items-center justify-center px-10 py-4 min-w-[240px] bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:from-gray-300 disabled:to-gray-300 text-white font-bold text-sm tracking-wider uppercase rounded-2xl transition-all duration-300 active:scale-[0.97] disabled:active:scale-100 shadow-lg shadow-purple-200/60 hover:shadow-xl hover:shadow-purple-300/40 disabled:shadow-none overflow-hidden"
        >
          <span className={`absolute inset-0 flex items-center justify-center gap-3 transition-all duration-200 ${
            saving ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
          }`}>
            <Save size={18} />
            <span>Сохранить брендинг</span>
          </span>
          <span className={`absolute inset-0 flex items-center justify-center gap-3 transition-all duration-200 ${
            saving ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}>
            <Loader2 size={18} className="animate-spin" />
            <span>Сохранение...</span>
          </span>
          <span className="invisible inline-flex items-center gap-3">
            <Save size={18} />
            <span>Сохранить брендинг</span>
          </span>
        </button>
      </div>
    </div>
  );
};

// ─── MottoEditor ───────────────────────────────────────

const MottoEditor = ({ onBack }: { onBack: () => void }) => {
  const [motto, setMotto] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetch('/api/settings/daily-motto')
      .then(r => r.json())
      .then(data => {
        if (data?.success && data.data) {
          setMotto(String(data.data));
        }
      })
      .catch(() => setMessage({ type: 'error', text: 'Ошибка загрузки лозунга' }))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (message?.type === 'success') {
      const t = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(t);
    }
  }, [message]);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/settings/daily-motto', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ value: motto }),
      });
      const data = await res.json();
      if (data?.success) {
        setMessage({ type: 'success', text: 'Лозунг сохранён' });
        broadcastSaved('setting', 'updated');
      } else {
        setMessage({ type: 'error', text: data?.error || 'Ошибка сохранения' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Ошибка сети' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 size={32} className="animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-start gap-4">
        <button onClick={onBack} className="flex items-center justify-center w-10 h-10 mt-1 rounded-xl border border-gray-200 text-gray-400 hover:text-purple-600 hover:border-purple-200 hover:bg-purple-50 transition-all shrink-0">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Лозунг <span className="text-purple-600">дня</span></h1>
          <p className="text-slate-500 text-sm mt-1">Текст, отображаемый под датой в шапке портала</p>
        </div>
      </div>

      {message && (
        <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl border shadow-lg ${
          message.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {message.type === 'success' ? <CheckCircle2 size={22} /> : <AlertCircle size={22} />}
          <span className="text-sm font-bold">{message.text}</span>
          <button onClick={() => setMessage(null)} className="ml-auto p-1 rounded-lg hover:bg-black/5">&times;</button>
        </div>
      )}

      <Section title="Редактирование лозунга" icon={<Info size={18} className="text-purple-600" />}>
        <Field label="Текст лозунга">
          <ValidatedInput
            value={motto}
            onChange={(e: any) => setMotto(e.target.value)}
            maxLength={70}
            placeholder="Например: Понедельник — день тяжёлый, а B2B портал — лёгкий!"
          />
        </Field>
        <p className="text-[12px] text-gray-400 mt-2 italic">Лозунг отображается в шапке портала у всех пользователей.</p>
      </Section>

      <div className="flex justify-end pt-4 border-t border-gray-100">
        <button
          onClick={handleSave}
          disabled={saving}
          className="group relative flex items-center justify-center px-10 py-4 min-w-[240px] bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:from-gray-300 disabled:to-gray-300 text-white font-bold text-sm tracking-wider uppercase rounded-2xl transition-all duration-300 active:scale-[0.97] disabled:active:scale-100 shadow-lg shadow-purple-200/60 hover:shadow-xl hover:shadow-purple-300/40 disabled:shadow-none overflow-hidden"
        >
          <span className={`absolute inset-0 flex items-center justify-center gap-3 transition-all duration-200 ${
            saving ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
          }`}>
            <Save size={18} />
            <span>Сохранить лозунг</span>
          </span>
          <span className={`absolute inset-0 flex items-center justify-center gap-3 transition-all duration-200 ${
            saving ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}>
            <Loader2 size={18} className="animate-spin" />
            <span>Сохранение...</span>
          </span>
          <span className="invisible inline-flex items-center gap-3">
            <Save size={18} />
            <span>Сохранить лозунг</span>
          </span>
        </button>
      </div>
    </div>
  );
};

// ─── AdminSettings (роутер) ────────────────────────────

const AdminSettings = () => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  if (selectedTool === 'branding') {
    return <BrandingEditor onBack={() => setSelectedTool(null)} />;
  }
  if (selectedTool === 'contacts') {
    return <ContactsEditor onBack={() => setSelectedTool(null)} />;
  }
  if (selectedTool === 'motto') {
    return <MottoEditor onBack={() => setSelectedTool(null)} />;
  }

  return <ToolSelector onSelect={setSelectedTool} />;
};

export default AdminSettings;
