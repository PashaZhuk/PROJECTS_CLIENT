import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Импортируем наш новый стор
import { useAuthStore } from './store/useAuthStore';

// Компоненты
import ProtectedRoute from './components/auth/ProtectedRoute';
import DashboardLayout from './components/layouts/DashboardLayout';
import Header from './components/ui/Header';
import Footer from './components/ui/Footer';
import LoginPage from './pages/Loginpage';
import ForcePasswordChange from './components/auth/ForсePasswordChange';
import DashboardDispatcher from './pages/dashboard/DashboardDispatcher';

const AppContent = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, []); // Убрали зависимость checkAuth, так как функция стабильна

  // Если мы используем persist, то isAuthenticated может быть true сразу.
  // Показываем лоадер только при ПЕРВИЧНОЙ проверке, если данных еще нет.
  if (isLoading && !isAuthenticated) { 
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
           <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600"></div>
           <p className="text-slate-400 text-xs font-medium animate-pulse uppercase tracking-widest">
             Синхронизация...
           </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="grow flex flex-col">
        {/* Добавим проверку на наличие user, чтобы избежать ошибок */}
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
            <div className="grow flex items-center justify-center">
              <div className="text-center p-10">
                <h1 className="text-2xl font-bold text-red-600 uppercase">Доступ запрещен</h1>
              </div>
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