import React, { useState } from 'react';
import { User, Mail, Key, RefreshCw, Check, Briefcase, Building2, ShieldCheck } from 'lucide-react';
import { useUserStore } from '../../../store/useUserStore';

interface CreateUserProps {
  onCancel: () => void;
}

const AdminCreateUser = ({ onCancel }: CreateUserProps) => {
  const { createUser, loading } = useUserStore();
  const [formData, setFormData] = useState({
    name: '', 
    email: '', 
    password: '', 
    role: 'USER', // По умолчанию Клиент
    sendEmail: true, 
    companyName: '', 
    unp: ''
  });
  const [error, setError] = useState('');

  const generatePassword = () => {
    const pass = Math.random().toString(36).slice(-12);
    setFormData({ ...formData, password: pass });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Валидация УНП только для клиентов
    if (formData.role === 'USER' && !formData.unp) {
        setError('УНП ОБЯЗАТЕЛЕН ДЛЯ КЛИЕНТА');
        return;
    }

    try {
      await createUser(formData);
      onCancel(); 
    } catch (err: any) {
      // Извлекаем сообщение об ошибке из Ky ответа
      // Теперь здесь будет либо "УНП уже занят", либо "Email уже существует"
  setError(err.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
      <div className="p-10 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
        <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Регистрация</h2>
        <ShieldCheck className="text-slate-200" size={32} />
      </div>

      <form onSubmit={handleSubmit} className="p-10 space-y-6">
        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-red-100 animate-pulse">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* РОЛЬ - Убрали ADMIN */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Роль в системе</label>
            <div className="relative">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-slate-900 transition-all appearance-none"
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value})}
              >
                <option value="USER">КЛИЕНТ (USER)</option>
                <option value="MANAGER">МЕНЕДЖЕР</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">ФИО</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                required 
                placeholder="Иван Иванов"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-slate-900 transition-all" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
              />
            </div>
          </div>
        </div>

        {/* ДИНАМИЧЕСКИЕ ПОЛЯ - только для роли USER */}
        {formData.role === 'USER' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Компания</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-medium" 
                  value={formData.companyName} 
                  onChange={e => setFormData({...formData, companyName: e.target.value})} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">УНП</label>
              <input 
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold tracking-tighter" 
                value={formData.unp} 
                onChange={e => setFormData({...formData, unp: e.target.value})} 
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="email" 
                required 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-medium" 
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})} 
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Пароль</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  required 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-mono" 
                  value={formData.password} 
                  onChange={e => setFormData({...formData, password: e.target.value})} 
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
          </div>
        </div>

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
            className="px-10 py-5 text-slate-400 font-bold uppercase text-[10px] tracking-widest hover:text-slate-600 transition-colors"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminCreateUser;