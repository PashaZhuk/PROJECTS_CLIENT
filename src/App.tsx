import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Layouts
import DashboardLayout from './components/layouts/DashboardLayout';

// Компоненты
import Header from './components/ui/Header';
import Footer from './components/ui/Footer';
import LoginPage from './pages/Loginpage';
import ForcePasswordChange from './components/auth/ForсePasswordChange';
import DashboardDispatcher from './pages/dashboard/DashboardDispatcher';

const AppContent = () => {
  // Теперь user типизирован как User | null из твоего файла типов
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
      <main className="grow flex flex-col">
        {user && user.mustChangePassword && <ForcePasswordChange />}

        <Routes>
          <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" replace />} />
          <Route path="/" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" replace />} />

          {/* Защищенные роуты с проверкой ролей */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'USER']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardDispatcher />} />
            </Route>
          </Route>

          <Route path="/unauthorized" element={
            <div className="p-10 text-center">
              <h1 className="text-2xl font-bold text-red-600">Доступ запрещен</h1>
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
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;