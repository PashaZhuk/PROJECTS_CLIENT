import { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, Loader2 } from 'lucide-react';

interface NewsItem {
  id: number;
  title: string;
  link: string;
  imageUrl: string | null;
  createdAt: string;
}

const ICON_COLORS: Record<string, string> = {
  orange: "bg-orange-50 text-orange-500 border-orange-100",
  emerald: "bg-emerald-50 text-emerald-500 border-emerald-100",
  blue: "bg-blue-50 text-blue-500 border-blue-100",
  purple: "bg-purple-50 text-purple-500 border-purple-100",
  amber: "bg-amber-50 text-amber-500 border-amber-100",
  rose: "bg-rose-50 text-rose-500 border-rose-100",
};

const CARD_COLORS = ['purple', 'amber', 'emerald', 'blue', 'rose', 'orange'];

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
      <div className="flex items-center justify-center py-10">
        <Loader2 size={24} className="animate-spin text-slate-300" />
      </div>
    );
  }

  if (news.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {news.map((item, idx) => {
        const colorKey = CARD_COLORS[idx % CARD_COLORS.length];
        const iconColor = ICON_COLORS[colorKey];

        return (
          <a
            key={item.id}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="p-8 rounded-[2.5rem] border bg-white shadow-lg transition-all hover:-translate-y-1 duration-300 group"
          >
            <div className={`w-14 h-14 ${iconColor} rounded-2xl flex items-center justify-center mb-6 shadow-inner`}>
              <Newspaper size={28} />
            </div>
            <div className="flex items-start gap-2">
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] flex-1">
                {item.title}
              </p>
              <ExternalLink size={14} className="text-slate-300 group-hover:text-purple-500 transition-colors shrink-0 mt-0.5" />
            </div>
            {item.createdAt && (
              <p className="text-[9px] font-bold text-slate-300 mt-2 uppercase tracking-wider">
                {new Date(item.createdAt).toLocaleDateString('ru-RU')}
              </p>
            )}
          </a>
        );
      })}
    </div>
  );
};
