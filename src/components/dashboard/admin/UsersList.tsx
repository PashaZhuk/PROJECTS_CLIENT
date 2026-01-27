import React, { useEffect, useState, useMemo } from 'react';
import { Mail, Trash2, Shield, User, Calendar, Loader2, Building2, Fingerprint, Briefcase, Search, X, Filter, Users as UsersIcon } from 'lucide-react';
import userAPI from '../../../api/user';

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  companyName?: string;
  unp?: string;
}

const UsersList = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Состояния для поиска и фильтрации
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAllUsers();
      setUsers(response.data);
      setError('');
    } catch (err: any) {
      setError('Не удалось загрузить список пользователей');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Мемоизированная фильтрация (выполняется при изменении searchQuery или selectedRole)
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.unp?.includes(searchQuery);

      const matchesRole = selectedRole === 'ALL' || user.role === selectedRole;

      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, selectedRole]);

  const handleDelete = async (id: number, email: string) => {
    if (window.confirm(`Вы уверены, что хотите удалить пользователя ${email}?`)) {
      try {
        await userAPI.deleteUser(id);
        setUsers(users.filter(user => user.id !== id));
      } catch (err) {
        alert('Ошибка при удалении пользователя');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-2" />
        <p className="text-slate-500 text-sm font-medium">Синхронизация данных...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ПАНЕЛЬ ИНСТРУМЕНТОВ (ПОИСК И ФИЛЬТРЫ) */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        {/* Строка поиска */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Поиск по имени, почте, компании или УНП..."
            className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 rounded-full transition-colors"
            >
              <X size={14} className="text-slate-500" />
            </button>
          )}
        </div>

        {/* Фильтр по ролям */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
            {['ALL', 'USER', 'MANAGER', 'ADMIN'].map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${
                  selectedRole === role 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {role === 'ALL' ? 'Все' : role}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ТАБЛИЦА */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Пользователи</h3>
            <p className="text-slate-400 text-xs mt-1">
              {searchQuery ? `Найдено совпадений: ${filteredUsers.length}` : 'Управление доступом'}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                <th className="px-8 py-5">Основная информация</th>
                <th className="px-8 py-5">Организация / УНП</th>
                <th className="px-8 py-5">Роль</th>
                <th className="px-8 py-5">Регистрация</th>
                <th className="px-8 py-5 text-right">Управление</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/30 transition-all group animate-in fade-in duration-300">
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-4">
                      <div className={`h-11 w-11 rounded-2xl flex items-center justify-center font-black text-sm transition-transform group-hover:scale-110 ${
                        u.role === 'ADMIN' ? 'bg-purple-100 text-purple-600' : 
                        u.role === 'MANAGER' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {u.name?.charAt(0) || <User size={18} />}
                      </div>
                      <div>
                        <div className="text-slate-900 font-bold text-base tracking-tight">{u.name}</div>
                        <div className="text-slate-400 text-xs flex items-center mt-0.5">
                          <Mail size={12} className="mr-1.5 opacity-70" /> {u.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-8 py-5">
                    {u.role === 'USER' ? (
                      <div className="space-y-1">
                        <div className="text-slate-700 font-bold text-sm flex items-center">
                          <Building2 size={14} className="mr-1.5 text-blue-500" />
                          {u.companyName}
                        </div>
                        <div className="text-slate-400 text-[11px] font-mono flex items-center bg-slate-100 w-fit px-1.5 py-0.5 rounded">
                          <Fingerprint size={12} className="mr-1.5 opacity-60" />
                          УНП: {u.unp}
                        </div>
                      </div>
                    ) : (
                      <div className="text-slate-300 italic text-xs">Внутренний аккаунт</div>
                    )}
                  </td>

                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                      u.role === 'ADMIN' ? 'bg-purple-50 text-purple-600 border border-purple-100' : 
                      u.role === 'MANAGER' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                      'bg-blue-50 text-blue-600 border border-blue-100'
                    }`}>
                      {u.role === 'ADMIN' && <Shield size={12} className="mr-1.5" />}
                      {u.role === 'MANAGER' && <Briefcase size={12} className="mr-1.5" />}
                      {u.role === 'USER' && <UsersIcon size={12} className="mr-1.5" />}
                      {u.role}
                    </span>
                  </td>

                  <td className="px-8 py-5 text-slate-500">
                    <div className="text-sm font-medium text-slate-600">
                      {new Date(u.createdAt).toLocaleDateString('ru-RU')}
                    </div>
                  </td>

                  <td className="px-8 py-5 text-right">
                    <button 
                      onClick={() => handleDelete(u.id, u.email)}
                      className="p-2.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all active:scale-90"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="py-20 text-center">
              <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-slate-300" size={32} />
              </div>
              <p className="text-slate-400 font-medium">Никого не нашли по этому запросу</p>
              <button 
                onClick={() => {setSearchQuery(''); setSelectedRole('ALL');}}
                className="mt-2 text-blue-600 text-sm font-bold hover:underline"
              >
                Сбросить фильтры
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersList;