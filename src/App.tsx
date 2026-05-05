import { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Stores & Hooks
import { useAuthStore } from './store/useAuthStore';
import { useSessionManager } from './hooks/useSessionManager';

// Layouts & Pages
import ProtectedRoute from './components/auth/ProtectedRoute';
import DashboardLayout from './components/layouts/DashboardLayout';
import Header from './components/ui/Header';
import Footer from './components/ui/Footer';
import LoginPage from './pages/LoginPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ForcePasswordChange from './components/auth/ForcePasswordChange';
import DashboardDispatcher from './pages/dashboard/DashboardDispatcher';

// Modals
import SessionExpiredModal from './components/ui/SessionExpiredModal';
import SessionSupersededModal from './components/ui/SessionSupersededModal';
import UserBlockedModal from './components/ui/UserBlockedModal';

const AppContent = () => {
  const { 
    user, 
    isAuthenticated, 
    isInitialized, 
    _hasHydrated, 
    isLoading, 
    checkAuth 
  } = useAuthStore();

  // Реф, чтобы не спамить проверкой авторизации
  const authChecked = useRef(false);

  // Запускаем менеджер сессий
  useSessionManager();

  // Проверка авторизации: строго после гидрации и только один раз
  useEffect(() => {
    if (_hasHydrated && !authChecked.current) {
      checkAuth();
      authChecked.current = true;
    }
  }, [_hasHydrated, checkAuth]);

  // Экраны загрузки
  if (!_hasHydrated || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
          <p className="text-gray-500 text-sm animate-pulse">Проверка сессии...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 relative">
      <SessionExpiredModal />
      <SessionSupersededModal />
      <UserBlockedModal />

      <Header />
      
      <main className="grow flex flex-col">
        {isAuthenticated && user?.mustChangePassword ? (
          <ForcePasswordChange />
        ) : (
          <Routes>
            <Route 
              path="/login" 
              element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" replace />} 
            />
            <Route 
              path="/reset-password" 
              element={<ResetPasswordPage />} 
            />
            <Route 
              path="/" 
              element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" replace />} 
            />
            <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'USER']} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<DashboardDispatcher />} />
              </Route>
            </Route>
            <Route path="/unauthorized" element={
              <div className="grow flex items-center justify-center text-center p-10">
                <h1 className="text-xl font-bold text-red-600 uppercase tracking-widest">Доступ запрещен</h1>
              </div>
            } />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;