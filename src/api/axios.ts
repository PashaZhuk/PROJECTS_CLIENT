import axios from 'axios';

const api = axios.create({
  // Базовый адрес сервера
  baseURL: 'http://192.168.85.110:5001/api', 
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api;