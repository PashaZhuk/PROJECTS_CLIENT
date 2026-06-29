import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle, X, 
  ShieldCheck, KeyRound, RefreshCw 
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import authApi from '../api/auth';
import LockedModal from '../components/ui/LockedModal';

const LoginPage = () => {
  const navigate = useNavigate();
  
  const login = useAuthStore((state) => state.login);
  const verify2FA = useAuthStore((state) => state.verify2FA);
  const is2FARequired = useAuthStore((state) => state.is2FARequired);
  const authLoading = useAuthStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const user = useAuthStore((state) => state.user);
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [showPassword, setShowPassword] = useState(false);
  
  const [submitError, setSubmitError] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);
  
  const [is2FAView, setIs2FAView] = useState(false);
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [codeLoading, setCodeLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  
  const [lockedModal, setLockedModal] = useState<{
    isOpen: boolean;
    lockUntil?: Date | null;
    message?: string;
    title?: string;
  }>({ isOpen: false });
  
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState('');

  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  useEffect(() => {
    if (is2FARequired) {
      setIs2FAView(true);
      setSubmitError('');
      handleResendCode(); 
    }
  }, [is2FARequired]);

  useEffect(() => {
    if (isInitialized && isAuthenticated && user) {
      if (user.mustChangePassword) {
        navigate('/force-change-password', { replace: true });
        return;
      }
      const routes = { 
        ADMIN: '/admin/dashboard', 
        MANAGER: '/manager/dashboard', 
        USER: '/dashboard' 
      };
      const targetRoute = routes[user.role as keyof typeof routes] || '/dashboard';
      navigate(targetRoute, { replace: true });
    }
  }, [isAuthenticated, isInitialized, user, navigate]);

  const validateEmail = (email: string) => {
    if (!email) return 'Email обязателен';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Некорректный email';
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
      if (result.userBlocked) {
        setLockedModal({
          isOpen: true,
          lockUntil: null,
          message: "Ваш аккаунт заблокирован администратором. Обратитесь в поддержку.",
          title: "Аккаунт заблокирован"
        });
        setFormData({ email: '', password: '' });
        return;
      }
      if (result.requires2FA) return;
      
      if (result.lockType === '2FA' && result.timeLeft) {
        const lockDate = new Date(Date.now() + result.timeLeft * 1000);
        setLockedModal({
          isOpen: true,
          lockUntil: lockDate,
          message: "Вы превысили количество попыток ввода SMS-кода. Доступ заблокирован.",
          title: "Блокировка входа"
        });
        useAuthStore.getState().setIs2FARequired(false);
        useAuthStore.getState().setTempUserId(null);
        setFormData({ email: '', password: '' });
        setCode('');
        return;
      }
      
      if (result.timeLeft && result.attemptsLeft === undefined) {
        const lockDate = new Date(Date.now() + result.timeLeft * 1000);
        setLockedModal({
          isOpen: true,
          lockUntil: lockDate,
          message: "Превышено количество попыток входа. Попробуйте позже.",
          title: "Доступ временно ограничен"
        });
        setFormData({ email: '', password: '' });
        return;
      }
      
      setSubmitError(result.message || 'Неверный email или пароль');
      if (result.attemptsLeft !== undefined) {
        setAttemptsLeft(result.attemptsLeft);
      }
    }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0) return;
    const userId = useAuthStore.getState().tempUserId;
    if (!userId) return;
    try {
      const res: any = await authApi.send2FACode(userId);
      setResendTimer(60);
      if (res.debugCode) console.log('🔐 2FA CODE:', res.debugCode);
    } catch (err: any) {
      const errData = await err.response?.json().catch(() => ({}));
      setResendTimer(errData.timeLeft || 60);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (codeLoading) return;
    setCodeLoading(true);
    setCodeError('');
    
    const result = await verify2FA(code);
    setCodeLoading(false);
    
    if (!result.success) {
      if (result.timeLeft && !result.attemptsLeft) {
        const lockDate = new Date(Date.now() + result.timeLeft * 1000);
        setLockedModal({
          isOpen: true,
          lockUntil: lockDate,
          message: "Вы превысили количество попыток ввода SMS-кода. Доступ заблокирован.",
          title: "Блокировка входа"
        });
        setIs2FAView(false);
        useAuthStore.getState().setIs2FARequired(false);
        useAuthStore.getState().setTempUserId(null);
        setCode('');
      } else if (result.attemptsLeft !== undefined) {
        setCodeError(`Неверный код. Осталось попыток: ${result.attemptsLeft}`);
      } else {
        setCodeError(result.message || 'Ошибка проверки кода');
      }
    } else {
      const currentUser = useAuthStore.getState().user;
      console.log('2FA успешна, mustChangePassword =', currentUser?.mustChangePassword);
      if (currentUser?.mustChangePassword) {
        navigate('/force-change-password', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    setResetError('');
    try {
      await authApi.forgotPassword(resetEmail);
      setResetSuccess(true);
    } catch (err: any) {
      setResetError(err.response?.data?.error || 'Ошибка сети');
    } finally {
      setResetLoading(false);
    }
  };

  const closeLockedModal = () => {
    setLockedModal({ isOpen: false });
    setFormData({ email: '', password: '' });
    setCode('');
    setSubmitError('');
    setCodeError('');
    navigate('/login', { replace: true });
  };

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
            <div className="mb-4 p-4 rounded-xl text-[13px] font-bold uppercase tracking-widest border flex items-center gap-2 bg-red-50 text-red-600 border-red-200">
              <AlertCircle size={16} />
              <div>{codeError}</div>
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
                  disabled={codeLoading}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-center text-2xl font-mono tracking-[0.5em] font-bold focus:ring-2 focus:ring-blue-600 outline-none disabled:bg-gray-100"
                  placeholder="000000"
                  autoFocus
                />
              </div>
            </div>
            
            <button
              type="submit" 
              disabled={!code || codeLoading}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-[0.2em] text-[13px] hover:bg-slate-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {codeLoading ? <RefreshCw className="animate-spin" size={16} /> : <CheckCircle size={16} />}
              {codeLoading ? 'Проверка...' : 'Подтвердить'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={handleResendCode} 
              disabled={resendTimer > 0}
              className="text-[13px] font-bold uppercase tracking-widest text-blue-600 hover:text-blue-800 disabled:text-gray-400 transition-colors"
            >
              {resendTimer > 0 ? `Отправить повторно (${formatTime(resendTimer)})` : 'Отправить код снова'}
            </button>
          </div>
          
          <div className="mt-4 text-center">
             <button 
               onClick={() => { 
                 setIs2FAView(false); 
                 setSubmitError('');
                 setCode('');
                 setCodeError('');
                 useAuthStore.getState().setIs2FARequired(false);
                 useAuthStore.getState().setTempUserId(null);
               }}
               className="text-[10px] text-slate-400 hover:text-slate-600 uppercase font-bold tracking-widest"
             >
               ← Назад ко входу
             </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-50 to-blue-50 py-12 flex items-center">
        <div className="container mx-auto px-3">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center">
                <h1 className="text-3xl font-bold text-white mb-2">Вход в B2B</h1>
                <p className="text-blue-100">Используйте данные, выданные администратором</p>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                {submitError && (
                  <div className="p-4 rounded-xl border flex items-start gap-2 bg-red-50 text-red-700 border-red-200">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-bold">Ошибка входа</p>
                      <p>{submitError}</p>
                      {attemptsLeft !== null && (
                        <p className="mt-1 text-xs font-bold">Осталось попыток: {attemptsLeft}</p>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Электронная почта</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email" id="email" name="email" disabled={authLoading}
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
                      className="text-xs font-medium text-blue-600 hover:underline"
                    >
                      Забыли пароль?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'} id="password" name="password" disabled={authLoading}
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
                  disabled={!isFormValid() || authLoading}
                  className={`w-full py-4 px-4 rounded-xl font-bold text-white transition-all duration-300 shadow-lg flex items-center justify-center gap-2
                    ${isFormValid() && !authLoading
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-[1.02] active:scale-95 shadow-blue-200'
                      : 'bg-gray-300 cursor-not-allowed'}`}
                >
                  {authLoading ? (
                    <><RefreshCw className="animate-spin" size={18} /> Вход...</>
                  ) : (
                    'Войти'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

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
                    Мы отправили ссылку для сброса пароля на <strong>{resetEmail}</strong>.
                  </p>
                  <button 
                    onClick={() => {setShowResetModal(false); setResetSuccess(false); setResetEmail('');}}
                    className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200"
                  >
                    Закрыть
                  </button>
                </div>
              ) : (
                <form onSubmit={handleResetSubmit} className="space-y-4">
                  {resetError && (
                    <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg flex items-center gap-2">
                      <AlertCircle size={14} /> {resetError}
                    </div>
                  )}
                  <p className="text-sm text-gray-500 mb-2">Введите ваш email для восстановления</p>
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
                    {resetLoading ? 'Отправка...' : 'Прислать ссылку'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      <LockedModal 
        isOpen={lockedModal.isOpen}
        lockUntil={lockedModal.lockUntil}
        message={lockedModal.message}
        title={lockedModal.title}
        onClose={closeLockedModal}
      />
    </>
  );
};

export default LoginPage;