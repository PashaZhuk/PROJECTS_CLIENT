import { useState } from 'react';
import { MessageCircle, X, ExternalLink, Send } from 'lucide-react';

const TELEGRAM_BOT = 'IPMATIKA_BEL_bot';
const TELEGRAM_LINK = `https://t.me/${TELEGRAM_BOT}`;

const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Плавающая кнопка */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-300/50 hover:shadow-xl hover:shadow-blue-400/50 hover:scale-105 active:scale-95 transition-all duration-200"
        title="Связаться с менеджером"
      >
        <MessageCircle size={24} />
      </button>

      {/* Попап */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-80 animate-in fade-in slide-in-from-bottom-8 duration-200">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
            
            {/* Шапка */}
            <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <div className="flex items-center gap-3">
                <MessageCircle size={20} />
                <span className="text-sm font-bold">Связь с менеджером</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {/* Тело */}
            <div className="px-5 py-6 text-center">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
                <Send size={28} className="text-blue-500" />
              </div>
              <p className="text-sm font-semibold text-slate-800 mb-2">
                Напишите менеджеру в Telegram
              </p>
              <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                Нажмите кнопку ниже, чтобы открыть Telegram Desktop
                и написать сообщение. Менеджер ответит в рабочее время.
              </p>

              <a
                href={TELEGRAM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-bold rounded-xl shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-300 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <ExternalLink size={16} />
                <span>Открыть Telegram</span>
              </a>

              <p className="text-[10px] text-slate-300 mt-4">
                @{TELEGRAM_BOT}
              </p>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default ChatButton;
