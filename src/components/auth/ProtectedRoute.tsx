import type { ReactNode } from 'react';
import { Navigate, Outlet, useOutletContext } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Описываем типы ролей
type UserRole = 'ADMIN' | 'MANAGER' | 'USER';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  children?: ReactNode; // Добавляем поддержку вложенных элементов
}

const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  // Важно: получаем контекст от родительского Outlet (если он есть)
  const context = useOutletContext();

  // 1. Пока идет проверка сессии — ждем
  if (isLoading) return null;

  // 2. Если не авторизован — на логин
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3. Проверка ролей
  if (allowedRoles && user && !allowedRoles.includes(user.role as UserRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 4. РЕНДЕРИНГ:
  // Если мы используем компонент как обертку <ProtectedRoute>...</ProtectedRoute>, 
  // то возвращаем children.
  // Если мы используем его в Route element={<ProtectedRoute />}, 
  // то возвращаем Outlet и ОБЯЗАТЕЛЬНО пробрасываем context дальше.
  if (children) {
    return <>{children}</>;
  }

  return <Outlet context={context} />;
};

export default ProtectedRoute;