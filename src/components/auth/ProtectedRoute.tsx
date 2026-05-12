import type { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

type UserRole = 'ADMIN' | 'MANAGER' | 'USER';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  children?: ReactNode;
}

const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuthStore();

  // К этому моменту App.tsx уже гарантировал что _hasHydrated=true и isInitialized=true,
  // поэтому здесь достаточно просто проверить isAuthenticated.

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role as UserRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;