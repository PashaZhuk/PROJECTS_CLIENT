import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Key, RefreshCw, Check, Briefcase, Building2, ShieldCheck, Phone, AlertCircle, User } from 'lucide-react';
import { useUserStore } from '../../../store/useUserStore';
import { userFormSchema, type UserFormData } from '../../../schemas/userSchema';

interface CreateUserProps {
  onCancel: () => void;
}

const AdminCreateUser = ({ onCancel }: CreateUserProps) => {
  const { createUser, loading } = useUserStore();
  const [serverError, setServerError] = useState('');

  const { 
    register, 
    handleSubmit, 
    watch, 
    setValue, 
    formState: { errors }, 
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      role: 'USER',
      name: '',
      email: '',
      password: '',
      companyName: '',
      unp: '',
      phone: '+375',
    }
  });

  const roleValue = watch('role');
  const phoneValue = watch('phone');

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let pass = '';
    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setValue('password', pass, { shouldValidate: true });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (!val) val = '375';
    if (!val.startsWith('375')) val = '375' + val;
    if (val.length > 12) val = val.slice(0, 12);
    setValue('phone', '+' + val, { shouldValidate: true });
  };

  const onSubmit = async (data: UserFormData) => {
    setServerError('');
    const payload: any = { ...data };

    // Если это Партнер (USER), убираем ФИО, если оно пустое (или всегда, если оно не нужно серверу)
    if (data.role === 'USER') {
      delete payload.name; // Убираем ФИО для партнера
      // Оставляем companyName, unp, phone
    } else {
      // Для менеджера убираем поля партнера
      delete payload.companyName;
      delete payload.unp;
      delete payload.phone;
    }

    try {
      await createUser(payload);
      onCancel();
    } catch (err: any) {
      setServerError(err.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
      <div className="p-10 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
        <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Регистрация</h2>
        <ShieldCheck className="text-slate-200" size={32} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-10 space-y-6">
        {serverError && (
          <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-red-100 flex items-center gap-2">
            <AlertCircle size={14} /> {serverError}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* РОЛЬ */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Роль в системе</label>
            <div className="relative">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select 
                {...register('role')}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-slate-900 transition-all appearance-none"
              >
                {/* 🔥 ИЗМЕНЕНИЕ: Текст заменен на ПАРТНЕР */}
                <option value="USER">ПАРТНЕР</option>
                <option value="MANAGER">МЕНЕДЖЕР</option>
              </select>
            </div>
            {errors.role && <span className="text-red-500 text-xs font-bold">{errors.role.message}</span>}
          </div>

          {/* 🔥 ИЗМЕНЕНИЕ: ФИО показываем ТОЛЬКО для Менеджера */}
          {(roleValue === 'MANAGER' || roleValue === 'ADMIN') && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">ФИО</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  {...register('name')}
                  placeholder="Иван Иванов"
                  className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-medium ${errors.name ? 'ring-2 ring-red-500' : ''}`} 
                />
              </div>
              {errors.name && <span className="text-red-500 text-xs font-bold">{errors.name.message}</span>}
            </div>
          )}
        </div>

        {/* ПОЛЯ ТОЛЬКО ДЛЯ ПАРТНЕРА (USER) */}
        {roleValue === 'USER' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Компания</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  {...register('companyName')}
                  placeholder='ООО "Название"'
                  className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-medium ${errors.companyName ? 'ring-2 ring-red-500' : ''}`} 
                />
              </div>
              {errors.companyName && <span className="text-red-500 text-xs font-bold">{errors.companyName.message}</span>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">УНП</label>
              <input 
                {...register('unp')}
                placeholder="123456789"
                maxLength={9}
                className={`w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold tracking-tighter ${errors.unp ? 'ring-2 ring-red-500' : ''}`} 
              />
              {errors.unp && <span className="text-red-500 text-xs font-bold">{errors.unp.message}</span>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Телефон (для 2FA)</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  {...register('phone')}
                  onChange={handlePhoneChange}
                  value={phoneValue}
                  placeholder="+375XXXXXXXXX"
                  className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-mono font-bold ${errors.phone ? 'ring-2 ring-red-500' : ''}`} 
                />
              </div>
              {errors.phone && <span className="text-red-500 text-xs font-bold">{errors.phone.message}</span>}
            </div>
          </div>
        )}

        {/* EMAIL И ПАРОЛЬ (Одинаковы для всех) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                {...register('email')}
                type="email"
                className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-medium ${errors.email ? 'ring-2 ring-red-500' : ''}`} 
              />
            </div>
            {errors.email && <span className="text-red-500 text-xs font-bold">{errors.email.message}</span>}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Временный пароль</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  {...register('password')}
                  className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-mono ${errors.password ? 'ring-2 ring-red-500' : ''}`} 
                />
              </div>
              <button 
                type="button" 
                onClick={generatePassword} 
                className="p-4 bg-slate-100 hover:bg-slate-200 rounded-2xl text-slate-600 transition-colors"
              >
                <RefreshCw size={20} />
              </button>
            </div>
            {errors.password && <span className="text-red-500 text-xs font-bold">{errors.password.message}</span>}
          </div>
        </div>

        {/* КНОПКИ */}
        <div className="flex gap-4 pt-4">
          <button 
            type="submit" 
            disabled={loading}
            className="flex-1 py-5 bg-slate-900 text-white rounded-3xl font-black uppercase tracking-[0.2em] text-xs hover:bg-slate-800 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <RefreshCw className="animate-spin" /> : <><Check size={16}/> Создать аккаунт</>}
          </button>
          <button 
            type="button" 
            onClick={onCancel} 
            className="px-10 py-5 text-slate-400 font-bold uppercase text-[10px] tracking-widest hover:text-slate-600"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminCreateUser;