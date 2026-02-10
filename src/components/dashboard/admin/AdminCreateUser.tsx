import React, { useState } from 'react';
import api from '../../../api/axios';
import { User, Mail, Key, RefreshCw, Check, Briefcase, Users, Building2, Fingerprint, AlertCircle } from 'lucide-react';

interface CreateUserProps {
  onUserCreated: () => void;
  onCancel: () => void;
}

const AdminCreateUser = ({ onUserCreated, onCancel }: CreateUserProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER',
    sendEmail: true,
    companyName: '',
    unp: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generatePassword = () => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let retVal = "";
    for (let i = 0; i < 12; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setFormData({ ...formData, password: retVal });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Фронтенд валидация перед отправкой
    if (formData.role === 'USER') {
      if (formData.unp.length !== 9) {
        setError('УНП должен состоять ровно из 9 цифр');
        return;
      }
      if (!formData.companyName.trim()) {
        setError('Укажите наименование юридического лица');
        return;
      }
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        sendEmail: formData.sendEmail,
        companyName: formData.role === 'USER' ? formData.companyName.trim() : undefined,
        unp: formData.role === 'USER' ? formData.unp.trim() : undefined
      });

      onUserCreated(); 
    } catch (err: any) {
      // Здесь мы ловим ошибки уникальности от Prisma/Backend (P2002 и др.)
      const errorMessage = err.response?.data?.error || 'Ошибка при создании пользователя';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 bg-gray-50/50">
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Регистрация в системе</h2>
          <p className="text-gray-500 mt-1">Создание учетной записи для клиента или сотрудника</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="p-4 text-sm text-red-700 bg-red-50 rounded-2xl border border-red-100 flex items-start gap-3 animate-in shake-in duration-300">
              <AlertCircle className="shrink-0 mt-0.5" size={18} />
              <p className="font-medium">{error}</p>
            </div>
          )}

          {/* ВЫБОР РОЛИ */}
          <div className="space-y-3">
            <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Роль аккаунта</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                onClick={() => { setFormData({...formData, role: 'USER'}); setError(''); }}
                className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${formData.role === 'USER' ? 'border-blue-600 bg-blue-50/50 shadow-md shadow-blue-100' : 'border-gray-100 hover:border-gray-200'}`}
              >
                <div className={`p-2.5 rounded-xl ${formData.role === 'USER' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                  <Users size={22} />
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-800">Партнер</p>
                  <p className="text-[11px] text-gray-500 leading-tight">Доступ к регистрации проектов</p>
                </div>
              </div>

              <div 
                onClick={() => { setFormData({...formData, role: 'MANAGER'}); setError(''); }}
                className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${formData.role === 'MANAGER' ? 'border-emerald-600 bg-emerald-50/50 shadow-md shadow-emerald-100' : 'border-gray-100 hover:border-gray-200'}`}
              >
                <div className={`p-2.5 rounded-xl ${formData.role === 'MANAGER' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                  <Briefcase size={22} />
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-800">Менеджер</p>
                  <p className="text-[11px] text-gray-500 leading-tight">Управление и модерация заявок</p>
                </div>
              </div>
            </div>
          </div>

          {/* ПОЛЯ ПАРТНЕРА */}
          {formData.role === 'USER' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100 animate-in zoom-in-95 duration-300">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Юр. лицо</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3.5 text-slate-400" size={18} />
                  <input 
                    required 
                    type="text" 
                    className="w-full pl-10 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-300 text-sm" 
                    value={formData.companyName} 
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})} 
                    placeholder="Напр: ООО 'Аксата'" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">УНП (9 цифр)</label>
                <div className="relative">
                  <Fingerprint className="absolute left-3 top-3.5 text-slate-400" size={18} />
                  <input 
                    required 
                    type="text"
                    maxLength={9}
                    className="w-full pl-10 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-300 font-mono text-sm" 
                    value={formData.unp} 
                    onChange={(e) => setFormData({...formData, unp: e.target.value.replace(/\D/g, '')})} 
                    placeholder="123456789" 
                  />
                </div>
              </div>
            </div>
          )}

          {/* КОНТАКТНЫЕ ДАННЫЕ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">ФИО представителя</label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
                <input required type="text" className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm" 
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Иванов И.И." />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Email (Логин)</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
                <input required type="email" className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm"
                  value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="partner@mail.com" />
              </div>
            </div>
          </div>

          {/* ПАРОЛЬ */}
          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Временный пароль</label>
              <button type="button" onClick={generatePassword} className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 uppercase tracking-wider transition-colors">
                <RefreshCw size={12} /> Обновить
              </button>
            </div>
            <div className="relative">
              <Key className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <input required type="text" className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="Сгенерируйте пароль" />
            </div>
          </div>

          {/* УВЕДОМЛЕНИЕ */}
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer transition-all hover:bg-slate-100"
                onClick={() => setFormData({...formData, sendEmail: !formData.sendEmail})}>
            <div className={`h-6 w-6 rounded-lg border flex items-center justify-center transition-all ${formData.sendEmail ? 'bg-blue-600 border-blue-600 shadow-md shadow-blue-100' : 'bg-white border-gray-300'}`}>
              {formData.sendEmail && <Check size={14} className="text-white" strokeWidth={3} />}
            </div>
            <span className="text-sm text-slate-600 font-medium">Выслать пароль и инструкции на Email пользователя</span>
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-100">
            <button type="button" onClick={onCancel} className="flex-1 px-6 py-4 font-bold text-gray-400 hover:text-gray-600 transition-all">
              Отмена
            </button>
            <button disabled={loading} className="flex-2 px-6 py-4 font-bold text-white bg-slate-900 rounded-2xl hover:bg-slate-800 shadow-xl shadow-slate-200 disabled:opacity-50 transition-all active:scale-95 flex justify-center items-center gap-2">
              {loading ? (
                <>
                  <RefreshCw className="animate-spin" size={18} />
                  Регистрация...
                </>
              ) : 'Зарегистрировать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCreateUser;