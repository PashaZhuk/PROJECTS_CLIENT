import { useOutletContext } from 'react-router-dom';
import { useAdminStats } from '../hooks/useUsersQuery';
import { useUserSockets } from '../hooks/useUserSockets';
import type { ActiveTabType } from '../types';
import AdminOverview from '../components/dashboard/admin/AdminOverview';
import UsersList from '../components/dashboard/admin/UsersList';
import AdminCreateUser from '../components/dashboard/admin/AdminCreateUser';
import LogsViewer from '../components/dashboard/admin/LogsViewer';

const AdminDashboard = () => {
  useUserSockets();

  const { activeTab, setActiveTab } = useOutletContext<{
    activeTab: ActiveTabType;
    setActiveTab: (tab: ActiveTabType) => void;
  }>();

  const { data: stats, isLoading: loading, refetch } = useAdminStats();

  const isSystemOnline = true; 

  return (
    <div className="space-y-6">
      {activeTab === 'stats' && (
        <AdminOverview 
          stats={stats} 
          loading={loading} 
          isOnline={isSystemOnline} 
          onRefresh={() => refetch()} 
        />
      )}

      {activeTab === 'users-list' && <UsersList />}

      {activeTab === 'users-create' && (
        <AdminCreateUser onCancel={() => setActiveTab('users-list')} />
      )}

      {activeTab === 'logs' && <LogsViewer />}

      {(activeTab === 'projects-list' || activeTab === 'projects-create' || activeTab === 'orders-list') && (
        <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-400">Вкладка {activeTab} в разработке</h2>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;