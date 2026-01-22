import React, { useEffect, useState } from 'react';
import { Mail, Trash2, Shield, User, Calendar, Loader2 } from 'lucide-react';
import api from '../../../services/api'; // Путь к твоему настроенному axios

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const UsersList = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Загрузка списка пользователей
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/user/users'); // Проверь роут на бэкенде
      setUsers(response.data.data);
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

  // Функция удаления пользователя
  const handleDelete = async (id: number, email: string) => {
    if (window.confirm(`Вы уверены, что хотите удалить пользователя ${email}?`)) {
      try {
        await api.delete(`/user/users/${id}`); // Нужно будет создать этот роут на бэкенде
        setUsers(users.filter(user => user.id !== id)); // Удаляем из стейта без перезагрузки
      } catch (err) {
        alert('Ошибка при удалении пользователя');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-2" />
        <p className="text-gray-500 text-sm">Загрузка данных...</p>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-600 bg-red-50 rounded-lg">{error}</div>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-50 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800">Зарегистрированные пользователи</h3>
        <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full">
          Всего: {users.length}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 text-gray-400 text-[11px] uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">Пользователь</th>
              <th className="px-6 py-4 font-semibold">Статус (Роль)</th>
              <th className="px-6 py-4 font-semibold">Дата создания</th>
              <th className="px-6 py-4 font-semibold text-right">Действие</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-9 w-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold">
                      {u.name?.charAt(0) || <User size={16} />}
                    </div>
                    <div>
                      <div className="text-gray-900 font-semibold">{u.name || 'Без имени'}</div>
                      <div className="text-gray-500 text-xs flex items-center">
                        <Mail size={12} className="mr-1" /> {u.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
                  }`}>
                    <Shield size={10} className="mr-1" />
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">
                  <div className="flex items-center">
                    <Calendar size={12} className="mr-1" />
                    {new Date(u.createdAt).toLocaleDateString('ru-RU')}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => handleDelete(u.id, u.email)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Удалить пользователя"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersList;