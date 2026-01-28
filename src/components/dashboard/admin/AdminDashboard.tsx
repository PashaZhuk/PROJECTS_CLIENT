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
  const [isSystemOnline, setIsSystemOnline] = useState(true);
  
  const [stats, setStats] = useState({ 
    totalUsers: 0, totalManagers: 0, onlineCount: 0,
    details: { onlineUsers: 0, onlineManagers: 0 } 
  });
  const [isStatsLoading, setIsStatsLoading] = useState(false);

  // ПОЛЛИНГ И ЗАГРУЗКА
  const fetchData = useCallback(async (quiet = false) => {
    try {
      if (!quiet) setIsStatsLoading(true);
      const data = await userAPI.getAdminStats();
      setStats(data);
      setIsSystemOnline(true);
    } catch (err) {
      setIsSystemOnline(false);
      console.error("Ошибка сети:", err);
    } finally {
      if (!quiet) setTimeout(() => setIsStatsLoading(false), 300);
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
      <AdminSidebar 
        isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}
        activeTab={activeTab} setActiveTab={setActiveTab}
        isUsersOpen={isUsersOpen} setIsUsersOpen={setIsUsersOpen}
        user={user} logout={logout}
      />

      <main className="flex-1 overflow-y-auto p-12">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'info' && (
            <AdminOverview 
              stats={stats} 
              loading={isStatsLoading} 
              isOnline={isSystemOnline} 
              onRefresh={() => fetchData()} 
            />
          )}
          {activeTab === 'user-list' && <UsersList />}
          {activeTab === 'user-create' && (
            <AdminCreateUser 
              onUserCreated={() => { fetchData(); setActiveTab('user-list'); }} 
              onCancel={() => setActiveTab('info')} 
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;