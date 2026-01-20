import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  ShoppingCart, 
  ChevronDown, 
  ChevronRight,
  List,
  PlusCircle,
  PackagePlus
} from 'lucide-react';

const DashboardPage = () => {
  // Состояния для раскрывающихся списков
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);

  // Общие стили для ссылок
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
      isActive
        ? 'bg-blue-50 text-blue-600 font-semibold shadow-sm'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`;

  const subLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center space-x-3 pl-11 pr-4 py-2 rounded-lg text-sm transition-all duration-200 ${
      isActive
        ? 'text-blue-600 font-medium'
        : 'text-gray-500 hover:text-blue-500 hover:bg-gray-50'
    }`;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-gray-50">
      {/* Боковая панель */}
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Рабочая область
          </h2>
        </div>

        <nav className="flex-1 px-3 space-y-2">
          {/* Пункт Дашборд (верхний) */}
          <NavLink to="/dashboard/main" className={linkClass}>
            <LayoutDashboard className="w-5 h-5" />
            <span>Дашборд</span>
          </NavLink>

          {/* Группа Проекты */}
          <div className="space-y-1">
            <button
              onClick={() => setIsProjectsOpen(!isProjectsOpen)}
              className="w-full flex items-center justify-between px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Briefcase className="w-5 h-5" />
                <span className="font-medium">Проекты</span>
              </div>
              {isProjectsOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>

            {isProjectsOpen && (
              <div className="space-y-1 animate-in fade-in slide-in-from-top-1">
                <NavLink to="/dashboard/projects" className={subLinkClass}>
                  <List className="w-4 h-4" />
                  <span>Мои проекты</span>
                </NavLink>
                <NavLink to="/dashboard/projects/new" className={subLinkClass}>
                  <PlusCircle className="w-4 h-4" />
                  <span>Зарегистрировать проект</span>
                </NavLink>
              </div>
            )}
          </div>

          {/* Группа Заказы */}
          <div className="space-y-1">
            <button
              onClick={() => setIsOrdersOpen(!isOrdersOpen)}
              className="w-full flex items-center justify-between px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-3">
                <ShoppingCart className="w-5 h-5" />
                <span className="font-medium">Заказы</span>
              </div>
              {isOrdersOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>

            {isOrdersOpen && (
              <div className="space-y-1 animate-in fade-in slide-in-from-top-1">
                <NavLink to="/dashboard/orders" className={subLinkClass}>
                  <List className="w-4 h-4" />
                  <span>Мои заказы</span>
                </NavLink>
                <NavLink to="/dashboard/orders/new" className={subLinkClass}>
                  <PackagePlus className="w-4 h-4" />
                  <span>Создать заказ</span>
                </NavLink>
              </div>
            )}
          </div>
        </nav>
      </aside>

      {/* Контент */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;