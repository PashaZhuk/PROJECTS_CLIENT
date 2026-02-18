import { useEffect } from 'react';
import { socket } from '../api/socket'; // Путь к твоему экземпляру socket.io
import { useUserStore } from '../store/useUserStore';

export const useUserSockets = () => {
  const { fetchUsers, fetchStats, updateUserStatus } = useUserStore();

  useEffect(() => {
    // 1. Слушаем регистрацию нового пользователя
    // Когда кто-то зарегистрировался, нам нужно обновить список и общую статистику
    socket.on('user:registered', () => {
      fetchUsers();      // Перезагружаем список (чтобы учесть пагинацию)
      fetchStats(true);  // Обновляем счетчик totalUsers втихую
    });

    // 2. Слушаем вход пользователя в систему (Online)
    socket.on('user:online', (userId: number) => {
      updateUserStatus(userId, true); // Меняем статус в массиве локально
      fetchStats(true);               // Обновляем onlineCount в Overview
    });

    // 3. Слушаем выход пользователя из системы (Offline)
    socket.on('user:offline', (userId: number) => {
      updateUserStatus(userId, false); // Меняем статус в массиве локально
      fetchStats(true);                // Обновляем onlineCount в Overview
    });

    // Очистка при размонтировании
    return () => {
      socket.off('user:registered');
      socket.off('user:online');
      socket.off('user:offline');
    };
  }, [fetchUsers, fetchStats, updateUserStatus]);
};