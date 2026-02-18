import { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useUserSockets } from '../hooks/useUserSockets';

import userAPI from '../api/user';

// Импорт типов
import type { ActiveTabType, AdminStats } from '../types'; 

// Компоненты
import AdminOverview from '../components/dashboard/admin/AdminOverview';
import UsersList from '../components/dashboard/admin/UsersList';
import AdminCreateUser from '../components/dashboard/admin/AdminCreateUser';

const AdminDashboard = () => {
  // Активируем сокеты
  useUserSockets();
  
  // Типизируем контекст из Layout
  const { activeTab, setActiveTab } = useOutletContext<{ 
    activeTab: ActiveTabType,
    setActiveTab: (tab: ActiveTabType) => void 
  }>();

  // --- СОСТОЯНИЕ МОНИТОРИНГА ---
  const [isSystemOnline, setIsSystemOnline] = useState(true);
  
  // Состояние статистики
  const [stats, setStats] = useState<AdminStats>({ 
    totalUsers: 0, 
    totalManagers: 0, 
    onlineCount: 0,
    details: { onlineUsers: 0, onlineManagers: 0 } 
  });
  const [isStatsLoading, setIsStatsLoading] = useState(false);

  // Мемоизированная функция загрузки данных
  const fetchData = useCallback(async (quiet = false) => {
    try {
      if (!quiet) setIsStatsLoading(true);
      
      /** * ИЗМЕНЕНИЕ ПОД KY: 
       * userAPI.getAdminStats() теперь возвращает сразу распарсенный JSON.
       * Больше не нужно обращаться к .data, как в axios.
       */
      const response: any = await userAPI.getAdminStats();
      
      // Если бэкенд все еще оборачивает данные в { status: 'success', data: {...} }
      // оставляем проверку, но учитываем, что axios-обертки .data больше нет.
      const data = response.data || response;
      
      setStats(data);
      setIsSystemOnline(true);
    } catch (err: any) {
      /**
       * В ky объект ошибки содержит response вместо error.response.
       */
      setIsSystemOnline(!!err.response);
      console.error("Dashboard statistics fetch error:", err);
    } finally {
      if (!quiet) {
        setTimeout(() => setIsStatsLoading(false), 300);
      }
    }
  }, []);

  // --- УПРАВЛЕНИЕ ЖИЗНЕННЫМ ЦИКЛОМ ЗАПРОСОВ ---
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (activeTab === 'stats') {
      fetchData(); 

      interval = setInterval(() => {
        fetchData(true); 
      }, 20000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [fetchData, activeTab]);

  return (
    <div className="w-full animate-in fade-in duration-500">
      
      {/* 1. ОБЗОР (СТАТИСТИКА) */}
      {activeTab === 'stats' && (
        <AdminOverview 
          stats={stats} 
          loading={isStatsLoading} 
          isOnline={isSystemOnline} 
          onRefresh={() => fetchData(false)} 
        />
      )}

      {/* 2. СПИСОК ПОЛЬЗОВАТЕЛЕЙ */}
      {activeTab === 'users-list' && <UsersList />}

      {/* 3. СОЗДАНИЕ ПОЛЬЗОВАТЕЛЯ */}
      {activeTab === 'users-create' && (
        <AdminCreateUser 
          onCancel={() => setActiveTab('users-list')} 
        />
      )}
    </div>
  );
};

export default AdminDashboard;