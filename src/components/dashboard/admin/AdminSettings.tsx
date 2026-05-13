import React, { useState, useEffect } from 'react';
import { Save, MapPin, Phone, Mail, Clock, Headphones, Building2, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

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

const defaultForm: ContactsForm = {
  companyName: 'ООО "АйПиМатика Бел"',
  address: '',
  city: 'г. Минск',
  phone: '',
  mobile: '',
  email: '',
  supportEmail: '',
  supportPhone: '',
  workingHours: '',
  yandexMapId: '',
};

const AdminSettings = () => {
  const [form, setForm] = useState<ContactsForm>(defaultForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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

  const handleChange = (field: keyof ContactsForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

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
      } else {
        setMessage({ type: 'error', text: data?.error || 'Ошибка сохранения' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Ошибка сети' });
    } finally {
      setSaving(false);
    }
  };

  const mapPreviewUrl = form.yandexMapId
    ? `https://yandex.ru/maps/constructor/1.0/?um=constructor%3A${form.yandexMapId}&width=100%25&height=300&lang=ru_RU&scroll=true`
    : null;

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

      {/* Сообщение */}
      {message && (
        <div className={`flex items-center gap-3 p-4 rounded-2xl border ${
          message.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Основная информация */}
        <Section title="Основная информация" icon={<Building2 size={18} className="text-purple-600" />}>
          <Field label="Название компании">
            <input value={form.companyName} onChange={handleChange('companyName')} placeholder="ООО &quot;АйПиМатика Бел&quot;" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all" />
          </Field>
          <Field label="Город">
            <input value={form.city} onChange={handleChange('city')} placeholder="г. Минск" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all" />
          </Field>
          <Field label="Адрес">
            <textarea value={form.address} onChange={handleChange('address')} rows={2} placeholder="Полный адрес" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all resize-none" />
          </Field>
        </Section>

        {/* Отдел продаж */}
        <Section title="Отдел продаж" icon={<Phone size={18} className="text-green-600" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Телефон / Факс">
              <input value={form.phone} onChange={handleChange('phone')} placeholder="+375(17) 361-96-96" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all" />
            </Field>
            <Field label="Мобильный">
              <input value={form.mobile} onChange={handleChange('mobile')} placeholder="+375(29) 361-96-96" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all" />
            </Field>
          </div>
          <Field label="Email">
            <input type="email" value={form.email} onChange={handleChange('email')} placeholder="info@ipmatika.by" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all" />
          </Field>
        </Section>

        {/* Сервисный центр */}
        <Section title="Сервисный центр" icon={<Headphones size={18} className="text-purple-600" />}>
          <Field label="Телефон">
            <input value={form.supportPhone} onChange={handleChange('supportPhone')} placeholder="+375(29) 378-96-96" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all" />
          </Field>
          <Field label="Email">
            <input type="email" value={form.supportEmail} onChange={handleChange('supportEmail')} placeholder="support@ipmatika.by" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all" />
          </Field>
        </Section>

        {/* Режим работы и карта */}
        <Section title="Режим работы и карта" icon={<Clock size={18} className="text-amber-600" />}>
          <Field label="Режим работы">
            <textarea value={form.workingHours} onChange={handleChange('workingHours')} rows={2} placeholder="понедельник-четверг — 9:00-18:00, пятница — 9:00-17:00" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all resize-none" />
          </Field>
          <Field label="ID Яндекс.Карты (из ссылки конструктора)">
            <input value={form.yandexMapId} onChange={handleChange('yandexMapId')} placeholder="85112499592fc9fcb766262465c1b80ca62edb09cd1f5b1caa6045fc3a6fc2e0" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 font-mono focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all" />
            <p className="text-xs text-gray-400 mt-1">
              ID из ссылки конструктора: <code className="bg-gray-100 px-1 rounded">constructor%3a<span className="text-blue-600">ID</span>&amp;width</code>
            </p>
          </Field>
          {mapPreviewUrl && (
            <div className="mt-2 rounded-2xl overflow-hidden border border-gray-200">
              <iframe src={mapPreviewUrl} width="100%" height="250" className="border-0" loading="lazy" title="Предпросмотр карты" />
            </div>
          )}
        </Section>

        {/* Кнопка сохранения */}
        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3.5 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-bold rounded-2xl transition-all active:scale-95 shadow-lg shadow-purple-200"
          >
            {saving ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {saving ? 'Сохранение...' : 'Сохранить контакты'}
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
