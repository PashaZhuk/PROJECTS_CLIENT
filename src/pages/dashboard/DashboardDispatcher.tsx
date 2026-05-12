import { useAuthStore } from '../../store/useAuthStore';
import AdminDashboard from '../../pages/AdminDashboard';
import ManagerDashboard from '../../pages/ManagerDashboard';
import UserDashboard from '../../pages/UserDashboard';

const DashboardDispatcher = () => {
  // Получаем юзера из Zustand
  const user = useAuthStore((state) => state.user);

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