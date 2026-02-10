import { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import userAPI from '../api/user';

// Импорт типов
import type { ActiveTabType, AdminStats } from '../types'; 

// Только необходимые компоненты
import AdminOverview from '../components/dashboard/admin/AdminOverview';
import UsersList from '../components/dashboard/admin/UsersList';
import AdminCreateUser from '../components/dashboard/admin/AdminCreateUser';

const AdminDashboard = () => {
  // 1. УБИРАЕМ 'user', чтобы не было ошибки "never read"
  // Если понадобится logout, достаем только его: const { logout } = useAuth();
  const { } = useAuth(); 
  
  // 2. Типизируем контекст
  const { activeTab, setActiveTab } = useOutletContext<{ 
    activeTab: ActiveTabType,
    setActiveTab: (tab: ActiveTabType) => void 
  }>();

  // --- СОСТОЯНИЕ МОНИТОРИНГА ---
  const [isSystemOnline, setIsSystemOnline] = useState(true);
  
  // 3. Используем интерфейс AdminStats вместо сырого объекта
  const [stats, setStats] = useState<AdminStats>({ 
    totalUsers: 0, 
    totalManagers: 0, 
    onlineCount: 0,
    details: { onlineUsers: 0, onlineManagers: 0 } 
  });
  const [isStatsLoading, setIsStatsLoading] = useState(false);

  const fetchData = useCallback(async (quiet = false) => {
    try {
      if (!quiet) setIsStatsLoading(true);
      const data = await userAPI.getAdminStats();
      // TypeScript теперь проверит соответствие данных из userAPI интерфейсу AdminStats
      setStats(data);
      setIsSystemOnline(true);
    } catch (err: any) {
      setIsSystemOnline(!!err.response);
    } finally {
      if (!quiet) {
        // Небольшая задержка для плавности анимации лоадера
        setTimeout(() => setIsStatsLoading(false), 300);
      }
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(true), 20000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <div className="w-full animate-in fade-in duration-500">
      
      {/* 1. ОБЗОР (СТАТИСТИКА) */}
      {activeTab === 'stats' && (
        <AdminOverview 
          stats={stats} 
          loading={isStatsLoading} 
          isOnline={isSystemOnline} 
          onRefresh={() => fetchData()} 
        />
      )}

      {/* 2. СПИСОК ПОЛЬЗОВАТЕЛЕЙ */}
      {activeTab === 'users-list' && <UsersList />}

      {/* 3. СОЗДАНИЕ ПОЛЬЗОВАТЕЛЯ */}
      {activeTab === 'users-create' && (
        <AdminCreateUser 
          onUserCreated={() => { 
            fetchData(); 
            setActiveTab('users-list'); 
          }} 
          onCancel={() => setActiveTab('stats')} 
        />
      )}
    </div>
  );
};

export default AdminDashboard;