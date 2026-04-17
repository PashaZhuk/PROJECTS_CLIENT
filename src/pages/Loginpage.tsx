import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle, X, 
  ShieldCheck, KeyRound, RefreshCw 
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import authApi from '../api/auth';

const LoginPage = () => {
  const navigate = useNavigate();
  
  // --- STORE ---
  const login = useAuthStore((state) => state.login);
  const verify2FA = useAuthStore((state) => state.verify2FA);
  const is2FARequired = useAuthStore((state) => state.is2FARequired);
  const authLoading = useAuthStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const user = useAuthStore((state) => state.user);
  
  // --- STATES: LOGIN FORM ---
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [showPassword, setShowPassword] = useState(false);
  
  // --- STATES: ERRORS & LOCKS ---
  const [submitError, setSubmitError] = useState('');
  const [lockUntil, setLockUntil] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);

  // --- STATES: 2FA ---
  const [is2FAView, setIs2FAView] = useState(false);
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [codeLoading, setCodeLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  
  // 🔥 ИСПРАВЛЕНО: Имя переменной не может начинаться с цифры
  const [isFALocked, setIsFALocked] = useState(false);
  const [faLockTimeLeft, setFALockTimeLeft] = useState(0);

  // --- STATES: RESET PASSWORD MODAL ---
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState('');

  // --- EFFECTS ---

  // Таймеры (Блокировка входа, Блокировка 2FA, Таймер отправки кода)
  useEffect(() => {
    let interval: number;

    if (lockUntil && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) { setLockUntil(null); setSubmitError(''); return 0; }
          return prev - 1;
        });
      }, 1000);
    }

    // 🔥 ИСПРАВЛЕНО: Используем новые имена переменных
    if (isFALocked && faLockTimeLeft > 0) {
      interval = window.setInterval(() => {
        setFALockTimeLeft((prev) => {
          if (prev <= 1) { setIsFALocked(false); setCodeError(''); return 0; }
          return prev - 1;
        });
      }, 1000);
    }

    if (resendTimer > 0) {
      interval = window.setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [lockUntil, timeLeft, isFALocked, faLockTimeLeft, resendTimer]);

  // Переключение на вид 2FA, если стейт изменился
  useEffect(() => {
    if (is2FARequired) {
      setIs2FAView(true);
      setSubmitError('');
      handleResendCode(); 
    }
  }, [is2FARequired]);

  // Редирект при успешном входе
  useEffect(() => {
    if (isInitialized && isAuthenticated && user) {
      const routes = { 
        ADMIN: '/admin/dashboard', 
        MANAGER: '/manager/dashboard', 
        USER: '/dashboard' 
      };
      const targetRoute = routes[user.role as keyof typeof routes] || '/dashboard';
      navigate(targetRoute, { replace: true });
    }
  }, [isAuthenticated, isInitialized, user, navigate]);

  // --- HANDLERS: VALIDATION ---

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

  // --- HANDLERS: LOGIN ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockUntil) return; 
    
    setSubmitError('');
    setAttemptsLeft(null);
    
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    
    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      setTouched({ email: true, password: true });
      return;
    }
    
    const result = await login(formData);
    
    if (!result.success) {
      if (result.requires2FA) {
        return;
      }
      
      setSubmitError(result.message || 'Неверный email или пароль');
      if (result.timeLeft) {
        setTimeLeft(result.timeLeft);
        setLockUntil(new Date());
      }
      if (result.attemptsLeft !== undefined) {
        setAttemptsLeft(result.attemptsLeft);
      }
    }
  };

  // --- HANDLERS: 2FA ---

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFALocked) return;

    setCodeLoading(true);
    setCodeError('');

    const result = await verify2FA(code);

    setCodeLoading(false);

    if (!result.success) {
      setCodeError(result.message || 'Ошибка проверки кода');
      if (result.timeLeft) {
        setIsFALocked(true);
        setFALockTimeLeft(result.timeLeft);
      }
      if (result.attemptsLeft !== undefined) {
        setAttemptsLeft(result.attemptsLeft);
      }
    }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0 || isFALocked) return;
    
    const storeState = useAuthStore.getState();
    const userId = storeState.tempUserId;
    
    if (!userId) return;

    try {
      const res: any = await authApi.send2FACode(userId);
      setResendTimer(60);
      if (res.debugCode) {
        console.log('🔐 YOUR 2FA CODE:', res.debugCode);
      }
    } catch (err: any) {
      const errData = await err.response?.json().catch(() => ({}));
      if (errData.timeLeft) {
        setResendTimer(errData.timeLeft);
      } else {
        setResendTimer(60);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // --- HANDLERS: RESET PASSWORD ---

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    setResetError('');
    
    try {
      await authApi.forgotPassword(resetEmail);
      setResetSuccess(true);
    } catch (err: any) {
      console.error(err);
      setResetError(err.response?.data?.error || 'Ошибка сети. Попробуйте позже.');
    } finally {
      setResetLoading(false);
    }
  };

  // --- RENDER: 2FA VIEW ---
  if (is2FAView) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-8 border border-slate-100 animate-in zoom-in duration-300">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="text-blue-600" size={32} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Проверка безопасности</h2>
            <p className="text-slate-500 text-sm mt-2">Введите код подтверждения</p>
          </div>

          {codeError && (
            <div className={`mb-4 p-4 rounded-xl text-xs font-black uppercase tracking-widest border flex items-center gap-2
              ${isFALocked ? 'bg-orange-50 text-orange-600 border-orange-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
              <AlertCircle size={16} />
              <div>
                {isFALocked ? `Блокировка на ${formatTime(faLockTimeLeft)}` : codeError}
                {!isFALocked && attemptsLeft !== null && (
                  <div className="mt-1 font-bold">Осталось попыток: {attemptsLeft}</div>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest mb-1">Код из SMS / Приложения</label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  type="text" 
                  inputMode="numeric" 
                  maxLength={6}
                  value={code} 
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  disabled={isFALocked || codeLoading}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-center text-2xl font-mono tracking-[0.5em] font-bold focus:ring-2 focus:ring-blue-600 outline-none disabled:bg-gray-100"
                  placeholder="000000"
                  autoFocus
                />
              </div>
            </div>
            
            <button
              type="submit" 
              disabled={!code || codeLoading || isFALocked}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-slate-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {codeLoading ? <RefreshCw className="animate-spin" size={16} /> : <CheckCircle size={16} />}
              {codeLoading ? 'Проверка...' : 'Подтвердить'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={handleResendCode} 
              disabled={resendTimer > 0 || isFALocked}
              className="text-xs font-bold uppercase tracking-widest text-blue-600 hover:text-blue-800 disabled:text-gray-400 transition-colors"
            >
              {resendTimer > 0 ? `Отправить повторно (${formatTime(resendTimer)})` : 'Отправить код снова'}
            </button>
          </div>
          
          <div className="mt-4 text-center">
             <button 
               onClick={() => { setIs2FAView(false); setSubmitError(''); }}
               className="text-[10px] text-slate-400 hover:text-slate-600 uppercase font-bold tracking-widest"
             >
               ← Назад ко входу
             </button>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER: LOGIN VIEW ---
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
                <div className={`p-4 rounded-xl border flex items-start gap-2
                  ${lockUntil ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                  <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-bold">{lockUntil ? 'Доступ временно ограничен' : 'Ошибка входа'}</p>
                    <p>{submitError}</p>
                    {!lockUntil && attemptsLeft !== null && (
                      <p className="mt-1 text-xs font-bold">Осталось попыток: {attemptsLeft}</p>
                    )}
                    {lockUntil && (
                      <p className="mt-1 text-xs font-bold">Попробуйте через {formatTime(timeLeft)}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Электронная почта</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email" id="email" name="email" disabled={!!lockUntil || authLoading}
                    value={formData.email} onChange={handleChange} onBlur={handleBlur}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all disabled:bg-gray-100
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
                    type={showPassword ? 'text' : 'password'} id="password" name="password" disabled={!!lockUntil || authLoading}
                    value={formData.password} onChange={handleChange} onBlur={handleBlur}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all disabled:bg-gray-100
                      ${touched.password && errors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                    placeholder="Введите пароль"
                  />
                  <button
                    type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {touched.password && errors.password && (
                  <p className="text-sm text-red-600 flex items-center"><AlertCircle className="h-4 w-4 mr-1"/>{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={!isFormValid() || authLoading || !!lockUntil}
                className={`w-full py-4 px-4 rounded-xl font-bold text-white transition-all duration-300 shadow-lg flex items-center justify-center gap-2
                  ${lockUntil 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : isFormValid() && !authLoading
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-[1.02] active:scale-95 shadow-blue-200'
                      : 'bg-gray-300 cursor-not-allowed'}`}
              >
                {lockUntil ? (
                  <>🔒 Заблокировано ({formatTime(timeLeft)})</>
                ) : authLoading ? (
                  <><RefreshCw className="animate-spin" size={18} /> Вход...</>
                ) : (
                  'Войти в систему'
                )}
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
                <button onClick={() => {setShowResetModal(false); setResetSuccess(false); setResetError('');}} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>

              {resetSuccess ? (
                <div className="text-center py-4">
                  <div className="bg-emerald-100 text-emerald-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={24} />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Письмо отправлено!</h4>
                  <p className="text-gray-600 text-sm mb-6">
                    Мы отправили ссылку для сброса пароля на <strong>{resetEmail}</strong>. Проверьте папку "Входящие" или "Спам".
                  </p>
                  <button 
                    onClick={() => {setShowResetModal(false); setResetSuccess(false); setResetEmail('');}}
                    className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                  >
                    Вернуться ко входу
                  </button>
                </div>
              ) : (
                <form onSubmit={handleResetSubmit} className="space-y-4">
                  {resetError && (
                    <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg flex items-center gap-2">
                      <AlertCircle size={14} /> {resetError}
                    </div>
                  )}
                  
                  <p className="text-sm text-gray-500 mb-2">
                    Введите ваш email, и мы пришлем инструкцию по восстановлению доступа.
                  </p>

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
                    className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    {resetLoading ? 'Отправка...' : 'Прислать ссылку'}
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