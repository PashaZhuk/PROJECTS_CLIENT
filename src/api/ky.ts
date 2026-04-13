import ky from 'ky';
import { useAuthStore } from '../store/useAuthStore';

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  console.error('❌ Ошибка: Переменная окружения VITE_API_URL не найдена! Проверьте файл .env');
}

// Флаг для предотвращения повторного срабатывания logout
// пока предыдущий ещё выполняется (например, если несколько
// параллельных запросов одновременно получили 401)
let isLoggingOut = false;

const api = ky.create({
  prefixUrl: API_URL || 'http://localhost:5001/api',
  credentials: 'include',
  timeout: 20000,
  hooks: {
    afterResponse: [
      async (request, options, response) => {
        // Реагируем только на 401 — сессия истекла.
        // 403 — это "нет прав", logout не нужен (пользователь залогинен,
        // просто у него нет доступа к конкретному ресурсу).
        // 400, 422, 500 и прочие — бизнес-ошибки, logout не нужен.
        if (response.status !== 401) return;

        const url = request.url;

        // /auth/* обрабатываем вручную в checkAuth/login — не трогаем,
        // иначе неверный пароль при логине тоже вызовет logout
        if (url.includes('/auth/')) return;

        const { isAuthenticated, isSessionExpired, setSessionExpired } = useAuthStore.getState();

        // Если уже показываем модалку или уже идёт logout — выходим
        if (isSessionExpired || isLoggingOut) return;

        if (isAuthenticated) {
          isLoggingOut = true;

          // Сначала помечаем сессию как истёкшую — модалка появится сразу
          setSessionExpired(true);

          // Затем чистим стор (logout делает set + localStorage.removeItem)
          useAuthStore.getState().logout()
            .catch(console.error)
            .finally(() => {
              isLoggingOut = false;
            });
        }
      }
    ]
  }
});

export default api;
