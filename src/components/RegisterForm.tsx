import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle, ArrowLeft, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  // Достаем функцию register и состояние загрузки из контекста
  const { register, isLoading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // --- Валидаторы (оставляем без изменений) ---
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email обязателен';
    if (!emailRegex.test(email)) return 'Введите корректный email';
    return '';
  };

  const validatePassword = (password: string) => {
    if (!password) return 'Пароль обязателен';
    if (password.length < 6) return 'Минимум 6 символов';
    if (!/(?=.*[A-Z])/.test(password)) return 'Нужна заглавная буква';
    if (!/(?=.*\d)/.test(password)) return 'Нужна цифра';
    return '';
  };

  const validateName = (name: string) => {
    if (!name) return 'Имя обязательно';
    if (name.length < 2) return 'Минимум 2 символа';
    return '';
  };

  const validateConfirmPassword = (confirmPassword: string) => {
    if (!confirmPassword) return 'Подтвердите пароль';
    if (confirmPassword !== formData.password) return 'Пароли не совпадают';
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name as keyof typeof touched]) {
      handleValidation(name, value);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    handleValidation(name, value);
  };

  const handleValidation = (name: string, value: string) => {
    if (name === 'email') setErrors(prev => ({ ...prev, email: validateEmail(value) }));
    if (name === 'password') setErrors(prev => ({ ...prev, password: validatePassword(value) }));
    if (name === 'name') setErrors(prev => ({ ...prev, name: validateName(value) }));
    if (name === 'confirmPassword') setErrors(prev => ({ ...prev, confirmPassword: validateConfirmPassword(value) }));
  };

  const isFormValid = () => {
    return !errors.name && !errors.email && !errors.password && !errors.confirmPassword &&
      formData.name && formData.email && formData.password && formData.confirmPassword;
  };

  // --- ГЛАВНОЕ ИЗМЕНЕНИЕ ЗДЕСЬ ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    
    // Финальная проверка перед отправкой
    const nErr = validateName(formData.name);
    const eErr = validateEmail(formData.email);
    const pErr = validatePassword(formData.password);
    const cErr = validateConfirmPassword(formData.confirmPassword);
    
    if (nErr || eErr || pErr || cErr) {
      setErrors({ name: nErr, email: eErr, password: pErr, confirmPassword: cErr });
      setTouched({ name: true, email: true, password: true, confirmPassword: true });
      return;
    }
    
    // Вызываем register из нашего AuthContext
    // Передаем объект с данными (confirmPassword серверу не нужен)
    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password
    });

    if (result.success) {
      // Если все ок, AuthContext уже обновил стейт юзера, просто уходим
      navigate('/dashboard');
    } else {
      // Если сервер вернул ошибку (например, email занят), показываем её
      setSubmitError(result.message || 'Ошибка регистрации');
    }
  };

  const passwordRequirements = [
    { label: 'Минимум 6 символов', met: formData.password.length >= 6 },
    { label: 'Хотя бы одна заглавная буква', met: /[A-Z]/.test(formData.password) },
    { label: 'Хотя бы одна цифра', met: /\d/.test(formData.password) },
    { label: 'Пароли совпадают', met: formData.password !== '' && formData.password === formData.confirmPassword },
  ];

  // (JSX разметка остается такой же, как в твоем исходном коде)
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          {/* <button
            onClick={() => navigate(-1)}
            className="mb-8 flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" /> Назад
          </button> */}

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 p-4 text-center">
              <h1 className="text-3xl font-bold text-white mb-1">Создать аккаунт</h1>
              <p className="text-blue-100">Присоединяйтесь к нашему сообществу</p>
            </div>

            <form onSubmit={handleSubmit} className="p-7 space-y-5">
              {submitError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  {submitError}
                </div>
              )}

              {/* Поле Имя */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Имя</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 transition-all ${
                      touched.name && errors.name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="Ваше имя"
                  />
                </div>
                {touched.name && errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
              </div>

              {/* Поле Email */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Электронная почта</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 transition-all ${
                      touched.email && errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="mail@example.com"
                  />
                </div>
                {touched.email && errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
              </div>

              {/* Поле Пароль */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Пароль</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 transition-all ${
                      touched.password && errors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3">
                    {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                  </button>
                </div>
              </div>

              {/* Поле Подтверждение */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Подтвердите пароль</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 transition-all ${
                      touched.confirmPassword && errors.confirmPassword ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3">
                    {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                  </button>
                </div>
              </div>

              {/* Чеклист пароля */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                {passwordRequirements.map((req, i) => (
                  <div key={i} className={`flex items-center ${req.met ? 'text-green-600' : 'text-gray-400'}`}>
                    <Check className={`h-4 w-4 mr-2 ${req.met ? 'opacity-100' : 'opacity-30'}`} />
                    {req.label}
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={!isFormValid() || authLoading}
                className={`w-full py-3 rounded-lg font-bold text-white transition-all ${
                  isFormValid() && !authLoading 
                    ? 'bg-blue-600 hover:bg-blue-700 shadow-md hover:scale-[1.01]' 
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                {authLoading ? 'Загрузка...' : 'Создать аккаунт'}
              </button>

              <p className="text-center text-sm text-gray-600">
                Уже есть аккаунт? <Link to="/login" className="text-blue-600 font-bold">Войти</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;