import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../layouts/Sidebar';

// Определяем все возможные вкладки для всех ролей сразу
export type ActiveTabType = 
  | 'stats'           // Общее
  | 'projects-list'    // Юзер: мои, Менеджер: все
  | 'projects-create'  // Только Юзер
  | 'users-list'       // Только Админ
  | 'users-create'     // Только Админ
  | 'orders';          // Заглушка

const DashboardLayout = () => {
  // По умолчанию открываем 'stats' (Обзор)
  const [activeTab, setActiveTab] = useState<ActiveTabType>('stats');

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans text-slate-900">
      {/* Sidebar теперь один, он сам подстроится под роль */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto p-8 lg:p-12">
        <div className="max-w-7xl mx-auto">
          {/* Outlet передает активную вкладку внутрь Дашбордов */}
          <Outlet context={{ activeTab, setActiveTab }} />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;