import type { ReactNode } from 'react';
import { Navigate, Outlet, useOutletContext } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

type UserRole = 'ADMIN' | 'MANAGER' | 'USER';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  children?: ReactNode;
}

const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading, isInitialized, _hasHydrated } = useAuthStore();
  const context = useOutletContext();

  // 1. Ждем, пока Zustand подтянет данные из LocalStorage
  if (!_hasHydrated) return null;

  // 2. Если мы ЕЩЕ НЕ получили ответ от сервера (isInitialized === false)
  // И при этом в памяти НЕТ данных о юзере (из localStorage) — только тогда показываем лоадер.
  if (!isInitialized && !isAuthenticated) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600"></div>
      </div>
    );
  }

  // 3. РЕДИРЕКТ: Только если проверка на сервере ЗАВЕРШЕНА и юзер не найден
  // Это предотвращает вылет в момент, когда checkAuth еще в процессе
  if (isInitialized && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 4. Проверка ролей (если пользователь авторизован)
  if (isAuthenticated && allowedRoles && user && !allowedRoles.includes(user.role as UserRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Если всё ок — рендерим контент
  return children ? <>{children}</> : <Outlet context={context} />;
};

export default ProtectedRoute;