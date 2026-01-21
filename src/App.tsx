import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Импорт необходимых компонентов
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import LoginPage from './components/Loginform'; // Твоя форма входа
import AdminDashboard from './components/dashboard/AdminDashboard'; // Дашборд админа
import Userdashboard from './components/dashboard/UserDashboard'; // Дашборд юзера

const AppContent = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          
          <Route path="/login" element={
            !isAuthenticated ? <LoginPage /> : 
            <Navigate to={user?.role === 'ADMIN' ? "/admin/dashboard" : "/dashboard"} replace />
          } />

          {/* Упрощаем: просто защищаем роут, а проверку роли сделаем внутри или через ProtectedRoute */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              {user?.role === 'ADMIN' ? <AdminDashboard /> : <Navigate to="/dashboard" replace />}
            </ProtectedRoute>
          } />

          <Route path="/dashboard" element={
            <ProtectedRoute>
               {/* Если зашел админ, просто разрешаем ему видеть этот дашборд или мягко редиректим */}
               {user?.role === 'ADMIN' ? <Navigate to="/admin/dashboard" replace /> : <Userdashboard />}
            </ProtectedRoute>
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