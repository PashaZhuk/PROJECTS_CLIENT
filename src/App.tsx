import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Stores & Hooks
import { useAuthStore } from './store/useAuthStore';
import { useSessionManager } from './hooks/useSessionManager'; // <-- Новый супер-хук

// Layouts & Pages
import ProtectedRoute from './components/auth/ProtectedRoute';
import DashboardLayout from './components/layouts/DashboardLayout';
import Header from './components/ui/Header';
import Footer from './components/ui/Footer';
import LoginPage from './pages/Loginpage';
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

  // 🔥 ВСЯ ЛОГИКА БЕЗОПАСНОСТИ ТЕПЕРЬ ЗДЕСЬ (одной строкой)
  // Таймеры, сокеты, слушатели событий — всё внутри
  useSessionManager();

  // Проверка авторизации при старте
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Экраны загрузки
  if (!_hasHydrated || !isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 relative">
      {/* Модалки глобального состояния */}
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