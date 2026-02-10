import { useEffect, useState, useMemo, useCallback } from 'react';
import { Mail, Trash2, Loader2, Building2, Search, UserX, ChevronLeft, ChevronRight } from 'lucide-react'; 
import userAPI from '../../../api/user';
import { socket } from '../../../api/socket'; 

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  lastSeen: string; 
  companyName?: string;
  unp?: string;
}

const UsersList = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<'ALL' | 'USER' | 'MANAGER' | 'ADMIN'>('ALL');
  const [now, setNow] = useState(Date.now());

  // Состояние пагинации
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

const fetchUsers = useCallback(async () => {
  try {
    setLoading(true);
    const data = await userAPI.getAllUsers({
      page: currentPage,
      limit: 10,
      search: searchQuery,
      role: selectedRole === 'ALL' ? '' : selectedRole
    });

    console.log("Данные от API:", data); // Проверьте это в консоли!

    // 1. Если пришел просто массив (как на вашем скриншоте)
    if (data && data.users) {
    setUsers(data.users);
    setTotalPages(data.totalPages || 1);
    setTotalCount(data.totalCount || 0);
}
    // 2. Если бэкенд прислал объект с метаданными
    else if (data && typeof data === 'object' && Array.isArray(data.users)) {
      setUsers(data.users);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.totalCount || 0);
    } 
    // 3. На случай, если данные вложены в .data (иногда бывает при двойной обработке)
    else if (data?.data && Array.isArray(data.data)) {
      setUsers(data.data);
      setTotalCount(data.data.length);
      setTotalPages(1);
    }
    else {
      console.error("Неизвестный формат данных:", data);
      setUsers([]);
    }
  } catch (err: any) {
    console.error('Ошибка в fetchUsers:', err);
    setUsers([]);
  } finally {
    setLoading(false);
  }
}, [currentPage, searchQuery, selectedRole]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Сброс страницы при изменении фильтров
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedRole]);

  // Сокеты
  useEffect(() => {
    socket.emit('subscribe_admin_stats');
    const handleStatusChange = ({ userId, lastSeen }: { userId: number; lastSeen: string }) => {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, lastSeen } : u));
    };
    socket.on('user_status_changed', handleStatusChange);
    return () => {
      socket.off('user_status_changed', handleStatusChange);
      socket.emit('unsubscribe_admin_stats');
    };
  }, []);

  const getStatus = useCallback((user: UserData, currentTime: number) => {
    if (user.role === 'ADMIN') return { label: 'Online', color: 'bg-emerald-500', pulse: false };
    if (!user.lastSeen) return { label: 'Offline', color: 'bg-slate-300', pulse: false };
    const isOnline = (currentTime - new Date(user.lastSeen).getTime()) < 300000;
    return isOnline ? { label: 'Online', color: 'bg-emerald-500', pulse: true } : { label: 'Offline', color: 'bg-slate-300', pulse: false };
  }, []);

  const handleDelete = async (id: number, email: string) => {
    if (window.confirm(`Удалить пользователя ${email}?`)) {
      try {
        await userAPI.deleteUser(id);
        fetchUsers();
      } catch (err) {
        alert('Ошибка при удалении');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* ПАНЕЛЬ ИНСТРУМЕНТОВ */}
      <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Поиск по имени, email или организации..."
            className="w-full pl-11 pr-10 py-3.5 bg-slate-50 border border-transparent focus:border-blue-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:bg-white outline-none transition-all text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          {(['ALL', 'USER', 'MANAGER', 'ADMIN'] as const).map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                selectedRole === role ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {role === 'ALL' ? 'Все' : role}
            </button>
          ))}
        </div>
      </div>

      {/* ТАБЛИЦА */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col min-h-[500px]">
        <div className="overflow-x-auto flex-grow">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Загрузка данных...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  <th className="px-8 py-6">Информация</th>
                  <th className="px-8 py-6 text-center">Статус</th>
                  <th className="px-8 py-6">Организация</th>
                  <th className="px-8 py-6">Роль</th>
                  <th className="px-8 py-6 text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.length > 0 ? (
                  users.map((u) => {
                    const status = getStatus(u, now);
                    return (
                      <tr key={u.id} className="hover:bg-slate-50/30 transition-all group">
                        <td className="px-8 py-5">
                          <div className="flex items-center space-x-4">
                            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black text-sm border-2 ${
                              u.role === 'ADMIN' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                            }`}>
                              {u.name?.charAt(0) || '?'}
                            </div>
                            <div>
                              <div className="text-slate-900 font-bold text-base">{u.name}</div>
                              <div className="text-slate-400 text-xs flex items-center mt-0.5"><Mail size={12} className="mr-1.5 opacity-70" /> {u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <div className={`h-3 w-3 rounded-full mx-auto ${status.color} ${status.pulse ? 'animate-pulse' : ''} border-2 border-white shadow-sm`}></div>
                          <span className="text-[9px] font-black uppercase text-slate-300 mt-1">{status.label}</span>
                        </td>
                        <td className="px-8 py-5 text-xs font-bold text-slate-600">{u.companyName || '—'}</td>
                        <td className="px-8 py-5">
                          <span className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border bg-slate-50 text-slate-500 border-slate-100">
                            {u.role}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button 
                            disabled={u.role === 'ADMIN'}
                            onClick={() => handleDelete(u.id, u.email)}
                            className="p-2.5 rounded-xl text-slate-300 hover:text-red-600 hover:bg-red-50 disabled:opacity-10"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="py-20 text-center"><UserX size={40} className="mx-auto text-slate-200 mb-4" /><p className="text-slate-400 font-medium">Ничего не найдено</p></td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* ПАГИНАЦИЯ (Видна всегда под таблицей) */}
        {!loading && (
          <div className="px-8 py-6 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Всего записей: <span className="text-slate-900">{totalCount}</span>
            </span>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-xl bg-white border border-slate-200 shadow-sm disabled:opacity-30 hover:bg-slate-50 transition-all"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex items-center gap-2 font-black text-[11px] uppercase tracking-tighter">
                <span className="text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 shadow-sm">
                  Стр {currentPage}
                </span>
                <span className="text-slate-300">из</span>
                <span className="text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                  {totalPages}
                </span>
              </div>

              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="p-2 rounded-xl bg-white border border-slate-200 shadow-sm disabled:opacity-30 hover:bg-slate-50 transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersList;