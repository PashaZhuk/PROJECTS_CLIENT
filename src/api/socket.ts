import { io } from 'socket.io-client';

// Получаем URL из переменных окружения
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

if (!SOCKET_URL) {
  console.error('❌ Ошибка: Переменная окружения VITE_SOCKET_URL не найдена! Проверьте файл .env');
}

// Единственный глобальный сокет-синглтон
export const socket = io(SOCKET_URL || 'http://localhost:5001', {
  withCredentials: true,
  autoConnect: true,
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: 5,
});