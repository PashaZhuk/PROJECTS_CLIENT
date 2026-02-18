import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle, X } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const LoginPage = () => {
  const navigate = useNavigate();
  
  // Подключаемся к стору
  const login = useAuthStore((state) => state.login);
  const authLoading = useAuthStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  
  // Состояния формы
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Состояния модалки
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // --- ЭФФЕКТ ДЛЯ ПЕРЕНАПРАВЛЕНИЯ ---
  // Сработает сразу, как только isAuthenticated станет true
  useEffect(() => {
    if (isAuthenticated && user) {
      const routes = { 
        ADMIN: '/admin/dashboard', 
        MANAGER: '/manager/dashboard', 
        USER: '/dashboard' 
      };
      
      const targetRoute = routes[user.role as keyof typeof routes] || '/dashboard';
      
      // Используем небольшую задержку для плавности и стабильности стейта
      const timer = setTimeout(() => {
        navigate(targetRoute, { replace: true });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user, navigate]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email обязателен';
    if (!emailRegex.test(email)) return 'Некорректный email';
    return '';
  };

  const validatePassword = (password: string) => {
    if (!password) return 'Пароль обязателен';
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name as keyof typeof touched]) {
      setErrors(prev => ({ 
        ...prev, 
        [name]: name === 'email' ? validateEmail(value) : validatePassword(value) 
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ 
      ...prev, 
      [name]: name === 'email' ? validateEmail(value) : validatePassword(value) 
    }));
  };

  const isFormValid = () => !errors.email && !errors.password && formData.email && formData.password;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    
    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      setTouched({ email: true, password: true });
      return;
    }
    
    // Просто вызываем логин. Редирект произойдет в useEffect выше
    const result = await login(formData);

    if (!result.success) {
      setSubmitError(result.message || 'Неверный email или пароль');
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setResetSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-linear-to-br from-gray-50 to-blue-50 py-12 flex items-center">
      <div className="container mx-auto px-3">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-linear-to-r from-blue-600 to-purple-600 p-8 text-center">
              <h1 className="text-3xl font-bold text-white mb-2">Вход в портал</h1>
              <p className="text-blue-100">Используйте данные, выданные администратором</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {submitError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center animate-shake">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  {submitError}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Электронная почта</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email" id="email" name="email"
                    value={formData.email} onChange={handleChange} onBlur={handleBlur}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all
                      ${touched.email && errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                    placeholder="example@email.com"
                  />
                  {touched.email && !errors.email && formData.email && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                  )}
                </div>
                {touched.email && errors.email && (
                  <p className="text-sm text-red-600 flex items-center"><AlertCircle className="h-4 w-4 mr-1"/>{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Пароль</label>
                  <button 
                    type="button"
                    onClick={() => setShowResetModal(true)}
                    className="text-xs text-blue-600 hover:underline font-medium"
                  >
                    Забыли пароль?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'} id="password" name="password"
                    value={formData.password} onChange={handleChange} onBlur={handleBlur}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all
                      ${touched.password && errors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                    placeholder="Введите пароль"
                  />
                  <button
                    type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                  </button>
                </div>
                {touched.password && errors.password && (
                  <p className="text-sm text-red-600 flex items-center"><AlertCircle className="h-4 w-4 mr-1"/>{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={!isFormValid() || authLoading}
                className={`w-full py-4 px-4 rounded-xl font-bold text-white transition-all duration-300 shadow-lg
                  ${isFormValid() && !authLoading
                    ? 'bg-linear-to-r from-blue-600 to-purple-600 hover:scale-[1.02] active:scale-95 shadow-blue-200'
                    : 'bg-gray-300 cursor-not-allowed'}`}
              >
                {authLoading ? 'Вход...' : 'Войти в систему'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* MODAL: Reset Password */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Сброс пароля</h3>
                <button onClick={() => {setShowResetModal(false); setResetSuccess(false);}} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>

              {resetSuccess ? (
                <div className="text-center py-4">
                  <div className="bg-green-100 text-green-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={24} />
                  </div>
                  <p className="text-gray-600 mb-6">Запрос отправлен! Мы свяжемся с вами.</p>
                  <button 
                    onClick={() => {setShowResetModal(false); setResetSuccess(false);}}
                    className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                  >
                    Понятно
                  </button>
                </div>
              ) : (
                <form onSubmit={handleResetSubmit} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email" required value={resetEmail} onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="mail@example.com"
                    />
                  </div>
                  <button
                    type="submit" disabled={resetLoading || !resetEmail}
                    className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-300"
                  >
                    {resetLoading ? 'Отправка...' : 'Отправить запрос'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;