import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ChevronDown, 
  UserPlus, 
  UserMinus, 
  FileText, 
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import UsersList from '../components/dashboard/admin/UsersList'; // Позже создадим этот компонент
import AdminCreateUser from '../components/dashboard/admin/AdminCreateUser';
const AdminDashboard = () => {
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState('info'); // Текущая вкладка
  const [isUsersOpen, setIsUsersOpen] = useState(false); // Состояние выпадающего списка
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Функция для отрисовки контента в зависимости от выбранной вкладки
  const renderContent = () => {
    switch (activeTab) {
      case 'info':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Общая информация</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p className="text-gray-500">Всего проектов</p>
                <p className="text-3xl font-bold text-blue-600">24</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p className="text-gray-500">Активные заказы</p>
                <p className="text-3xl font-bold text-green-600">12</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p className="text-gray-500">Пользователи</p>
                <p className="text-3xl font-bold text-purple-600">158</p>
              </div>
            </div>
          </div>
        );
      case 'user-list':
        return <UsersList />; 
      case 'user-create':
        return (
          <AdminCreateUser 
            onUserCreated={() => {
              // Логика: переключаем вкладку на список
              setActiveTab('user-list');
              // Можно добавить уведомление: alert('Пользователь создан!');
            }}
            onCancel={() => setActiveTab('info')} // Если отмена — на главную
          />
        );
      default:
        return <div>Выберите раздел в меню</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* --- SIDEBAR --- */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}>
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen && <span className="font-bold text-xl text-blue-600">ADMIN Panel</span>}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-gray-100 rounded">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-grow px-4 space-y-2">
          {/* Вкладка Информация */}
          <button 
            onClick={() => setActiveTab('info')}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${activeTab === 'info' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <LayoutDashboard size={20} />
            {isSidebarOpen && <span className="font-medium">Информация</span>}
          </button>

          {/* Вкладка Пользователи с выпадающим списком */}
          <div>
            <button 
              onClick={() => {
                setIsUsersOpen(!isUsersOpen);
                if (!isSidebarOpen) setIsSidebarOpen(true);
              }}
              className="w-full flex items-center justify-between p-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Users size={20} />
                {isSidebarOpen && <span className="font-medium">Пользователи</span>}
              </div>
              {isSidebarOpen && <ChevronDown size={16} className={`transition-transform ${isUsersOpen ? 'rotate-180' : ''}`} />}
            </button>

            {isUsersOpen && isSidebarOpen && (
              <div className="ml-2 mt-1 space-y-1">
                <button 
                  onClick={() => setActiveTab('user-list')}
                  className={`w-full text-left p-2 text-sm rounded-md ${activeTab === 'user-list' ? 'text-blue-600 font-semibold' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  • Список пользователей
                </button>
                <button 
                  onClick={() => setActiveTab('user-create')}
                  className={`w-full text-left p-2 text-sm rounded-md ${activeTab === 'user-create' ? 'text-blue-600 font-semibold' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  • Регистрация пользователей
                </button>
              </div>
            )}
          </div>

          {/* Заглушки для будущего расширения */}
          <button className="w-full flex items-center space-x-3 p-3 rounded-lg text-gray-400 cursor-not-allowed">
            <FileText size={20} />
            {isSidebarOpen && <span className="font-medium">Заказы (Скоро)</span>}
          </button>
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center space-x-3 p-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">
              AD
            </div>
            {isSidebarOpen && (
              <div className="flex-grow overflow-hidden">
                <p className="text-sm font-bold truncate">{user?.email}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            )}
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center space-x-3 p-3 mt-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-medium">Выйти</span>}
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;