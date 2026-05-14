import { useState, useEffect } from 'react';
import { ExternalLink, Newspaper, Loader2 } from 'lucide-react';

interface NewsItem {
  id: number;
  title: string;
  link: string;
  imageUrl: string | null;
  createdAt: string;
}

const COLORS = [
  'from-blue-600 to-indigo-700',
  'from-emerald-500 to-teal-600',
  'from-purple-500 to-violet-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-cyan-500 to-blue-600',
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
      <div className="flex items-center justify-center py-10">
        <Loader2 size={24} className="animate-spin text-slate-300" />
      </div>
    );
  }

  if (news.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {news.map((item, idx) => {
        const color = COLORS[idx % COLORS.length];
        return (
          <a
            key={item.id}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`relative overflow-hidden group p-6 rounded-[2.5rem] bg-gradient-to-br ${color} text-white transition-all hover:shadow-2xl hover:scale-[1.02] active:scale-95`}
          >
            {/* Background decoration */}
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors" />

            {/* Image if present */}
            {item.imageUrl && (
              <div className="relative mb-4 rounded-2xl overflow-hidden aspect-video">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
            )}

            <div className="relative flex items-start gap-4">
              {!item.imageUrl && (
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0">
                  <Newspaper size={24} />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black uppercase tracking-tight truncate">{item.title}</h3>
                  <ExternalLink size={16} className="opacity-50 group-hover:opacity-100 transition-opacity shrink-0" />
                </div>
              </div>
            </div>
          </a>
        );
      })}
    </div>
  );
};
