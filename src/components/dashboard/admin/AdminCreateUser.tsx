import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Key, RefreshCw, Check, Briefcase, ShieldCheck, Phone, AlertCircle } from 'lucide-react';
import Select from 'react-select';
import { useCreateUser } from '../../../hooks/useUsersQuery';
import { userFormSchema, type UserFormData } from '../../../schemas/userSchema';
import api from '../../../api/ky';

interface CompanyOption {
  value: number;
  label: string;
  unp: string;
  phone?: string;
}

interface CreateUserProps {
  onCancel: () => void;
}

const AdminCreateUser = ({ onCancel }: CreateUserProps) => {
  const createMutation = useCreateUser();
  const loading = createMutation.isPending;
  const [serverError, setServerError] = useState('');
  const [companies, setCompanies] = useState<CompanyOption[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<CompanyOption | null>(null);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      role: 'USER',
      email: '',
      password: '',
      companyName: '',
      unp: '',
      phone: '+375',
    },
  });

  const roleValue = watch('role');

  useEffect(() => {
    const fetchCompanies = async () => {
      setIsLoadingCompanies(true);
      try {
        const response: any = await api.get('companies').json();
        const opts = response.data.map((c: any) => ({
          value: c.id,
          label: `${c.name} (УНП: ${c.unp})`,
          unp: c.unp,
          phone: c.phone,
        }));
        setCompanies(opts);
      } catch (err) {
        console.error('Failed to load companies', err);
      } finally {
        setIsLoadingCompanies(false);
      }
    };
    fetchCompanies();
  }, []);

  const handleCompanyChange = (option: CompanyOption | null) => {
    setSelectedCompany(option);
    if (option) {
      setValue('companyName', option.label.split(' (УНП:')[0]);
      setValue('unp', option.unp);
      if (option.phone) setValue('phone', option.phone);
    } else {
      setValue('companyName', '');
      setValue('unp', '');
    }
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let pass = '';
    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setValue('password', pass, { shouldValidate: true });
  };

  const onSubmit = async (data: UserFormData) => {
    setServerError('');
    const payload: any = { ...data };
    if (data.role === 'USER') {
      delete payload.name; // убираем name (если вдруг он есть)
    } else {
      delete payload.companyName;
      delete payload.unp;
      delete payload.phone;
    }
    try {
      await createMutation.mutateAsync(payload);
      onCancel();
    } catch (err: any) {
      setServerError(err.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
      <div className="p-10 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Регистрация партнера</h2>
        <ShieldCheck className="text-slate-200" size={32} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-10 space-y-6">
        {serverError && (
          <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-red-100 flex items-center gap-2">
            <AlertCircle size={14} /> {serverError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Роль в системе</label>
            <div className="relative">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select
                {...register('role')}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-slate-900 transition-all appearance-none"
              >
                <option value="USER">ПАРТНЕР</option>
                <option value="MANAGER">МЕНЕДЖЕР</option>
              </select>
            </div>
            {errors.role && <span className="text-red-500 text-xs font-bold">{errors.role.message}</span>}
          </div>

          {/* Поле ФИО только для менеджера */}
          {roleValue === 'MANAGER' && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">ФИО</label>
              <input
                {...register('name')}
                placeholder="Иван Иванов"
                className={`w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-medium ${errors.name ? 'ring-2 ring-red-500' : ''}`}
              />
              {errors.name && <span className="text-red-500 text-xs font-bold">{errors.name.message}</span>}
            </div>
          )}
        </div>

        {roleValue === 'USER' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Компания</label>
              <Select
                options={companies}
                isLoading={isLoadingCompanies}
                placeholder="Выберите компанию..."
                value={selectedCompany}
                onChange={handleCompanyChange}
                isClearable
                className="react-select-container"
                classNamePrefix="react-select"
                styles={{
                  control: (base) => ({
                    ...base,
                    backgroundColor: '#f8fafc',
                    borderRadius: '1rem',
                    border: 'none',
                    padding: '0.25rem 0',
                    boxShadow: 'none',
                  }),
                }}
              />
              <input type="hidden" {...register('companyName')} />
              {errors.companyName && <span className="text-red-500 text-xs font-bold">{errors.companyName.message}</span>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">УНП</label>
              <input
                {...register('unp')}
                readOnly
                className="w-full px-6 py-4 bg-slate-100 border-none rounded-2xl text-sm font-bold tracking-tighter cursor-default"
              />
              {errors.unp && <span className="text-red-500 text-xs font-bold">{errors.unp.message}</span>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Телефон (для 2FA)</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  {...register('phone')}
                  placeholder="+375XXXXXXXXX"
                  className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-mono font-bold ${errors.phone ? 'ring-2 ring-red-500' : ''}`}
                />
              </div>
              {errors.phone && <span className="text-red-500 text-xs font-bold">{errors.phone.message}</span>}
            </div>
          </div>
        )}

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

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-5 bg-slate-900 text-white rounded-3xl font-black uppercase tracking-[0.2em] text-xs hover:bg-slate-800 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <RefreshCw className="animate-spin" /> : <><Check size={16} /> Создать аккаунт</>}
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