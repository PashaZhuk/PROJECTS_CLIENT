import React, { useState, useEffect, useCallback } from 'react';
import { Save, MapPin, Phone, Mail, Clock, Headphones, Building2, Loader2, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import YandexMap from '../../ui/YandexMap';

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

// Обёртка input с валидацией
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

const AdminSettings = () => {
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
      // Обрезаем лишние пробелы перед отправкой
      const trimmed = Object.fromEntries(
        Object.entries(form).map(([k, v]) => [k, typeof v === 'string' ? v.trim() : v])
      );
      const res = await fetch('/api/admin/settings/contacts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ value: trimmed }),
      });
      const data = await res.json();
      if (data?.success) {
        setForm(prev => ({ ...prev, ...trimmed }));
        setMessage({ type: 'success', text: 'Контакты сохранены' });
      } else {
        setMessage({ type: 'error', text: data?.error || 'Ошибка сохранения' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Ошибка сети' });
    } finally {
      setSaving(false);
    }
  };

  const hasmapId = Boolean(form.yandexMapId);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 size={32} className="animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Настройки <span className="text-purple-600">портала</span>
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Редактирование контактной информации и карты
        </p>
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
                  <div className="absolute right-0 top-full mt-2 w-80 p-4 bg-gray-900 text-white text-xs rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
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
          {hasmapId && (
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
            className="group flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:from-gray-300 disabled:to-gray-300 text-white font-bold text-sm tracking-wider uppercase rounded-2xl transition-all duration-300 active:scale-[0.97] disabled:active:scale-100 shadow-lg shadow-purple-200/60 hover:shadow-xl hover:shadow-purple-300/40 disabled:shadow-none"
          >
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Сохранение...</span>
              </>
            ) : (
              <>
                <Save size={18} className="group-hover:scale-110 transition-transform duration-200" />
                <span>Сохранить контакты</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

// Вспомогательные компоненты
const Section = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
    <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
      {icon}
      <h3 className="text-sm font-black uppercase tracking-wider text-gray-600">{title}</h3>
    </div>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
    {children}
  </div>
);

export default AdminSettings;
