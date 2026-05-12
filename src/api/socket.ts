import { io, Socket } from 'socket.io-client';

export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';

let socket: Socket | null = null;

export const getSocket = (): Socket | null => socket;

export const initSocket = (): Socket => {
  // Если уже есть активное соединение, возвращаем его
  if (socket && socket.connected) {
    return socket;
  }
  // Если есть отключённый экземпляр, переподключаем с включённым reconnection
  if (socket) {
    socket.io?.reconnection(true);
    socket.connect();
    return socket;
  }
  // Создаём новое соединение
  socket = io(SOCKET_URL, {
    withCredentials: true,
    autoConnect: true,
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
  });
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    // Отключаем авто-переподключение, чтобы после разлогина не восстанавливалось
    socket.io?.reconnection(false);
    socket.removeAllListeners(); // очищаем обработчики, чтобы не было утечек
    socket.disconnect();
    socket = null;
  }
};

// Для обратной совместимости, но рекомендуется использовать getSocket / initSocket
export { socket };