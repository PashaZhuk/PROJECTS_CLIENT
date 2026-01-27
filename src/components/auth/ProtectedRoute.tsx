import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Описываем типы ролей, которые есть в системе
type UserRole = 'ADMIN' | 'MANAGER' | 'USER';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[]; // Опционально: список ролей, которым разрешен доступ
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // 1. Пока идет проверка сессии, ничего не рендерим (или спиннер)
  if (isLoading) return null;

  // 2. Если пользователь вообще не авторизован — отправляем на логин
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3. Если роли указаны, проверяем, есть ли роль текущего юзера в списке разрешенных
  if (allowedRoles && user && !allowedRoles.includes(user.role as UserRole)) {
    // Если доступа нет — отправляем на страницу "Нет доступа" или в корень своего дашборда
    return <Navigate to="/unauthorized" replace />;
  }

  // 4. Если всё хорошо — рендерим дочерние элементы (Outlet для вложенных роутов)
  return <Outlet />;
};

export default ProtectedRoute;