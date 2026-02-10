import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading: authLoading } = useAuth();
  
  // Состояния основной формы
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Состояния для модального окна восстановления
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

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
      setErrors(prev => ({ ...prev, [name]: name === 'email' ? validateEmail(value) : validatePassword(value) }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: name === 'email' ? validateEmail(value) : validatePassword(value) }));
  };

  const isFormValid = () => !errors.email && !errors.password && formData.email && formData.password;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    setErrors({ email: emailError, password: passwordError });
    setTouched({ email: true, password: true });
    
    if (emailError || passwordError) return;
    
    const result = await login(formData);

    if (result.success) {
      const routes = { ADMIN: '/admin/dashboard', MANAGER: '/manager/dashboard', USER: '/dashboard' };
      navigate(routes[result.user?.role as keyof typeof routes] || '/dashboard', { replace: true });
    } else {
      const errorMessage = result.message || '';
      if (errorMessage.toLowerCase().includes('fetch') || errorMessage.toLowerCase().includes('network')) {
        setSubmitError('Сервер недоступен. Проверьте подключение.');
      } else {
        setSubmitError(errorMessage || 'Неверный email или пароль');
      }
    }
  };

  // Логика запроса сброса пароля
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    
    // Имитируем запрос к бэкенду (здесь будет вызов твоего API)
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
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  {submitError}
                </div>
              )}

              {/* Поле Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Электронная почта</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
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

              {/* Поле Пароль */}
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
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
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
          <p className="text-center mt-8 text-gray-500 text-sm">
            © 2026 АйПиМатика Бел. Все права защищены.
          </p>
        </div>
      </div>

      {/* MODAL: Восстановление пароля */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
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
                  <p className="text-gray-600 mb-6">Запрос отправлен! Администратор проверит данные и свяжется с вами.</p>
                  <button 
                    onClick={() => {setShowResetModal(false); setResetSuccess(false);}}
                    className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                  >
                    Понятно
                  </button>
                </div>
              ) : (
                <form onSubmit={handleResetSubmit} className="space-y-4">
                  <p className="text-sm text-gray-500">Укажите ваш Email, на который зарегистрирован аккаунт.</p>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email" required value={resetEmail} onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="mail@example.com"
                    />
                  </div>
                  <button
                    type="submit" disabled={resetLoading || !resetEmail}
                    className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:bg-gray-300 shadow-md"
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