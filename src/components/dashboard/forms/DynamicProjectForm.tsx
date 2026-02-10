import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowLeft, Check, Loader2, Plus, Trash2, Info, 
  CheckCircle2, Save, Calendar, ChevronDown, MessageSquare, ClipboardList
} from 'lucide-react';
import { PROJECT_CATEGORIES } from '../../../config/projectFields';
import { useAuth } from '../../../context/AuthContext';

// Объект примеров (Placeholders)
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
  plannedActions: 'Встреча в офисе заказчика, выдача демо-фонда'
};

interface Props {
  category: string;
  onBack: () => void;
  onSubmit: () => void; // Сделали обязательным для синхронизации с Dashboard
  initialData?: any; 
  isEditing?: boolean;
}

const DynamicProjectForm: React.FC<Props> = ({ category, onBack, onSubmit, initialData, isEditing }) => {
  const { user } = useAuth();
  const allFields = useMemo(() => PROJECT_CATEGORIES[category] || [], [category]);

  const [formData, setFormData] = useState<Record<string, any>>(() => {
    if (isEditing && initialData) {
      return {
        ...(initialData.dynamicData || {}),
        customerName: initialData.customerName || initialData.dynamicData?.customerName || '',
        customerInn: initialData.customerInn || initialData.dynamicData?.customerInn || '',
        purchaseMethod: initialData.purchaseMethod || '',
        executionDate: initialData.executionDate ? initialData.executionDate.split('T')[0] : '',
      };
    }
    
    const initialState: Record<string, any> = {};
    const hasItems = allFields.find(f => f.type === 'items');
    if (hasItems) initialState[hasItems.name] = [{ model: '', count: '' }];
    return initialState;
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sections = useMemo(() => {
    const groups: Record<string, any[]> = {};
    allFields.forEach(field => {
      const s = field.section || 'Общая информация';
      if (!groups[s]) groups[s] = [];
      groups[s].push(field);
    });
    return Object.entries(groups);
  }, [allFields]);

  const handleChange = (name: string, value: any) => {
    if (name.toLowerCase().includes('inn')) {
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length <= 9) {
        setFormData(prev => ({ ...prev, [name]: digitsOnly }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (error) setError(null);
  };

  const handleItemChange = (fieldName: string, index: number, subField: string, value: any) => {
    const newItems = [...(formData[fieldName] || [])];
    newItems[index] = { ...newItems[index], [subField]: value };
    setFormData(prev => ({ ...prev, [fieldName]: newItems }));
  };

  const addItem = (fieldName: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: [...(prev[fieldName] || []), { model: '', count: '' }]
    }));
  };

  const removeItem = (fieldName: string, index: number) => {
    const newItems = formData[fieldName].filter((_: any, i: number) => i !== index);
    setFormData(prev => ({ ...prev, [fieldName]: newItems }));
  };

  // --- ОСНОВНАЯ ЛОГИКА ОТПРАВКИ ---
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация УНП
    const innFields = Object.keys(formData).filter(key => key.toLowerCase().includes('inn'));
    for (const field of innFields) {
      const val = formData[field];
      if (val && val.length !== 9) {
        setError(`Поле УНП должно содержать ровно 9 цифр`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const url = isEditing 
        ? `http://192.168.85.110:5001/api/projects/${initialData.id}`
        : 'http://192.168.85.110:5001/api/projects';
      
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', 
        body: JSON.stringify({ 
          ...formData, 
          formType: category,
          customerName: formData.customerName,
          customerInn: formData.customerInn,
          executionDate: formData.executionDate,
          purchaseMethod: formData.purchaseMethod
        })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Ошибка при сохранении');

      // 1. Сначала показываем успех локально
      setIsSuccess(true);
      
      // 2. Ждем небольшую паузу для визуального подтверждения (Checkmark)
      // 3. Вызываем onSubmit из Dashboard, который обновит список и закроет форму
      setTimeout(() => {
        onSubmit();
      }, 1000);

    } catch (err: any) {
      setError(err.message);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto mt-20 text-center p-12 bg-white rounded-[3rem] shadow-xl border border-slate-100 animate-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} className="animate-bounce" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-4 uppercase">{isEditing ? 'Обновлено!' : 'Проект создан!'}</h2>
        <p className="text-slate-500 font-medium">Обновляем ваш список проектов...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in duration-500">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold flex items-center gap-3 animate-shake">
          <Info size={18} /> {error}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <button type="button" onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all font-bold text-[10px] uppercase tracking-widest">
          <ArrowLeft size={16} /> Назад
        </button>
        <div className="md:text-right">
          <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight italic">{category.replace(/_/g, ' ')}</h1>
          <p className="text-blue-600 text-[9px] font-black uppercase tracking-[0.2em] mt-1">{isEditing ? 'Редактирование' : 'Новая регистрация'}</p>
        </div>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-8">
        {sections.map(([sectionTitle, fields]) => {
          const sectionNum = sectionTitle.match(/^(\d+)/)?.[1].padStart(2, '0') || '01';
          const cleanTitle = sectionTitle.replace(/^\d+\.\s*/, '');

          return (
            <section key={sectionTitle} className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="bg-slate-50/50 px-8 py-5 border-b border-slate-100 flex items-center gap-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-blue-600 text-white text-[10px] font-black shadow-lg shadow-blue-100">
                  {sectionNum}
                </span>
                <h2 className="font-black text-slate-800 uppercase tracking-widest text-[11px] italic">{cleanTitle}</h2>
              </div>
              
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                {fields.map((field) => {
                  const isInnField = field.name.toLowerCase().includes('inn');
                  const displayLabel = isInnField ? field.label.replace('ИНН', 'УНП') : field.label;
                  const placeholderValue = PLACEHOLDERS[field.name] || '';

                  return (
                    <div key={field.name} className={`${(field.type === 'textarea' || field.type === 'items') ? 'md:col-span-2' : ''} flex flex-col gap-2`}>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                        {displayLabel} {field.required && <span className="text-red-500">*</span>}
                      </label>

                      {field.type === 'items' ? (
                        <div className="bg-slate-50/80 p-6 rounded-3xl border-2 border-dashed border-slate-200">
                          <div className="space-y-4">
                            {(formData[field.name] || []).map((item: any, idx: number) => (
                              <div key={idx} className="flex flex-col md:flex-row gap-3 items-start md:items-end animate-in slide-in-from-right-4 duration-300">
                                <div className="flex-1 w-full">
                                  <p className="text-[9px] font-bold text-slate-400 uppercase mb-1.5 ml-1">Модель устройства</p>
                                  <div className="relative">
                                    <select 
                                      required 
                                      value={item.model} 
                                      onChange={(e) => handleItemChange(field.name, idx, 'model', e.target.value)} 
                                      className="w-full p-3.5 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none"
                                    >
                                      <option value="">Выберите модель...</option>
                                      {field.options?.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                  </div>
                                </div>
                                <div className="w-full md:w-32">
                                  <p className="text-[9px] font-bold text-slate-400 uppercase mb-1.5 ml-1">Количество</p>
                                  <input 
                                    type="number" 
                                    required 
                                    min="1" 
                                    value={item.count} 
                                    onChange={(e) => handleItemChange(field.name, idx, 'count', e.target.value)} 
                                    className="w-full p-3.5 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" 
                                  />
                                </div>
                                {formData[field.name].length > 1 && (
                                  <button type="button" onClick={() => removeItem(field.name, idx)} className="p-3.5 text-slate-300 hover:text-red-500 transition-colors mb-0.5">
                                    <Trash2 size={20} />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                          <button 
                            type="button" 
                            onClick={() => addItem(field.name)} 
                            className="mt-6 flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest hover:bg-white px-4 py-2.5 rounded-xl border border-transparent hover:border-blue-100 transition-all shadow-sm"
                          >
                            <Plus size={14} /> Добавить позицию
                          </button>
                        </div>
                      ) : field.type === 'textarea' ? (
                        <textarea 
                          required={field.required} 
                          value={formData[field.name] || ''} 
                          onChange={(e) => handleChange(field.name, e.target.value)} 
                          placeholder={placeholderValue}
                          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 min-h-[140px] text-sm outline-none transition-all placeholder:text-slate-300 font-medium" 
                        />
                      ) : (
                        <div className="relative">
                          <input 
                            type={isInnField ? "text" : field.type} 
                            inputMode={isInnField ? "numeric" : undefined}
                            required={field.required} 
                            value={formData[field.name] || ''} 
                            onChange={(e) => handleChange(field.name, e.target.value)} 
                            placeholder={placeholderValue}
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-sm transition-all placeholder:text-slate-300 font-medium" 
                          />
                          {field.type === 'date' && <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}

        <div className="flex flex-col gap-4">
          <button 
            type="submit" 
            disabled={isSubmitting} 
            className={`
              w-full font-black py-6 rounded-[2rem] flex items-center justify-center gap-4 transition-all uppercase tracking-[0.3em] text-xs shadow-2xl
              ${isSubmitting ? 'bg-slate-200 text-slate-400' : 'bg-slate-900 text-white hover:bg-blue-600 active:scale-[0.98] shadow-blue-200'}
            `}
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <><Save size={20} /> {isEditing ? 'Сохранить изменения' : 'Зарегистрировать проект'}</>
            )}
          </button>
          
          <p className="text-center text-[9px] text-slate-400 font-bold uppercase tracking-widest">
            Нажимая кнопку, вы подтверждаете достоверность данных
          </p>
        </div>
      </form>
    </div>
  );
};

export default DynamicProjectForm;