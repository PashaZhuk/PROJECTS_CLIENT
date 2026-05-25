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

import logo from './assets/logo.webp'

const PageLoader = () => (
  <div className="loader-wrapper">
    <div className="loader-container">
      <div className="loader-glow" />
      <div className="loader-orbit orbit-1" />
      <div className="loader-orbit orbit-2" />
      <div className="absolute w-[80px] h-[80px] bg-white rounded-full shadow-md" style={{ zIndex: 1 }} />
      <img src={logo} alt="Loading..." className="loader-logo" />
      <div className="loader-text">ЗАГРУЗКА<span>.</span><span>.</span><span>.</span></div>
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