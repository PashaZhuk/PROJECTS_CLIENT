import { useState, useEffect } from 'react';
import { ExternalLink, Newspaper, Loader2, ArrowUpRight, Info } from 'lucide-react';

interface NewsItem {
  id: number;
  title: string;
  link: string;
  imageUrl: string | null;
  createdAt: string;
}

const GRADIENT_COLORS = [
  'from-blue-600 to-indigo-700',
  'from-emerald-500 to-teal-600',
  'from-purple-500 to-violet-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-cyan-500 to-blue-600',
];

const BORDER_COLORS = [
  'border-blue-200 hover:border-blue-400',
  'border-emerald-200 hover:border-emerald-400',
  'border-purple-200 hover:border-purple-400',
  'border-amber-200 hover:border-amber-400',
];

// Демо-новости для примера, пока менеджер не создал настоящие
const DEMO_NEWS: NewsItem[] = [
  { id: -1, title: 'Новая прошивка Yealink V86', link: 'https://yealink.com', imageUrl: null, createdAt: '2026-05-14' },
  { id: -2, title: 'Обновление прайс-листа', link: 'https://google.com', imageUrl: null, createdAt: '2026-05-13' },
];

export const NewsCards = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/news')
      .then(r => r.json())
      .then(data => {
        if (data?.success && Array.isArray(data.data)) {
          setNews(data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 size={20} className="animate-spin text-slate-300" />
      </div>
    );
  }

  const items = news.length > 0 ? news : DEMO_NEWS;

  return (
    <div className="mb-6">
      {news.length === 0 && (
        <div className="flex items-center gap-2 mb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <Info size={12} />
          <span>Примеры новостей — менеджер может добавлять свои через панель управления</span>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item, idx) => {
          // Чередуем стили: градиент / с边框
          const useGradient = idx % 2 === 0;
          
          if (useGradient) {
            const color = GRADIENT_COLORS[idx % GRADIENT_COLORS.length];
            return (
              <a
                key={item.id}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`relative overflow-hidden group p-4 rounded-2xl bg-gradient-to-br ${color} text-white transition-all hover:shadow-lg hover:scale-[1.02] active:scale-95`}
              >
                <div className="absolute -right-6 -top-6 w-20 h-20 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors" />
                {item.imageUrl && (
                  <div className="relative mb-3 rounded-xl overflow-hidden aspect-video">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="relative flex items-start gap-3">
                  {!item.imageUrl && (
                    <div className="w-8 h-8 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                      <Newspaper size={16} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black uppercase tracking-tight truncate">{item.title}</span>
                      <ArrowUpRight size={12} className="opacity-50 group-hover:opacity-100 transition-opacity shrink-0" />
                    </div>
                  </div>
                </div>
              </a>
            );
          } else {
            const border = BORDER_COLORS[idx % BORDER_COLORS.length];
            return (
              <a
                key={item.id}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`group p-4 rounded-2xl border-2 ${border} bg-white transition-all hover:shadow-md hover:scale-[1.02] active:scale-95`}
              >
                {item.imageUrl && (
                  <div className="mb-3 rounded-xl overflow-hidden aspect-video">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex items-start gap-3">
                  {!item.imageUrl && (
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                      <Newspaper size={16} className="text-slate-500" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black uppercase tracking-tight text-slate-800 truncate group-hover:text-purple-700 transition-colors">{item.title}</span>
                      <ArrowUpRight size={12} className="text-slate-300 group-hover:text-purple-500 transition-colors shrink-0" />
                    </div>
                  </div>
                </div>
              </a>
            );
          }
        })}
      </div>
    </div>
  );
};
