import { AlertTriangle, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

const SessionExpiredModal = () => {
  const isSessionExpired = useAuthStore((state) => state.isSessionExpired);
  const setSessionExpired = useAuthStore((state) => state.setSessionExpired);
  const navigate = useNavigate();

  if (!isSessionExpired) return null;

  const handleLogoutClick = () => {
    // Скрываем модалку
    setSessionExpired(false);
    // Редирект на логин (кука уже удалена в таймере)
    navigate('/login', { replace: true });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-red-900/20 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border-2 border-red-100 animate-in zoom-in-95 duration-300">
        <div className="bg-red-50 p-8 flex flex-col items-center justify-center border-b border-red-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
            <AlertTriangle className="text-red-600" size={32} />
          </div>
          <h2 className="text-xl font-black text-red-900 uppercase tracking-tight text-center">
            Сессия истекла
          </h2>
        </div>

        <div className="p-8 text-center space-y-6">
          <p className="text-slate-600 text-sm leading-relaxed">
            Вы отсутствовали слишком долго. В целях безопасности ваш доступ к порталу был временно ограничен.
          </p>
          <div className="bg-red-50 border border-red-100 rounded-xl p-4">
            <p className="text-xs font-bold text-red-800 uppercase tracking-wider">
              Требуется повторный вход
            </p>
          </div>

          <button
            onClick={handleLogoutClick}
            className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-lg shadow-red-200 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            <LogOut size={18} />
            Войти заново
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionExpiredModal;