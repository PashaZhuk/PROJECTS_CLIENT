import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import { useAuthStore } from './store/useAuthStore';

import ProtectedRoute from './components/auth/ProtectedRoute';
import DashboardLayout from './components/layouts/DashboardLayout';
import Header from './components/ui/Header';
import Footer from './components/ui/Footer';
import LoginPage from './pages/Loginpage';
import ForcePasswordChange from './components/auth/ForсePasswordChange';
import DashboardDispatcher from './pages/dashboard/DashboardDispatcher';

const AppContent = () => {
  const { user, isAuthenticated, isInitialized, _hasHydrated, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  // Шаг 1: ждём гидрации localStorage
  if (!_hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600"></div>
      </div>
    );
  }

  // Шаг 2: ждём завершения checkAuth — пока идёт запрос к серверу, не рендерим роуты.
  // Это устраняет мигание: дашборд не показывается раньше времени и не происходит
  // ложный редирект на /login пока сервер ещё не ответил.
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="grow flex flex-col">
        {isAuthenticated && user?.mustChangePassword && <ForcePasswordChange />}

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
