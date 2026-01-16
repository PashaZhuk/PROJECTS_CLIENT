import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';


// Страницы
import HomePage from './components/LandingPage';
import LoginPage from './components/Loginform';
import RegisterPage from './components/RegisterForm';
import DashboardPage from './components/DashboardPage';
import ProfilePage from './components/ProfilePage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main>
            <Routes>
              {/* Публичные маршруты */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={
                <ProtectedRoute requireAuth={false}>
                  <LoginPage />
                </ProtectedRoute>
              } />
              <Route path="/register" element={
                <ProtectedRoute requireAuth={false}>
                  <RegisterPage />
                </ProtectedRoute>
              } />

              {/* Защищенные маршруты */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />

              {/* Дополнительные маршруты */}
              <Route path="/forgot-password" element={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Восстановление пароля</h1>
                    <p className="text-gray-600">Страница в разработке</p>
                  </div>
                </div>
              } />

              {/* 404 - Not Found */}
              <Route path="*" element={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                    <p className="text-gray-600 mb-8">Страница не найдена</p>
                    <a href="/" className="text-blue-600 hover:text-blue-800 font-medium">
                      Вернуться на главную
                    </a>
                  </div>
                </div>
              } />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="bg-white border-t mt-12">
            <div className="container mx-auto px-4 py-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                  <span className="text-xl font-bold text-gray-900">BrandName</span>
                  <p className="text-gray-500 text-sm mt-2">
                    © 2024 Все права защищены
                  </p>
                </div>
                <div className="flex space-x-6">
                  <a href="#" className="text-gray-600 hover:text-blue-600">Политика конфиденциальности</a>
                  <a href="#" className="text-gray-600 hover:text-blue-600">Условия использования</a>
                  <a href="#" className="text-gray-600 hover:text-blue-600">Контакты</a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
