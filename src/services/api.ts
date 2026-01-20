import axios from 'axios';

const api = axios.create({
  // Базовый адрес твоего сервера
  baseURL: 'http://192.168.85.110:5001/api', 
  
  // ЭТО И ЕСТЬ ТА САМАЯ НАСТРОЙКА:
  withCredentials: true, 
  
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api;