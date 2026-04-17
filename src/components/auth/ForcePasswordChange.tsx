import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import userAPI from '../../api/user';
import { useAuthStore } from '../../store/useAuthStore';
import { KeyRound, RefreshCw, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { forceChangePasswordSchema, type ForceChangePasswordFormData } from '../../schemas/passwordSchema';

const ForcePasswordChange = () => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting }, 
    setError, 
    clearErrors 
  } = useForm<ForceChangePasswordFormData>({
    resolver: zodResolver(forceChangePasswordSchema),
    mode: 'onChange', // Валидировать при изменении полей (чтобы убирать ошибку сразу)
  });

  const onSubmit = async (data: ForceChangePasswordFormData) => {
    try {
      // Отправляем только новый пароль, confirm уже проверен схемой и не нужен серверу
      await userAPI.changePw({ newPassword: data.newPassword });

      // Обновляем стейт пользователя: флаг mustChangePassword больше не нужен
      if (user) {
        setUser({ ...user, mustChangePassword: false });
      }
    } catch (err: any) {
      console.error('Change password error:', err);
      
      let errorMessage = 'Сетевая ошибка. Попробуйте позже.';
      if (err.response) {
        const errorData = await err.response.json().catch(() => ({}));
        errorMessage = errorData.message || errorData.error || 'Ошибка при смене пароля';
      }

      // Устанавливаем общую ошибку формы (корневую)
      setError('root', {
        type: 'server',
        message: errorMessage,
      });
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

        {/* ОШИБКА ФОРМЫ (SERVER ERROR) */}
        {errors.root && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-red-100 flex items-center gap-2">
            <ShieldAlert size={14} /> {errors.root.message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          
          {/* НОВЫЙ ПАРОЛЬ */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Новый пароль
            </label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input
                type="password"
                {...register('newPassword')}
                placeholder="••••••••"
                disabled={isSubmitting}
                className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 outline-none transition-all font-mono ${
                  errors.newPassword ? 'ring-2 ring-red-500' : 'focus:ring-blue-600'
                }`}
              />
            </div>
            {errors.newPassword && (
              <p className="text-red-500 text-[10px] font-bold ml-1 uppercase tracking-wide">{errors.newPassword.message}</p>
            )}
          </div>

          {/* ПОДТВЕРЖДЕНИЕ ПАРОЛЯ */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Подтвердите пароль
            </label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input
                type="password"
                {...register('confirmPassword')}
                placeholder="••••••••"
                disabled={isSubmitting}
                className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 outline-none transition-all font-mono ${
                  errors.confirmPassword ? 'ring-2 ring-red-500' : 'focus:ring-blue-600'
                }`}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-[10px] font-bold ml-1 uppercase tracking-wide">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-slate-900 hover:bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="animate-spin" size={16} /> Обработка...
              </>
            ) : (
              <>
                <CheckCircle2 size={16} /> Обновить и войти
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForcePasswordChange;