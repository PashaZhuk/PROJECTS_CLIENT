import { useEffect, useRef, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import { useAuthStore } from './store/useAuthStore';
import { useSessionManager } from './hooks/useSessionManager';

import ProtectedRoute from './components/auth/ProtectedRoute';
import DashboardLayout from './components/layouts/DashboardLayout';
import Header from './components/ui/Header';
import Footer from './components/ui/Footer';

import SessionExpiredModal from './components/ui/SessionExpiredModal';
import SessionSupersededModal from './components/ui/SessionSupersededModal';
import LockedModal from './components/ui/LockedModal';

// Ленивая загрузка — эти компоненты не нужны на первом экране
const LoginPage = lazy(() => import('./pages/LoginPage'))
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'))
const ForcePasswordChange = lazy(() => import('./components/auth/ForcePasswordChange'))
const DashboardDispatcher = lazy(() => import('./pages/dashboard/DashboardDispatcher'))

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-white">
    <div className="flex flex-col items-center gap-6">
      {/* Анимированные кольца */}
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-b-emerald-400 animate-spin" style={{ animationDuration: '1.2s' }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Бренд */}
      <div className="text-center">
        <h1 className="text-2xl font-black tracking-tight text-slate-800">
          IPMATIKA <span className="text-slate-300">B2B</span>
        </h1>
      </div>

      {/* Текст-заглушка */}
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  </div>
)

const AppContent = () => {
  const { 
    user, 
    isAuthenticated, 
    isInitialized, 
    _hasHydrated, 
    checkAuth,
    isUserBlocked,
    setUserBlocked
  } = useAuthStore();

  const authChecked = useRef(false);
  useSessionManager();

  useEffect(() => {
    if (_hasHydrated && !authChecked.current) {
      checkAuth();
      authChecked.current = true;
    }
  }, [_hasHydrated, checkAuth]);

  if (!_hasHydrated || !isInitialized) {
    return <PageLoader />
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 relative">
      <SessionExpiredModal />
      <SessionSupersededModal />
      <LockedModal 
        isOpen={isUserBlocked}
        onClose={() => setUserBlocked(false)}
        lockUntil={null}
        message="Ваш аккаунт заблокирован администратором. Обратитесь в поддержку."
        title="Аккаунт заблокирован"
      />

      <Header />
      
      <main className="grow flex flex-col">
        <Suspense fallback={<PageLoader />}>
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
              path="/force-change-password" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'USER']}>
                  <ForcePasswordChange />
                </ProtectedRoute>
              } 
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
        </Suspense>
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