import React, { useState } from 'react';
import userAPI from '../../api/user';
import { useAuthStore } from '../../store/useAuthStore';
import { KeyRound, RefreshCw, ShieldAlert } from 'lucide-react';

const ForcePasswordChange = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      return setError('Пароль должен быть не менее 6 символов');
    }
    if (newPassword !== confirmPassword) {
      return setError('Пароли не совпадают');
    }

    setLoading(true);
    try {
      await userAPI.changePw({ newPassword });

      if (user) {
        setUser({ ...user, mustChangePassword: false });
      }
    } catch (err: any) {
      console.error('Change password error:', err);
      if (err.response) {
        const errorData = await err.response.json().catch(() => ({}));
        setError(errorData.message || 'Ошибка при смене пароля');
      } else {
        setError('Сетевая ошибка. Попробуйте позже.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[9999] p-4">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl max-w-md w-full animate-in zoom-in duration-300 border border-slate-100">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600">
            <ShieldAlert size={32} />
          </div>
        </div>

        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2 text-center">
          Безопасность прежде всего
        </h2>
        <p className="text-slate-500 mb-8 text-sm font-medium text-center leading-relaxed">
          Администратор создал для вас аккаунт с временным паролем. Пожалуйста, установите свой личный пароль.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            {/* Исправлена опечатка: было "пароxtль" */}
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Новый пароль
            </label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all font-mono"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Подтвердите пароль
            </label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all font-mono"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading ? <RefreshCw className="animate-spin" size={16} /> : 'Обновить и войти'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForcePasswordChange;
