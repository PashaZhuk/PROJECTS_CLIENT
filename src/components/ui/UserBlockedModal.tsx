import React from 'react';
import { Ban } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

const UserBlockedModal = () => {
  const isBlocked = useAuthStore((s) => s.isUserBlocked);
  const setUserBlocked = useAuthStore((s) => s.setUserBlocked);
  const navigate = useNavigate();

  if (!isBlocked) return null;

  const handleConfirm = () => {
    setUserBlocked(false);
    navigate('/login', { replace: true });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border-2 border-red-100 animate-in zoom-in-95 duration-300">
        <div className="bg-red-50 p-8 flex flex-col items-center justify-center border-b border-red-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Ban className="text-red-600" size={32} />
          </div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight text-center">
            Аккаунт заблокирован
          </h2>
        </div>
        <div className="p-8 text-center space-y-6">
          <p className="text-slate-600 text-sm leading-relaxed">
            Ваш аккаунт был заблокирован администратором портала.
            Для выяснения причин обратитесь к администратору.
          </p>
          <div className="bg-red-50 border border-red-100 rounded-xl p-4">
            <p className="text-xs font-bold text-red-700 uppercase tracking-wider">
              Доступ к порталу ограничен
            </p>
          </div>
          <button
            onClick={handleConfirm}
            className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-lg transition-all active:scale-95"
          >
            Понятно
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserBlockedModal;