import { useAuth } from '../../context/AuthContext';
import AdminDashboard from '../../pages/AdminDashboard';
import ManagerDashboard from '../../pages/ManagerDashboard';
import UserDashboard from '../../pages/UserDashboard';

const DashboardDispatcher = () => {
  const { user } = useAuth();

  // Логика переключения между полноценными дашбордами
  switch (user?.role) {
    case 'ADMIN':
      return <AdminDashboard />;
    case 'MANAGER':
      return <ManagerDashboard />;
    case 'USER':
    default:
      return <UserDashboard />;
  }
};

export default DashboardDispatcher;