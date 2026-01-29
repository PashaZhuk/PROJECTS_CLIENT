import { io } from 'socket.io-client';

// Указываем URL твоего бэкенда
const URL = 'http://localhost:5001'; 

export const socket = io(URL, {
  withCredentials: true,
  autoConnect: true, // Сокет подключится сам при загрузке приложения
});