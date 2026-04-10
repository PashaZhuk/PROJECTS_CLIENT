import { io } from 'socket.io-client';

export const SOCKET_URL = 'http://192.168.0.105:5001';

// Единственный глобальный сокет-синглтон для всего приложения.
// НЕ создавать новые io() экземпляры в других хуках — только этот.
export const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: true,
  transports: ['websocket', 'polling'],
});
