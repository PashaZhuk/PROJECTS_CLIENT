import React from 'react';
import { Monitor, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

const SessionSupersededModal = () => {
  const isSuperseded = useAuthStore((s) => s.isSessionSuperseded);
  const setSuperseded = useAuthStore((s) => s.setSessionSuperseded);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  if (!isSuperseded) return null;

  const handleConfirm = async () => {
    await logout();
    setSuperseded(false);
    navigate('/login', { replace: true });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border-2 border-slate-200 animate-in zoom-in-95 duration-300">
        {/* Шапка */}
        <div className="bg-slate-50 p-8 flex flex-col items-center justify-center border-b border-slate-100">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <Monitor className="text-slate-600" size={32} />
          </div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight text-center">
            Вход с другого устройства
          </h2>
        </div>

        {/* Тело */}
        <div className="p-8 text-center space-y-6">
          <p className="text-slate-600 text-sm leading-relaxed">
            Ваш аккаунт был использован для входа с другого браузера или устройства. 
            В целях безопасности текущая сессия была завершена.
          </p>
          
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Требуется повторный вход
            </p>
          </div>

          <button
            onClick={handleConfirm}
            className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            <LogOut size={18} />
            Войти заново
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionSupersededModal;