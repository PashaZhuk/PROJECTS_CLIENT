import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading: authLoading } = useAuth();
  
  const from = (location.state as any)?.from?.pathname || '/dashboard';
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState('');

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
      if (name === 'email') {
        setErrors(prev => ({ ...prev, email: validateEmail(value) }));
      } else if (name === 'password') {
        setErrors(prev => ({ ...prev, password: validatePassword(value) }));
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    if (name === 'email') {
      setErrors(prev => ({ ...prev, email: validateEmail(value) }));
    } else if (name === 'password') {
      setErrors(prev => ({ ...prev, password: validatePassword(value) }));
    }
  };

  const isFormValid = () => {
    return !errors.email && !errors.password && formData.email && formData.password;
  };

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    
    setErrors({ email: emailError, password: passwordError });
    setTouched({ email: true, password: true });
    
    if (emailError || passwordError) return;
    
    // Вызываем login и получаем результат
    const result = await login(formData);

    if (result.success) {
      const userRole = result.user?.role;
      switch (userRole) {
        case 'ADMIN':
          navigate('/admin/dashboard', { replace: true });
          break;
        case 'MANAGER':
          navigate('/manager/dashboard', { replace: true });
          break;
        case 'USER':
          navigate('/dashboard', { replace: true });
          break;
        default:
          navigate('/dashboard', { replace: true });
      }
    } else {
      // ПРОВЕРКА ТИПА ОШИБКИ
      // Если сервер недоступен, обычно fetch выкидывает ошибку, которую твой AuthContext 
      // должен поймать и вернуть в result.message.
      
      const errorMessage = result.message || '';
      
      if (errorMessage.toLowerCase().includes('fetch') || errorMessage.toLowerCase().includes('network')) {
        setSubmitError('Сервер недоступен. Проверьте подключение к сети или VPN.');
      } else if (result.status === 401 || errorMessage.includes('пароль')) {
        setSubmitError('Неверный email или пароль');
      } else {
        setSubmitError(errorMessage || 'Произошла ошибка при входе');
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-50 to-blue-50 py-12 flex items-center">
      <div className="container mx-auto px-3">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center">
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
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
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
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Пароль</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all
                      ${touched.password && errors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                    placeholder="Введите пароль"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
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
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-[1.02] active:scale-95 shadow-blue-200'
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
    </div>
  );
};

export default LoginPage;