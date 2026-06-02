import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft, Plus, Trash2, Save, Calendar, ChevronDown, Loader2, CheckCircle2
} from 'lucide-react';
import { PROJECT_CATEGORIES } from '../../../config/projectFields';

import projectApi from '../../../api/projects';
import type { Project } from '../../../types';

const PLACEHOLDERS: Record<string, string> = {
  customerName: 'ООО "Вектор Плюс"',
  customerInn: '123456789',
  purchasingOrg: 'ОАО "Тендер-Закупки"',
  purchasingInn: '987654321',
  customerWebsite: 'www.client-site.by',
  installationAddr: 'г. Минск, ул. Тимирязева, 67',
  ipAtcType: 'Asterisk / Yeastar S100',
  currentTelephony: 'Аналоговые телефоны Panasonic',
  industry: 'Розничная торговля / Госсектор',
  competitors: 'Cisco, Grandstream',
  keyRequirements: 'Поддержка PoE, запись звонков на SD-карту',
  additionalEquipment: 'Гарнитуры Yealink UH34, блоки питания',
  plannedActions: 'Встреча в офисе заказчика, выдача демо-фонда',
};

// Человекочитаемые названия категорий для кнопок выбора
const CATEGORY_LABELS: Record<string, string> = {
  YEALINK_PHONES: 'Yealink / IP-Телефония',
  NETWORKING: 'Networking / Сетевое оборудование',
  VIDEO_CONFERENCE: 'Video / ВКС системы',
};

interface Props {
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Project | null;
}

const DynamicProjectForm = ({ onClose, onSuccess, initialData }: Props) => {
  const isEditing = !!initialData;

  // Определяем начальную категорию
  const defaultCategory = (initialData as any)?.formType
    || (initialData as any)?.category
    || Object.keys(PROJECT_CATEGORIES)[0];

  const [selectedCategory, setSelectedCategory] = useState<string>(defaultCategory);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Получаем плоский список полей для выбранной категории
  const allFields = useMemo(
    () => PROJECT_CATEGORIES[selectedCategory] || [],
    [selectedCategory]
  );

  // Группируем поля по секциям
  const sections = useMemo(() => {
    const groups: Record<string, typeof allFields> = {};
    allFields.forEach((field) => {
      const s = field.section || 'Общая информация';
      if (!groups[s]) groups[s] = [];
      groups[s].push(field);
    });
    return Object.entries(groups);
  }, [allFields]);

  // Инициализируем formData при смене категории или при редактировании
  useEffect(() => {
    if (isEditing && initialData) {
      setFormData({
        ...(initialData.dynamicData as any || {}),
        customerName: initialData.customerName || '',
        customerInn: initialData.customerInn || (initialData as any).unp || '',
        purchaseMethod: (initialData as any).purchaseMethod || '',
        executionDate: initialData.updatedAt ? initialData.updatedAt.split('T')[0] : '',
      });
    } else {
      // Инициализируем пустые значения для всех полей
      const initial: Record<string, any> = {};
      allFields.forEach((field) => {
        initial[field.name] = field.type === 'items' ? [{ model: '', count: '' }] : '';
      });
      setFormData(initial);
    }
  }, [selectedCategory, isEditing]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (name: string, value: any) => {
    // Ограничиваем УНП/ИНН полями только цифрами, максимум 9
    if (name.toLowerCase().includes('inn') || name.toLowerCase() === 'unp') {
      const digits = value.replace(/\D/g, '');
      if (digits.length <= 9) setFormData((prev) => ({ ...prev, [name]: digits }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  // Обработчики для поля типа items (спецификация)
  const handleItemChange = (fieldName: string, index: number, subField: string, value: any) => {
    const items = Array.isArray(formData[fieldName]) ? [...formData[fieldName]] : [];
    items[index] = { ...items[index], [subField]: value };
    setFormData((prev) => ({ ...prev, [fieldName]: items }));
  };

  const addItem = (fieldName: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: [...(Array.isArray(prev[fieldName]) ? prev[fieldName] : []), { model: '', count: '' }],
    }));
  };

  const removeItem = (fieldName: string, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: (prev[fieldName] || []).filter((_: any, i: number) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Валидация УНП — ровно 9 цифр если заполнено
    const innFields = Object.keys(formData).filter(
      (k) => k.toLowerCase().includes('inn') || k.toLowerCase() === 'unp'
    );
    for (const key of innFields) {
      if (formData[key] && formData[key].length !== 9) {
        setError('Поле УНП/ИНН должно содержать ровно 9 цифр');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      // Формируем тело запроса в формате, который ожидает сервер
      const body = {
        ...formData,
        formType: selectedCategory,
        customerName: formData.customerName,
        customerInn: formData.customerInn || formData.unp,
        executionDate: formData.executionDate,
        purchaseMethod: formData.purchaseMethod,
      };

      if (isEditing && initialData) {
        await projectApi.updateProject(initialData.id, body);
      } else {
        await projectApi.createProject(body);
      }

      setIsSuccess(true);
      setTimeout(() => onSuccess(), 1000);
    } catch (err: any) {
      let message = 'Ошибка при сохранении';
      if (err?.response) {
        try {
          const data = await err.response.json();
          message = data?.error || data?.message || message;
        } catch {
          // ignore parse error
        }
      }
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Экран успеха
  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <div className="bg-white rounded-[3rem] shadow-2xl p-12 text-center animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="animate-bounce" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase">
            {isEditing ? 'Обновлено!' : 'Проект создан!'}
          </h2>
          <p className="text-slate-500 font-medium">Обновляем список проектов...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in duration-300">

        {/* Шапка */}
        <div className="p-8 border-b flex items-center justify-between bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onClose}
              className="p-3 hover:bg-white rounded-2xl transition-all shadow-sm group"
            >
              <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
            </button>
            <div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                {isEditing ? 'Редактирование проекта' : 'Новый проект'}
              </h2>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">
                {isEditing ? 'Внесите изменения и сохраните' : 'Выберите направление и заполните анкету'}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">

          {/* Ошибка */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold">
              {error}
            </div>
          )}

          {/* Выбор категории (только при создании) */}
          {!isEditing && (
            <section>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
                Направление
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.keys(PROJECT_CATEGORIES).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedCategory(key)}
                    className={`p-6 rounded-3xl border-2 transition-all text-left ${
                      selectedCategory === key
                        ? 'border-blue-600 bg-blue-50/50 shadow-lg shadow-blue-100'
                        : 'border-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-black text-slate-900 text-sm uppercase tracking-tight">
                      {CATEGORY_LABELS[key] || key}
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Секции с полями */}
          {sections.map(([sectionTitle, fields], sIdx) => {
            const sectionNum = String(sIdx + 1).padStart(2, '0');
            const cleanTitle = sectionTitle.replace(/^\d+\.\s*/, '');

            return (
              <section
                key={sectionTitle}
                className="bg-slate-50/50 rounded-[2.5rem] border border-slate-100 overflow-hidden"
              >
                <div className="px-8 py-5 border-b border-slate-100 flex items-center gap-4 bg-white">
                  <span className="w-8 h-8 rounded-xl bg-blue-600 text-white text-[10px] font-black flex items-center justify-center shadow-lg shadow-blue-100">
                    {sectionNum}
                  </span>
                  <h3 className="font-black text-slate-800 uppercase tracking-widest text-[11px] italic">
                    {cleanTitle}
                  </h3>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {fields.map((field) => {
                    const isInn = field.name.toLowerCase().includes('inn') || field.name.toLowerCase() === 'unp';
                    const label = isInn ? field.label.replace('ИНН', 'УНП') : field.label;
                    const placeholder = field.placeholder || PLACEHOLDERS[field.name] || '';
                    const isWide = field.type === 'textarea' || field.type === 'items';

                    return (
                      <div
                        key={field.name}
                        className={`flex flex-col gap-2 ${isWide ? 'md:col-span-2' : ''}`}
                      >
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                          {label}{field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>

                        {/* items — спецификация моделей */}
                        {field.type === 'items' && (
                          <div className="bg-white p-6 rounded-3xl border-2 border-dashed border-slate-200">
                            <div className="space-y-4">
                              {(Array.isArray(formData[field.name]) ? formData[field.name] : []).map(
                                (item: any, idx: number) => (
                                  <div key={idx} className="flex flex-col md:flex-row gap-3 items-end animate-in slide-in-from-right-4 duration-300">
                                    <div className="flex-1 w-full">
                                      <p className="text-[9px] font-bold text-slate-400 uppercase mb-1.5 ml-1">Модель</p>
                                      <div className="relative">
                                        <select
                                          required
                                          value={item.model || ''}
                                          onChange={(e) => handleItemChange(field.name, idx, 'model', e.target.value)}
                                          className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-blue-500 transition-all appearance-none"
                                        >
                                          <option value="">Выберите модель...</option>
                                          {field.options?.map((opt) => (
                                            <option key={opt} value={opt}>{opt}</option>
                                          ))}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                      </div>
                                    </div>
                                    <div className="w-full md:w-32">
                                      <p className="text-[9px] font-bold text-slate-400 uppercase mb-1.5 ml-1">Кол-во</p>
                                      <input
                                        type="number"
                                        required
                                        min="1"
                                        value={item.count || ''}
                                        onChange={(e) => handleItemChange(field.name, idx, 'count', e.target.value)}
                                        className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-blue-500 transition-all"
                                      />
                                    </div>
                                    {formData[field.name]?.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => removeItem(field.name, idx)}
                                        className="p-3.5 text-slate-300 hover:text-red-500 transition-colors"
                                      >
                                        <Trash2 size={20} />
                                      </button>
                                    )}
                                  </div>
                                )
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => addItem(field.name)}
                              className="mt-6 flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 px-4 py-2.5 rounded-xl border border-transparent hover:border-blue-100 transition-all"
                            >
                              <Plus size={14} /> Добавить позицию
                            </button>
                          </div>
                        )}

                        {/* textarea */}
                        {field.type === 'textarea' && (
                          <textarea
                            required={field.required}
                            value={formData[field.name] || ''}
                            onChange={(e) => handleChange(field.name, e.target.value)}
                            placeholder={placeholder}
                            className="w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none text-sm min-h-[120px] focus:border-blue-500 transition-all placeholder:text-slate-300 font-medium"
                          />
                        )}

                        {/* select */}
                        {field.type === 'select' && (
                          <div className="relative">
                            <select
                              required={field.required}
                              value={formData[field.name] || ''}
                              onChange={(e) => handleChange(field.name, e.target.value)}
                              className="w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none text-sm focus:border-blue-500 transition-all appearance-none font-medium"
                            >
                              <option value="">Выберите...</option>
                              {field.options?.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                          </div>
                        )}

                        {/* text / date */}
                        {(field.type === 'text' || field.type === 'date') && (
                          <div className="relative">
                            <input
                              type={isInn ? 'text' : field.type}
                              inputMode={isInn ? 'numeric' : undefined}
                              required={field.required}
                              value={formData[field.name] || ''}
                              onChange={(e) => handleChange(field.name, e.target.value)}
                              placeholder={placeholder}
                              className="w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none text-sm focus:border-blue-500 transition-all placeholder:text-slate-300 font-medium"
                            />
                            {field.type === 'date' && (
                              <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}

          {/* Кнопка сохранения */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full font-black py-6 rounded-[2rem] flex items-center justify-center gap-3 bg-slate-900 text-white hover:bg-blue-600 active:scale-[0.98] transition-all uppercase tracking-[0.3em] text-xs shadow-2xl shadow-slate-200 disabled:bg-slate-200 disabled:text-slate-400"
          >
            {isSubmitting
              ? <Loader2 className="animate-spin" size={20} />
              : <><Save size={20} />{isEditing ? 'Сохранить изменения' : 'Зарегистрировать проект'}</>
            }
          </button>
        </form>
      </div>
    </div>
  );
};

export default DynamicProjectForm;
