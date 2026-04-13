import { useEffect, useRef, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { useAuthStore } from './store/useAuthStore';
import { socket } from '../src/api/socket'; // <-- Убедись, что путь к твоему экземпляру socket корректен
import ProtectedRoute from './components/auth/ProtectedRoute';
import DashboardLayout from './components/layouts/DashboardLayout';
import Header from './components/ui/Header';
import Footer from './components/ui/Footer';
import LoginPage from './pages/Loginpage';
import ForcePasswordChange from './components/auth/ForcePasswordChange';
import DashboardDispatcher from './pages/dashboard/DashboardDispatcher';
import SessionExpiredModal from './components/ui/SessionExpiredModal';
import SessionSupersededModal from './components/ui/SessionSupersededModal';

const INACTIVITY_LIMITS = {
  USER: 30 * 60 * 1000,
  MANAGER: 2 * 60 * 60 * 1000,
  ADMIN: 2 * 60 * 60 * 1000
};

const AppContent = () => {
  const {
    user,
    isAuthenticated,
    isInitialized,
    _hasHydrated,
    isLoading,
    checkAuth,
    setSessionExpired,
    setSessionSuperseded, // <-- Добавили метод из стора
    logout
  } = useAuthStore();

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- ЛОГИКА SOCKET.IO (Single Device Login) ---
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      // 1. Заходим в персональную комнату (сервер ждет это событие)
      socket.emit('join_self_room', user.id);

      // 2. Слушаем сигнал "тебя вытеснили"
      socket.on('session_superseded', () => {
        console.warn('⚠️ Обнаружен вход с другого устройства. Сессия завершена.');
        setSessionSuperseded(true);
        // Мы не вызываем здесь logout() сразу, 
        // так как SessionSupersededModal сделает это при нажатии на кнопку
      });

      return () => {
        socket.off('session_superseded');
      };
    }
  }, [isAuthenticated, user?.id, setSessionSuperseded]);

  // --- ЛОГИКА ТАЙМАУТА ---
  const resetTimer = useCallback(() => {
    if (!isAuthenticated || !user) return;
    if (timerRef.current) clearTimeout(timerRef.current);

    const limit = user.role === 'USER' ? INACTIVITY_LIMITS.USER : INACTIVITY_LIMITS.MANAGER;

    timerRef.current = setTimeout(async () => {
      console.log(`[SessionTimer] ⏰ Сессия истекла (неактивность)`);
      try {
        await logout();
        setSessionExpired(true);
      } catch (e) {
        console.error('Logout failed:', e);
      }
    }, limit);
  }, [isAuthenticated, user, setSessionExpired, logout]);

  useEffect(() => {
    if (isAuthenticated && user) {
      resetTimer();
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isAuthenticated, user, resetTimer]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'];
    const handleActivity = () => resetTimer();
    events.forEach(event => window.addEventListener(event, handleActivity, { passive: true }));
    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
    };
  }, [isAuthenticated, resetTimer]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (!_hasHydrated || !isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 relative">
      <SessionExpiredModal />
      <SessionSupersededModal />

      <Header />
      
      <main className="grow flex flex-col">
        {isAuthenticated && user?.mustChangePassword ? (
           <ForcePasswordChange />
        ) : (
          <Routes>
            <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" replace />} />
            <Route path="/" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" replace />} />
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