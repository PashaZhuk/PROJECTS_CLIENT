import axios from 'axios';

const api = axios.create({
  // Базовый адрес сервера
  baseURL: 'http://192.168.85.110:5001/api', 
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  }

});

// Добавляем перехватчик ОТВЕТОВ
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      
      // Если мы и так на странице логина, ничего не делаем
      if (window.location.pathname === '/login') {
        return Promise.reject(error);
      }

      // Очищаем состояние и редиректим только один раз
      console.warn("Сессия завершена");
      window.location.replace('/login'); 
    }
    return Promise.reject(error);
  }
);



export default api;