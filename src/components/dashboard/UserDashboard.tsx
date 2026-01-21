import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, Clock, FileText } from 'lucide-react';

const UserDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">Добро пожаловать, {user?.name}!</h1>
        <p className="text-gray-500 mt-2">Здесь вы можете отслеживать статус ваших проектов.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Карточка проекта (заглушка) */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 hover:border-blue-200 transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-600 transition-colors">
              <Briefcase className="text-blue-600 group-hover:text-white" />
            </div>
            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-bold">В работе</span>
          </div>
          <h3 className="font-bold text-lg mb-2">Название вашего проекта</h3>
          <p className="text-sm text-gray-500 line-clamp-2">Описание проекта, которое администратор заполнил для вас...</p>
          <div className="mt-4 pt-4 border-t border-gray-50 flex items-center text-xs text-gray-400">
            <Clock className="h-3 w-3 mr-1" />
            Обновлено: 2 часа назад
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;