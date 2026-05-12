import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import authApi from '../api/auth';
import { Lock, Mail, ArrowLeft, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const token = searchParams.get('token');
  
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    try {
      await authApi.forgotPassword(email);
      setMessage({ type: 'success', text: 'Письмо со ссылкой для сброса пароля отправлено на ваш email.' });
      setEmail('');
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Ошибка при отправке письма';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Пароли не совпадают' });
      return;
    }
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Пароль должен быть не менее 6 символов' });
      return;
    }

    setIsLoading(true);
    try {
      await authApi.resetPassword(token!, newPassword);
      setMessage({ type: 'success', text: 'Пароль успешно изменен! Перенаправление на вход...' });
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Ошибка при смене пароля';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="text-blue-600" size={32} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Забыли пароль?</h2>
            <p className="text-slate-500 text-sm mt-2">Введите свой email, и мы пришлем ссылку для сброса.</p>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 text-sm ${
              message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
            }`}>
              {message.type === 'success' ? <CheckCircle size={18} className="shrink-0 mt-0.5"/> : <AlertCircle size={18} className="shrink-0 mt-0.5"/>}
              {message.text}
            </div>
          )}

          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email адрес</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black uppercase tracking-[0.1em] text-xs shadow-lg transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Отправка...' : 'Прислать ссылку'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/login')}
              className="flex items-center justify-center gap-2 mx-auto text-slate-500 hover:text-slate-900 text-sm font-bold transition-colors"
            >
              <ArrowLeft size={16} /> Вернуться ко входу
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="text-emerald-600" size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Новый пароль</h2>
          <p className="text-slate-500 text-sm mt-2">Придумайте надежный пароль для вашего аккаунта.</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 text-sm ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
          }`}>
            {message.type === 'success' ? <CheckCircle size={18} className="shrink-0 mt-0.5"/> : <AlertCircle size={18} className="shrink-0 mt-0.5"/>}
            {message.text}
          </div>
        )}

        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Новый пароль</label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Подтвердите пароль</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black uppercase tracking-[0.1em] text-xs shadow-lg transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Сохранение...' : 'Сменить пароль'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;