import { useEffect, useRef } from 'react';

interface YandexMapProps {
  mapId: string;
  height?: number;
}

const YandexMap = ({ mapId, height = 320 }: YandexMapProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    if (!mapId || !containerRef.current) return;

    // Очищаем предыдущую карту
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.charset = 'utf-8';
    script.async = true;
    script.src = `https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3A${mapId}&width=100%25&height=${height}&lang=ru_RU&scroll=true`;
    
    scriptRef.current = script;
    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      scriptRef.current = null;
    };
  }, [mapId, height]);

  return (
    <div 
      ref={containerRef} 
      className="w-full"
      style={{ minHeight: height }}
    />
  );
};

export default YandexMap;
