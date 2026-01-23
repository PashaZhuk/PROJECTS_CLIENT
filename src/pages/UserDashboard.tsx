// src/pages/UserDashboard.tsx
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  ShoppingCart, 
  ChevronDown, 
  PlusCircle, 
  List,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import RegisterProjectForm from '../components/dashboard/RegisterProjectForm';
import Table from '../components/ui/Table';

const UserDashboard = () => {
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Мой Дашборд</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Карточки статистики */}
              <StatCard title="Проекты" value="3" sub="2 активных" color="blue" />
              <StatCard title="Заказы" value="12" sub="5 в работе" color="green" />
              <StatCard title="На модерации" value="1" sub="Проект X" color="yellow" />
              <StatCard title="Завершенные" value="8" sub="Всего" color="purple" />
            </div>
          </div>
        );
      case 'project-list':
         return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Мои проекты</h2>
        <button 
          onClick={() => setActiveTab('project-create')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          + Новый проект
        </button>
      </div>

      <Table headers={['Название', 'Заказчик', 'Статус', 'Дата']}>
        {/* Здесь будет .map() когда придут данные, а пока — демо-строка */}
        <tr className="hover:bg-gray-50/50 transition-colors">
          <td className="p-4 font-medium text-gray-800">ВКС в переговорку</td>
          <td className="p-4 text-gray-600 font-light text-sm">ООО "Вектор"</td>
          <td className="p-4">
            <span className="px-2 py-1 rounded-md bg-yellow-100 text-yellow-700 text-xs font-bold">
              На модерации
            </span>
          </td>
          <td className="p-4 text-gray-500 text-sm">23.01.2026</td>
        </tr>
      </Table>
    </div>
  );
      case 'project-create':
        return <RegisterProjectForm onSecondaryAction={() => setActiveTab('project-list')} />;
      case 'order-list':
        return <div className="p-6 bg-white rounded-xl shadow-sm">Здесь будет история ваших заказов</div>;
      case 'order-create':
        return <div className="p-6 bg-white rounded-xl shadow-sm font-bold">Форма создания заказа (В разработке)</div>;
      default:
        return <div>Выберите раздел</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* SIDEBAR */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}>
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen && <span className="font-extrabold text-xl text-blue-600">CLIENT</span>}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-gray-100 rounded text-gray-500">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-grow px-4 space-y-2 overflow-y-auto">
          {/* Dashboard Tab */}
          <NavButton 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')}
            icon={<LayoutDashboard size={20} />}
            label="Дашборд"
            isOpen={isSidebarOpen}
          />

          {/* Projects Dropdown */}
          <DropdownMenu 
            label="Проекты"
            icon={<Briefcase size={20} />}
            isOpen={isSidebarOpen}
            isExpanded={isProjectsOpen}
            toggle={() => setIsProjectsOpen(!isProjectsOpen)}
          >
            <SubNavButton label="Мои проекты" active={activeTab === 'project-list'} onClick={() => setActiveTab('project-list')} />
            <SubNavButton label="Зарегистрировать" active={activeTab === 'project-create'} onClick={() => setActiveTab('project-create')} />
          </DropdownMenu>

          {/* Orders Dropdown */}
          <DropdownMenu 
            label="Заказы"
            icon={<ShoppingCart size={20} />}
            isOpen={isSidebarOpen}
            isExpanded={isOrdersOpen}
            toggle={() => setIsOrdersOpen(!isOrdersOpen)}
          >
            <SubNavButton label="Мои заказы" active={activeTab === 'order-list'} onClick={() => setActiveTab('order-list')} />
            <SubNavButton label="Создать заказ" active={activeTab === 'order-create'} onClick={() => setActiveTab('order-create')} />
          </DropdownMenu>
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
              {user?.name?.[0] || 'U'}
            </div>
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate text-gray-800">{user?.name || user?.email}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">{user?.role}</p>
              </div>
            )}
          </div>
          <button onClick={logout} className="w-full flex items-center gap-3 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium">
            <LogOut size={18} />
            {isSidebarOpen && <span>Выйти</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

// --- ВСПОМОГАТЕЛЬНЫЕ КОМПОНЕНТЫ (можно вынести в UI) ---

const StatCard = ({ title, value, sub, color }: any) => {
  const colors: any = {
    blue: "text-blue-600",
    green: "text-green-600",
    yellow: "text-yellow-600",
    purple: "text-purple-600"
  };
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <p className={`text-3xl font-bold my-1 ${colors[color]}`}>{value}</p>
      <p className="text-xs text-gray-400 font-medium">{sub}</p>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label, isOpen }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
      active ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-gray-500 hover:bg-gray-100'
    }`}
  >
    {icon}
    {isOpen && <span className="font-semibold text-sm">{label}</span>}
  </button>
);

const DropdownMenu = ({ label, icon, isOpen, isExpanded, toggle, children }: any) => (
  <div className="space-y-1">
    <button 
      onClick={toggle}
      className="w-full flex items-center justify-between p-3 rounded-xl text-gray-500 hover:bg-gray-100 transition-all"
    >
      <div className="flex items-center gap-3">
        {icon}
        {isOpen && <span className="font-semibold text-sm">{label}</span>}
      </div>
      {isOpen && <ChevronDown size={14} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />}
    </button>
    {isExpanded && isOpen && <div className="ml-4 space-y-1">{children}</div>}
  </div>
);

const SubNavButton = ({ label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full text-left px-4 py-2 text-sm rounded-lg transition-colors ${
      active ? 'text-blue-600 font-bold' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'
    }`}
  >
    • {label}
  </button>
);

export default UserDashboard;