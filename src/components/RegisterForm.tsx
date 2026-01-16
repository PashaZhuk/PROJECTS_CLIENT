import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle, ArrowLeft, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
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

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email обязателен для заполнения';
    if (!emailRegex.test(email)) return 'Введите корректный email адрес';
    return '';
  };

  const validatePassword = (password: string) => {
    if (!password) return 'Пароль обязателен для заполнения';
    if (password.length < 6) return 'Пароль должен содержать минимум 6 символов';
    if (!/(?=.*[A-Z])/.test(password)) return 'Добавьте хотя бы одну заглавную букву';
    if (!/(?=.*\d)/.test(password)) return 'Добавьте хотя бы одну цифру';
    return '';
  };

  const validateName = (name: string) => {
    if (!name) return 'Имя обязательно для заполнения';
    if (name.length < 2) return 'Имя должно содержать минимум 2 символа';
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
      if (name === 'email') {
        setErrors(prev => ({ ...prev, email: validateEmail(value) }));
      } else if (name === 'password') {
        setErrors(prev => ({ ...prev, password: validatePassword(value) }));
      } else if (name === 'name') {
        setErrors(prev => ({ ...prev, name: validateName(value) }));
      } else if (name === 'confirmPassword') {
        setErrors(prev => ({ ...prev, confirmPassword: validateConfirmPassword(value) }));
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
    } else if (name === 'name') {
      setErrors(prev => ({ ...prev, name: validateName(value) }));
    } else if (name === 'confirmPassword') {
      setErrors(prev => ({ ...prev, confirmPassword: validateConfirmPassword(value) }));
    }
  };

  const isFormValid = () => {
    return !errors.name && !errors.email && !errors.password && !errors.confirmPassword &&
      formData.name && formData.email && formData.password && formData.confirmPassword;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    
    // Валидация всех полей
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(formData.confirmPassword);
    
    setErrors({
      name: nameError,
      email: emailError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
    });
    
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });
    
    if (nameError || emailError || passwordError || confirmPasswordError) {
      return;
    }
    
    try {
      await register(formData.name, formData.email, formData.password);
      // После успешной регистрации перенаправляем на dashboard
      navigate('/dashboard');
    } catch (error) {
      setSubmitError('Ошибка при регистрации. Попробуйте снова.');
    }
  };

  const passwordRequirements = [
    { label: 'Минимум 6 символов', met: formData.password.length >= 6 },
    { label: 'Хотя бы одна заглавная буква', met: /[A-Z]/.test(formData.password) },
    { label: 'Хотя бы одна цифра', met: /\d/.test(formData.password) },
    { label: 'Пароли совпадают', met: formData.password && formData.password === formData.confirmPassword },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          {/* Кнопка возврата */}
          <button
            onClick={() => navigate(-1)}
            className="mb-8 flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Назад
          </button>

          {/* Карточка формы */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 p-8 text-center">
              <h1 className="text-3xl font-bold text-white mb-2">Создать аккаунт</h1>
              <p className="text-blue-100">Присоединяйтесь к нашему сообществу</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {submitError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  {submitError}
                </div>
              )}

              {/* Поле Имя */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Имя
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`
                      w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all
                      ${touched.name && errors.name 
                        ? 'border-red-300 focus:ring-red-500' 
                        : touched.name && !errors.name && formData.name
                        ? 'border-green-300 focus:ring-green-500'
                        : 'border-gray-300'
                      }
                    `}
                    placeholder="Ваше имя"
                  />
                  {touched.name && !errors.name && formData.name && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                  )}
                </div>
                {touched.name && errors.name && (
                  <div className="flex items-center text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.name}
                  </div>
                )}
              </div>

              {/* Поле Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Электронная почта
                </label>
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
                    className={`
                      w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all
                      ${touched.email && errors.email 
                        ? 'border-red-300 focus:ring-red-500' 
                        : touched.email && !errors.email && formData.email
                        ? 'border-green-300 focus:ring-green-500'
                        : 'border-gray-300'
                      }
                    `}
                    placeholder="example@email.com"
                  />
                  {touched.email && !errors.email && formData.email && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                  )}
                </div>
                {touched.email && errors.email && (
                  <div className="flex items-center text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.email}
                  </div>
                )}
              </div>

              {/* Поле Пароль */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Пароль
                </label>
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
                    className={`
                      w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all
                      ${touched.password && errors.password 
                        ? 'border-red-300 focus:ring-red-500' 
                        : touched.password && !errors.password && formData.password
                        ? 'border-green-300 focus:ring-green-500'
                        : 'border-gray-300'
                      }
                    `}
                    placeholder="Придумайте пароль"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {touched.password && errors.password && (
                  <div className="flex items-center text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.password}
                  </div>
                )}
              </div>

              {/* Поле Подтверждение пароля */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Подтверждение пароля
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`
                      w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all
                      ${touched.confirmPassword && errors.confirmPassword 
                        ? 'border-red-300 focus:ring-red-500' 
                        : touched.confirmPassword && !errors.confirmPassword && formData.confirmPassword
                        ? 'border-green-300 focus:ring-green-500'
                        : 'border-gray-300'
                      }
                    `}
                    placeholder="Повторите пароль"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {touched.confirmPassword && errors.confirmPassword && (
                  <div className="flex items-center text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.confirmPassword}
                  </div>
                )}
              </div>

              {/* Требования к паролю */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <h4 className="font-medium text-gray-900 mb-2">Требования к паролю:</h4>
                {passwordRequirements.map((req, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <div className={`h-5 w-5 rounded-full flex items-center justify-center mr-2 ${req.met ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                      <Check className="h-3 w-3" />
                    </div>
                    <span className={req.met ? 'text-green-600' : 'text-gray-500'}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Соглашение */}
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300 mt-1"
                  required
                />
                <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
                  Я соглашаюсь с{' '}
                  <Link to="/terms" className="text-blue-600 hover:text-blue-800 font-medium">
                    условиями использования
                  </Link>{' '}
                  и{' '}
                  <Link to="/privacy" className="text-blue-600 hover:text-blue-800 font-medium">
                    политикой конфиденциальности
                  </Link>
                </label>
              </div>

              {/* Кнопка отправки */}
              <button
                type="submit"
                disabled={!isFormValid() || authLoading}
                className={`
                  w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300
                  ${isFormValid() && !authLoading
                    ? 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95'
                    : 'bg-gray-300 cursor-not-allowed'
                  }
                `}
              >
                {authLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Регистрация...
                  </div>
                ) : (
                  'Зарегистрироваться'
                )}
              </button>

              {/* Ссылка на вход */}
              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-gray-600">
                  Уже есть аккаунт?{' '}
                  <Link to="/login" className="text-blue-600 hover:text-blue-800 font-semibold hover:underline">
                    Войти
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;