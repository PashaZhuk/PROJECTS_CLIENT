import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from '../src/components/auth/ProtectedRoute';

// Компоненты
import Header from './components/ui/Header';
import Footer from './components/ui/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/Loginpage';
import AdminDashboard from '../src/pages/AdminDashboard';
import Userdashboard from './pages/UserDashboard';
import ManagerDashboard from './pages/ManagerDashboard'; // Не забудь создать этот файл
import ForcePasswordChange from './components/auth/ForсePasswordChange';

const AppContent = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600"></div>
      </div>
    );
  }

  // Функция для определения, куда редиректить залогиненного юзера с экрана логина
  const getRedirectPath = (role: string) => {
    switch (role) {
      case 'ADMIN': return "/admin/dashboard";
      case 'MANAGER': return "/manager/dashboard";
      case 'USER': return "/dashboard";
      default: return "/dashboard";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow">
        {/* Принудительная смена пароля поверх любого контента */}
        {user && user.mustChangePassword && <ForcePasswordChange />}

        <Routes>
          {/* ПУБЛИЧНЫЕ РОУТЫ */}
          <Route path="/" element={<HomePage />} />
          
          <Route path="/login" element={
            !isAuthenticated ? <LoginPage /> : <Navigate to={getRedirectPath(user?.role || 'USER')} replace />
          } />

          {/* ТОЛЬКО АДМИН */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>

          {/* ТОЛЬКО МЕНЕДЖЕР */}
          <Route element={<ProtectedRoute allowedRoles={['MANAGER']} />}>
            <Route path="/manager/dashboard" element={<ManagerDashboard />} />
          </Route>

          {/* ТОЛЬКО ПОЛЬЗОВАТЕЛЬ */}
          <Route element={<ProtectedRoute allowedRoles={['USER']} />}>
            <Route path="/dashboard" element={<Userdashboard />} />
          </Route>

          {/* СТРАНИЦА ОШИБКИ ДОСТУПА */}
          <Route path="/unauthorized" element={
            <div className="p-10 text-center">
              <h1 className="text-2xl font-bold text-red-600">Доступ запрещен</h1>
              <p>У вас нет прав для просмотра этого раздела.</p>
            </div>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;