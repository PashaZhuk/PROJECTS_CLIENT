import { io } from 'socket.io-client';

// Используем тот же IP, что и в API клиенте
const URL = 'http://192.168.85.110:5001'; 

export const socket = io(URL, {
  withCredentials: true,
  autoConnect: true,
});