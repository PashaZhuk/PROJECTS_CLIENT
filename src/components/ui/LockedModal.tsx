import React, { useEffect, useState, useRef } from 'react';
import { AlertCircle, Clock } from 'lucide-react';

interface LockedModalProps {
  isOpen: boolean;
  /** Дата окончания блокировки (если есть) */
  lockUntil?: Date | null;
  /** Сообщение (если не указано, будет сгенерировано по умолчанию) */
  message?: string;
  /** Заголовок (по умолчанию "Доступ ограничен") */
  title?: string;
  onClose: () => void;
}

const LockedModal: React.FC<LockedModalProps> = ({ 
  isOpen, 
  lockUntil, 
  message, 
  title = "Доступ ограничен",
  onClose 
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const intervalRef = useRef<number | null>(null);
  const isClosingRef = useRef(false);

  const stopInterval = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const updateTimer = () => {
    if (!lockUntil) return;
    const now = new Date();
    const diff = Math.max(0, Math.ceil((lockUntil.getTime() - now.getTime()) / 1000));
    setTimeLeft(diff);
    if (diff <= 0 && !isClosingRef.current) {
      isClosingRef.current = true;
      stopInterval();
      onClose();
    }
  };

  useEffect(() => {
    if (!isOpen) {
      stopInterval();
      setTimeLeft(0);
      return;
    }

    isClosingRef.current = false;
    if (lockUntil) {
      updateTimer();
      intervalRef.current = window.setInterval(updateTimer, 1000);
    } else {
      setTimeLeft(0);
    }

    return () => {
      stopInterval();
    };
  }, [isOpen, lockUntil]);

  if (!isOpen) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const defaultMessage = lockUntil 
    ? "Вы превысили допустимое количество попыток входа. Попробуйте позже."
    : "Ваш аккаунт заблокирован администратором. Обратитесь в поддержку.";

  const displayMessage = message || defaultMessage;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border-2 border-red-100 animate-in zoom-in-95 duration-300">
        <div className="bg-red-50 p-8 flex flex-col items-center justify-center border-b border-red-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="text-red-600" size={32} />
          </div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight text-center">
            {title}
          </h2>
        </div>
        <div className="p-8 text-center space-y-6">
          <p className="text-slate-600 text-sm leading-relaxed">
            {displayMessage}
          </p>
          {lockUntil && timeLeft > 0 && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center justify-center gap-2">
              <Clock className="text-red-500" size={20} />
              <span className="text-lg font-mono font-bold text-red-700">
                {formatTime(timeLeft)}
              </span>
            </div>
          )}
          <button
            onClick={() => {
              if (isClosingRef.current) return;
              isClosingRef.current = true;
              stopInterval();
              onClose();
            }}
            className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-lg transition-all active:scale-95"
          >
            Понятно
          </button>
        </div>
      </div>
    </div>
  );
};

export default LockedModal;