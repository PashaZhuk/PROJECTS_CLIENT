import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, Plus, Save, Calendar, Loader2
} from 'lucide-react';
import { PROJECT_CATEGORIES } from '../../../config/projectFields';
import { useAuthStore } from '../../../store/useAuthStore';
import projectApi from '../../../api/projects';
import type { Project } from '../../../types';

// Локальные интерфейсы для синхронизации с вашей структурой конфига
interface FieldConfig {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'date' | 'number';
  required?: boolean;
}

interface SectionConfig {
  title: string;
  fields: FieldConfig[];
}

interface CategoryConfig {
  title: string;
  sections: SectionConfig[];
}

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

interface Props {
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Project | null;
}

const DynamicProjectForm = ({ onClose, onSuccess, initialData }: Props) => {
  const user = useAuthStore((state) => state.user);
  const isEditing = !!initialData;
  
  const [selectedCategory, setSelectedCategory] = useState<string>(
    (initialData as any)?.category || Object.keys(PROJECT_CATEGORIES)[0]
  );

  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      // dynamicData из index.ts используется как хранилище полей формы
      setFormData((initialData.dynamicData as any) || {});
      if ((initialData as any).category) {
        setSelectedCategory((initialData as any).category);
      }
    }
  }, [initialData]);

  // ИСПРАВЛЕНИЕ: Конвертируем через unknown, чтобы избежать ошибки несовместимости типов
  const categoryConfig = (PROJECT_CATEGORIES as unknown as Record<string, CategoryConfig>)[selectedCategory];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isEditing && initialData) {
        await projectApi.updateProject(initialData.id, {
          data: formData,
          category: selectedCategory
        });
      } else {
        await projectApi.createProject({
          category: selectedCategory,
          data: formData,
          userId: user?.id
        });
      }
      onSuccess();
    } catch (error) {
      console.error('Ошибка при сохранении проекта:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in duration-300">
        <div className="p-8 border-b flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <button 
              type="button"
              onClick={onClose}
              className="p-3 hover:bg-white rounded-2xl transition-all shadow-sm group"
            >
              <ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                {isEditing ? 'Редактирование' : 'Новый проект'}
              </h2>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-10">
          {/* Выбор категории */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(PROJECT_CATEGORIES).map(([key, config]: [string, any]) => (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedCategory(key)}
                className={`p-6 rounded-3xl border-2 transition-all text-left ${
                  selectedCategory === key ? 'border-blue-600 bg-blue-50/50' : 'border-slate-100'
                }`}
              >
                <div className="font-bold text-slate-900">{config.title || key}</div>
              </button>
            ))}
          </section>

          {/* Отрисовка секций и полей */}
          {categoryConfig?.sections?.map((section: SectionConfig, sIdx: number) => (
            <section key={sIdx} className="space-y-6">
              <h3 className="font-black text-sm uppercase tracking-widest text-slate-900 border-l-4 border-blue-600 pl-4">
                {section.title}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {section.fields.map((field: FieldConfig) => (
                  <div key={field.id} className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                      {field.label}
                    </label>
                    <div className="relative">
                      {field.type === 'textarea' ? (
                        <textarea
                          required={field.required}
                          value={formData[field.id] || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
                          placeholder={PLACEHOLDERS[field.id]}
                          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm min-h-[120px] focus:border-blue-500 transition-all"
                        />
                      ) : (
                        <>
                          <input
                            type={field.type}
                            required={field.required}
                            value={formData[field.id] || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
                            placeholder={PLACEHOLDERS[field.id]}
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm focus:border-blue-500 transition-all"
                          />
                          {field.type === 'date' && (
                            <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full font-black py-6 rounded-[2rem] bg-slate-900 text-white hover:bg-blue-600 transition-all uppercase tracking-[0.3em] text-xs shadow-xl disabled:bg-slate-200 disabled:text-slate-400"
          >
            {isSubmitting ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Сохранить изменения'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DynamicProjectForm;