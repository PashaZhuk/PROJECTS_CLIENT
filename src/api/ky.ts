import ky from 'ky';

const api = ky.create({
  prefixUrl: 'http://192.168.85.110:5001/api',
  credentials: 'include',
  timeout: 20000, // 20 секунд
  hooks: {
    beforeRequest: [
      (request) => {
        // Ky автоматически обрабатывает куки с credentials: 'include'
        // если они нужны для CORS
      }
    ],
    afterResponse: [
      async (request, options, response) => {
        // Обработка ошибок 401 и 403 (аналог interceptors в axios)
        if (response.status === 401 || response.status === 403) {
          if (window.location.pathname !== '/login') {
            console.warn("Сессия завершена");
            window.location.replace('/login');
          }
        }
      }
    ]
  }
});

export default api;