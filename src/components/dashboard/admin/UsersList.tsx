import { useEffect } from 'react';
import { Mail, Trash2, Search, ChevronLeft, ChevronRight, RefreshCw, UserCheck } from 'lucide-react'; 
import { useUserStore } from '../../../store/useUserStore';

const UsersList = () => {
  const { 
    users, loading, searchQuery, setSearchQuery, 
    currentPage, totalPages, fetchUsers, deleteUser, setCurrentPage 
  } = useUserStore();

  // Дебаунс поиск и пагинация
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 400); 
    return () => clearTimeout(timer);
  }, [fetchUsers, currentPage, searchQuery]);

  return (
    <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500">
      
      {/* ПАНЕЛЬ ПОИСКА */}
      <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between gap-6 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text"
            placeholder="Поиск по имени, email или компании..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900 transition-all text-sm font-medium"
          />
        </div>
        {loading && <RefreshCw className="animate-spin text-slate-300" size={20} />}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50">
            <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              <th className="px-10 py-5 italic text-slate-500">Пользователь</th>
              <th className="px-6 py-5">Роль</th>
              <th className="px-6 py-5">Компания / УНП</th>
              <th className="px-10 py-5 text-right">Действия</th>
            </tr>
          </thead>
          <tbody className={`divide-y divide-slate-100 transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
            {users.length > 0 ? (
              users.map(user => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      {/* АВАТАР СО СТАТУСОМ ONLINE */}
                      <div className="relative">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${
                          user.role === 'ADMIN' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {user.name[0].toUpperCase()}
                        </div>
                        {user.isOnline && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-white rounded-full animate-pulse" />
                        )}
                      </div>
                      
                      <div>
                        <div className="font-black text-slate-900 text-sm uppercase italic tracking-tight flex items-center gap-2">
                          {user.name}
                          {user.role === 'ADMIN' && <UserCheck size={14} className="text-blue-500" />}
                        </div>
                        <div className="text-[10px] text-slate-400 font-bold flex items-center gap-1 uppercase tracking-tighter">
                          <Mail size={10}/> {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-6">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                      user.role === 'ADMIN' ? 'bg-slate-900 text-white border-slate-900' : 
                      user.role === 'MANAGER' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                      'bg-blue-50 text-blue-600 border-blue-100'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  
                  <td className="px-6 py-6">
                    <div className="text-xs font-bold text-slate-600">{user.companyName || '—'}</div>
                    {user.unp && <div className="text-[9px] text-slate-400 font-black tracking-widest mt-0.5">УНП: {user.unp}</div>}
                  </td>
                  
                  <td className="px-10 py-6 text-right">
                    <button 
                      onClick={() => deleteUser(user.id)} 
                      disabled={user.role === 'ADMIN'} // Защита от удаления админов (по желанию)
                      className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all disabled:opacity-0"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : !loading && (
              <tr>
                <td colSpan={4} className="px-10 py-20 text-center">
                  <div className="text-slate-400 font-black uppercase tracking-[0.2em] text-xs">Пользователи не найдены</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ПАГИНАЦИЯ */}
      <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Стр {currentPage} из {totalPages}
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setCurrentPage(currentPage - 1)} 
            disabled={currentPage === 1 || loading}
            className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 shadow-sm disabled:opacity-30 transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => setCurrentPage(currentPage + 1)} 
            disabled={currentPage === totalPages || loading}
            className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 shadow-sm disabled:opacity-30 transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsersList;