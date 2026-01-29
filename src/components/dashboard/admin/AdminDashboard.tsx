import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import userAPI from '../../../api/user';
import AdminSidebar from './AdminSidebar';
import AdminOverview from './AdminOverview';
import UsersList from './UsersList';
import AdminCreateUser from './AdminCreateUser';

const AdminDashboard = () => {
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState('info');
  const [isUsersOpen, setIsUsersOpen] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Статус системы: теперь он управляется более умно
  const [isSystemOnline, setIsSystemOnline] = useState(true);
  
  const [stats, setStats] = useState({ 
    totalUsers: 0, 
    totalManagers: 0, 
    onlineCount: 0,
    details: { onlineUsers: 0, onlineManagers: 0 } 
  });
  const [isStatsLoading, setIsStatsLoading] = useState(false);

  // --- ЛОГИКА ЗАГРУЗКИ ДАННЫХ ---
  const fetchData = useCallback(async (quiet = false) => {
    try {
      if (!quiet) setIsStatsLoading(true);
      
      const data = await userAPI.getAdminStats();
      
      setStats(data);
      // Если запрос прошел успешно — система точно онлайн
      setIsSystemOnline(true);
    } catch (err: any) {
      /**
       * КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ:
       * Если в ошибке есть 'response', значит сервер ОТВЕТИЛ (например, 401 или 500).
       * Это значит, что сервер ЖИВ. 401 ошибку обработает твой Axios Interceptor
       * и перенаправит на логин. Мы не ставим статус OFFLINE в этом случае.
       */
      if (err.response) {
        setIsSystemOnline(true);
        console.warn("Сервер ответил ошибкой, но он онлайн:", err.response.status);
      } else {
        // Ошибка без ответа (Network Error / Connection Refused)
        setIsSystemOnline(false);
        console.error("Сервер действительно недоступен (Offline)");
      }
    } finally {
      if (!quiet) {
        // Небольшая задержка для плавности анимации
        setTimeout(() => setIsStatsLoading(false), 300);
      }
    }
  }, []);

  // Интервал обновления (20 секунд)
  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(true), 20000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans text-slate-900">
      {/* ЛЕВАЯ ПАНЕЛЬ (SIDEBAR) */}
      <AdminSidebar 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen}
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        isUsersOpen={isUsersOpen} 
        setIsUsersOpen={setIsUsersOpen}
        user={user} 
        logout={logout}
      />

      {/* ОСНОВНОЙ КОНТЕНТ */}
      <main className="flex-1 overflow-y-auto p-12">
        <div className="max-w-6xl mx-auto">
          
          {/* ОБЗОР (СТАТИСТИКА) */}
          {activeTab === 'info' && (
            <AdminOverview 
              stats={stats} 
              loading={isStatsLoading} 
              isOnline={isSystemOnline} 
              onRefresh={() => fetchData()} 
            />
          )}

          {/* СПИСОК ПОЛЬЗОВАТЕЛЕЙ */}
          {activeTab === 'user-list' && <UsersList />}

          {/* СОЗДАНИЕ ПОЛЬЗОВАТЕЛЯ */}
          {activeTab === 'user-create' && (
            <AdminCreateUser 
              onUserCreated={() => { 
                fetchData(); 
                setActiveTab('user-list'); 
              }} 
              onCancel={() => setActiveTab('info')} 
            />
          )}
          
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;