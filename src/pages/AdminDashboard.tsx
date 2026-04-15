import { useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore'; // Достаем стор
import { useUserSockets } from '../hooks/useUserSockets';
import type { ActiveTabType } from '../types';
import AdminOverview from '../components/dashboard/admin/AdminOverview';
import UsersList from '../components/dashboard/admin/UsersList';
import AdminCreateUser from '../components/dashboard/admin/AdminCreateUser';

const AdminDashboard = () => {
  // 1. Активируем сокеты (они обновляют useUserStore при событии stats_updated)
  useUserSockets();

  const { activeTab, setActiveTab } = useOutletContext<{
    activeTab: ActiveTabType;
    setActiveTab: (tab: ActiveTabType) => void;
  }>();

  // 2. Берем данные и методы напрямую из стора
  // Теперь статистика реактивна: как только сокет получит данные, компонент перерисуется
  const stats = useUserStore((state) => state.stats);
  const fetchStats = useUserStore((state) => state.fetchStats);
  const loading = useUserStore((state) => state.loading);

  // Используем заглушку для онлайна системы (можно завязать на socket.connected)
  const isSystemOnline = true; 

  const fetchData = useCallback(async (quiet = false) => {
    try {
      await fetchStats(quiet);
    } catch (err: any) {
      console.error("Dashboard statistics fetch error:", err);
    }
  }, [fetchStats]);

  // 3. Первичная загрузка данных (только если данных в сторе еще нет)
  useEffect(() => {
    if (activeTab === 'stats' && !stats) {
      fetchData();
    }
  }, [activeTab, stats, fetchData]);

  return (
    <div className="space-y-6">
      {/* СТАТИСТИКА */}
      {activeTab === 'stats' && (
        <AdminOverview 
          stats={stats} 
          loading={loading} 
          isOnline={isSystemOnline} 
          onRefresh={() => fetchData(false)} 
        />
      )}

      {/* СПИСОК ПОЛЬЗОВАТЕЛЕЙ */}
      {activeTab === 'users-list' && <UsersList />}

      {/* СОЗДАНИЕ ПОЛЬЗОВАТЕЛЯ */}
      {/* Добавляем onCancel, чтобы избежать ошибки TS */}
      {activeTab === 'users-create' && (
        <AdminCreateUser onCancel={() => setActiveTab('users-list')} />
      )}

      {/* Заглушки для остальных вкладок, если они выбраны */}
      {(activeTab === 'projects-list' || activeTab === 'projects-create' || activeTab === 'orders-list') && (
        <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-400">Вкладка {activeTab} в разработке</h2>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;