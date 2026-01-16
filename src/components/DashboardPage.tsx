import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  BarChart3, 
  Calendar, 
  FileText, 
  Settings, 
  Users, 
  DollarSign,
  Bell,
  TrendingUp
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const stats = [
    { label: 'Активные проекты', value: '12', icon: FileText, color: 'bg-blue-500' },
    { label: 'Новые сообщения', value: '5', icon: Bell, color: 'bg-green-500' },
    { label: 'Доход за месяц', value: '$4,250', icon: DollarSign, color: 'bg-purple-500' },
    { label: 'Новые пользователи', value: '23', icon: Users, color: 'bg-orange-500' },
  ];

  const recentActivities = [
    { id: 1, action: 'Новый проект создан', time: '10 минут назад' },
    { id: 2, action: 'Задача выполнена', time: '1 час назад' },
    { id: 3, action: 'Получен новый заказ', time: '2 часа назад' },
    { id: 4, action: 'Обновление системы', time: '1 день назад' },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Добро пожаловать, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Вот что происходит в вашей системе сегодня
          </p>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} h-12 w-12 rounded-lg flex items-center justify-center`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* График активности */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Активность</h2>
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">График активности будет отображаться здесь</p>
                </div>
              </div>
            </div>
          </div>

          {/* Недавние действия */}
          <div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Недавние действия</h2>
              <div className="space-y-4">
                {recentActivities.map(activity => (
                  <div key={activity.id} className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="h-2 w-2 rounded-full bg-blue-500 mr-3"></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Быстрые действия */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Быстрые действия</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
              onClick={() => navigate('/projects')}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-4 flex items-center space-x-3 transition-colors"
            >
              <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-white font-medium">Новый проект</span>
            </button>
            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-4 flex items-center space-x-3 transition-colors">
              <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-white font-medium">Команда</span>
            </button>
            <button 
              onClick={() => navigate('/profile')}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-4 flex items-center space-x-3 transition-colors"
            >
              <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center">
                <Settings className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-white font-medium">Настройки</span>
            </button>
            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-4 flex items-center space-x-3 transition-colors">
              <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-white font-medium">Отчеты</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;