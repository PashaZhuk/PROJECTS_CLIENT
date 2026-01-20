import React, { useState } from 'react';
import { ClipboardList, Building2, Monitor, Wallet, Send } from 'lucide-react';

const RegisterProjectForm = () => {
  const [formData, setFormData] = useState({
    customerName: '', customerSite: '', customerUnp: '', buyerDetails: '',
    installAddress: '', plannedDate: '', currentPlatform: '', currentTerminals: '',
    projectTask: '', roomDescription: '', budgetStatus: '', yealinkSpec: '',
    competitors: '', tenderLink: '', testEquipment: '', demoPresentation: '',
    keyRequirements: '', nextActions: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Отправка данных:", formData);
    // Здесь будет ваш вызов api.post('/projects', formData)
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-2xl border border-gray-100 my-8">
      <div className="flex items-center space-x-3 mb-8 pb-4 border-b">
        <div className="bg-blue-600 p-2 rounded-lg text-white">
          <ClipboardList size={24} />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Регистрация нового проекта</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Блок 1: Заказчик */}
        <section className="space-y-4">
          <div className="flex items-center text-blue-600 font-semibold mb-2">
            <Building2 className="mr-2" size={20} />
            <span>1. Информация о Заказчике</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Наименование Заказчика *</label>
              <input required name="customerName" onChange={handleChange} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none" placeholder="ООО 'Конечный пользователь'" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">УНП Заказчика *</label>
              <input required name="customerUnp" onChange={handleChange} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none" placeholder="123456789" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Сайт Заказчика</label>
              <input name="customerSite" onChange={handleChange} className="w-full p-2 border rounded-md" placeholder="https://..." />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Закупочная организация (если отличается)</label>
              <input name="buyerDetails" onChange={handleChange} className="w-full p-2 border rounded-md font-light text-sm" placeholder="УНП и наименование уполномоченной организации" />
            </div>
          </div>
        </section>

        {/* Блок 2: Технические детали */}
        <section className="space-y-4">
          <div className="flex items-center text-blue-600 font-semibold mb-2">
            <Monitor className="mr-2" size={20} />
            <span>2. Техническое задание и площадка</span>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Адреса установки оборудования *</label>
              <input required name="installAddress" onChange={handleChange} className="w-full p-2 border rounded-md" placeholder="Город, улица, дом, помещение" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Планируемая дата реализации *</label>
                <input required type="date" name="plannedDate" onChange={handleChange} className="w-full p-2 border rounded-md" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Текущая платформа/сервер ВКС</label>
                <input name="currentPlatform" onChange={handleChange} className="w-full p-2 border rounded-md" placeholder="Чем пользуются сейчас?" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Описание задачи и сценарий использования *</label>
              <textarea required name="projectTask" onChange={handleChange} rows={3} className="w-full p-2 border rounded-md" placeholder="Внутренние совещания, обучение, число участников..." />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Описание помещений *</label>
              <textarea required name="roomDescription" onChange={handleChange} rows={2} className="w-full p-2 border rounded-md" placeholder="Размеры комнат, кол-во человек в каждой..." />
            </div>
          </div>
        </section>

        {/* Блок 3: Спецификация и Бюджет */}
        <section className="space-y-4">
          <div className="flex items-center text-blue-600 font-semibold mb-2">
            <Wallet className="mr-2" size={20} />
            <span>3. Коммерческая информация</span>
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Планируемая спецификация Yealink *</label>
              <textarea required name="yealinkSpec" onChange={handleChange} rows={3} className="w-full p-2 border border-blue-200 rounded-md bg-blue-50/30" placeholder="Модели и количество оборудования" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Бюджет ВКС (статус и величина)</label>
                <input name="budgetStatus" onChange={handleChange} className="w-full p-2 border rounded-md" placeholder="Выделен / Не выделен / Сумма" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Ссылка на тендер</label>
                <input name="tenderLink" onChange={handleChange} className="w-full p-2 border rounded-md" placeholder="Если опубликовано" />
              </div>
            </div>
          </div>
        </section>

        {/* Блок 4: Обязательные требования */}
        <section className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
          <h3 className="font-bold text-gray-800">Ключевые требования и действия</h3>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 font-bold">Оборудование на тестирование *</label>
              <textarea required name="testEquipment" onChange={handleChange} rows={2} className="w-full p-2 border rounded-md bg-white" placeholder="Что требуется и когда? Если нет - почему?" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 font-bold">Ключевые требования к решению *</label>
              <textarea required name="keyRequirements" onChange={handleChange} rows={2} className="w-full p-2 border rounded-md bg-white" placeholder="Для успешной реализации проекта..." />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 font-bold">Планируемые действия *</label>
              <textarea required name="nextActions" onChange={handleChange} rows={2} className="w-full p-2 border rounded-md bg-white" placeholder="Встречи, демо, подготовка ТЗ..." />
            </div>
          </div>
        </section>

        <div className="flex justify-end pt-6">
          <button type="submit" className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-blue-200 active:scale-95">
            <Send size={18} />
            <span>Зарегистрировать проект</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterProjectForm;