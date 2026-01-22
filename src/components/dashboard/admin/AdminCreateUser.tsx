import React, { useState } from 'react';
import axios from 'axios';
import { User, Mail, Key, Shield, RefreshCw, Check } from 'lucide-react';

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
    sendEmail: true
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
    setLoading(true);
    setError('');

    try {
      await axios.post('http://192.168.85.110:5001/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      }, { withCredentials: true });

      onUserCreated(); // Вызываем редирект на список
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ошибка при создании пользователя');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 bg-gray-50/50">
          <h2 className="text-2xl font-bold text-gray-800">Регистрация сотрудника</h2>
          <p className="text-gray-500 mt-1">Данные будут сохранены в системе управления доступом</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="p-4 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100 flex items-center gap-2">
               <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" /> {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">ФИО</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={18} />
                <input required type="text" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" 
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                <input required type="email" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-semibold text-gray-700">Временный пароль</label>
              <button type="button" onClick={generatePassword} className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 uppercase tracking-wider">
                <RefreshCw size={12} /> Сгенерировать
              </button>
            </div>
            <div className="relative">
              <Key className="absolute left-3 top-3 text-gray-400" size={18} />
              <input required type="text" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 ml-1">Роль в системе</label>
            <div className="relative">
              <Shield className="absolute left-3 top-3 text-gray-400" size={18} />
              <select className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
                value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                <option value="USER">Менеджер (Доступ к заказам)</option>
                <option value="ADMIN">Администратор (Полный доступ)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100 cursor-pointer"
               onClick={() => setFormData({...formData, sendEmail: !formData.sendEmail})}>
            <div className={`h-6 w-6 rounded-lg border flex items-center justify-center transition-all ${formData.sendEmail ? 'bg-blue-600 border-blue-600 shadow-md shadow-blue-200' : 'bg-white border-gray-300'}`}>
              {formData.sendEmail && <Check size={16} className="text-white" />}
            </div>
            <span className="text-sm text-blue-800 font-medium italic">Отправить данные для входа на электронную почту</span>
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-50">
            <button type="button" onClick={onCancel} className="flex-1 px-6 py-4 font-bold text-gray-500 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-all">
              Отмена
            </button>
            <button disabled={loading} className="flex-1 px-6 py-4 font-bold text-white bg-blue-600 rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-100 disabled:opacity-50 transition-all active:scale-95">
              {loading ? 'Создание...' : 'Зарегистрировать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCreateUser;