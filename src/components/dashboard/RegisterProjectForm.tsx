import React, { useState } from 'react';
import { ClipboardList, Building2, Monitor, Wallet, Send, ArrowLeft } from 'lucide-react';
import api from '../../api/axios'; // Используем твой настроенный axios

// Описываем интерфейс пропсов для связи с Dashboard
interface RegisterProjectFormProps {
  onSecondaryAction?: () => void; 
}

const RegisterProjectForm: React.FC<RegisterProjectFormProps> = ({ onSecondaryAction }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    customerName: '', customerSite: '', customerUnp: '', buyerDetails: '',
    installAddress: '', plannedDate: '', currentPlatform: '', currentTerminals: '',
    projectTask: '', roomDescription: '', budgetStatus: '', yealinkSpec: '',
    competitors: '', tenderLink: '', testEquipment: '', demoPresentation: '',
    keyRequirements: '', nextActions: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(''); // Сбрасываем ошибку при вводе
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Отправляем данные на бэкенд
      await api.post('/projects', formData);
      
      alert("Проект успешно зарегистрирован!");
      
      // Если пропс передан (например, для перехода к списку), вызываем его
      if (onSecondaryAction) {
        onSecondaryAction();
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ошибка при сохранении проекта');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-2xl border border-gray-100 my-4">
      {/* Шапка формы */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <ClipboardList size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Регистрация проекта</h1>
        </div>
        
        {onSecondaryAction && (
          <button 
            onClick={onSecondaryAction}
            className="text-gray-400 hover:text-gray-600 flex items-center gap-1 text-sm transition-colors"
          >
            <ArrowLeft size={16} /> Назад
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Блок 1: Заказчик */}
        <section className="space-y-4">
          <div className="flex items-center text-blue-600 font-semibold mb-2">
            <Building2 className="mr-2" size={20} />
            <span>1. Информация о Заказчике</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Наименование Заказчика *" name="customerName" value={formData.customerName} onChange={handleChange} required placeholder="ООО 'Конечный пользователь'" />
            <FormField label="УНП Заказчика *" name="customerUnp" value={formData.customerUnp} onChange={handleChange} required placeholder="123456789" />
            <FormField label="Сайт Заказчика" name="customerSite" value={formData.customerSite} onChange={handleChange} placeholder="https://..." />
            <FormField label="Закупочная организация" name="buyerDetails" value={formData.buyerDetails} onChange={handleChange} placeholder="Наименование уполномоченной организации" isFullWidth />
          </div>
        </section>

        {/* Блок 2: Технические детали */}
        <section className="space-y-4">
          <div className="flex items-center text-blue-600 font-semibold mb-2">
            <Monitor className="mr-2" size={20} />
            <span>2. ТЗ и площадка</span>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <FormField label="Адрес установки *" name="installAddress" value={formData.installAddress} onChange={handleChange} required />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Дата реализации *" name="plannedDate" type="date" value={formData.plannedDate} onChange={handleChange} required />
              <FormField label="Текущая платформа ВКС" name="currentPlatform" value={formData.currentPlatform} onChange={handleChange} />
            </div>
            <FormTextArea label="Описание задачи *" name="projectTask" value={formData.projectTask} onChange={handleChange} required rows={3} />
          </div>
        </section>

        {/* Блок 3: Спецификация */}
        <section className="space-y-4">
          <div className="flex items-center text-blue-600 font-semibold mb-2">
            <Wallet className="mr-2" size={20} />
            <span>3. Коммерция</span>
          </div>
          <FormTextArea 
            label="Спецификация Yealink *" 
            name="yealinkSpec" 
            value={formData.yealinkSpec} 
            onChange={handleChange} 
            required 
            className="bg-blue-50/30 border-blue-100"
          />
        </section>

        {/* Кнопки управления */}
        <div className="flex justify-end items-center space-x-4 pt-6 border-t">
          {onSecondaryAction && (
            <button 
              type="button"
              onClick={onSecondaryAction}
              className="px-6 py-3 text-gray-500 hover:text-gray-700 font-medium transition-colors"
            >
              Отмена
            </button>
          )}
          <button 
            type="submit" 
            disabled={loading}
            className={`flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-10 rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send size={18} />
            )}
            <span>{loading ? 'Отправка...' : 'Зарегистрировать проект'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

// Вспомогательные микро-компоненты для чистоты кода
const FormField = ({ label, isFullWidth, ...props }: any) => (
  <div className={`space-y-1 ${isFullWidth ? 'md:col-span-2' : ''}`}>
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input {...props} className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
  </div>
);

const FormTextArea = ({ label, ...props }: any) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <textarea {...props} className={`w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${props.className}`} />
  </div>
);

export default RegisterProjectForm;