import React from 'react';
import { ExternalLink, Zap, Bell } from 'lucide-react';

const NEWS_DATA = [
  {
    id: 1,
    title: "Новая прошивка Yealink V86",
    desc: "Улучшена стабильность видеосвязи и поддержка новых кодеков. Рекомендуем обновиться.",
    link: "https://yealink.com",
    color: "from-blue-600 to-indigo-700",
    icon: Zap
  },
  {
    id: 2,
    title: "Обновление прайс-листа",
    desc: "С 1 марта меняются цены на сетевое оборудование. Скачайте актуальный документ.",
    link: "https://google.com",
    color: "from-emerald-500 to-teal-600",
    icon: Bell
  }
];

export const NewsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {NEWS_DATA.map((item) => (
        <a 
          key={item.id}
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className={`relative overflow-hidden group p-8 rounded-[2.5rem] bg-gradient-to-br ${item.color} text-white transition-all hover:shadow-2xl hover:scale-[1.02] active:scale-95`}
        >
          {/* Декоративный круг на фоне */}
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors" />
          
          <div className="relative flex items-start gap-6">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0">
              <item.icon size={28} />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black uppercase tracking-tight">{item.title}</h3>
                <ExternalLink size={16} className="opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-white/80 text-sm leading-relaxed font-medium">
                {item.desc}
              </p>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
};