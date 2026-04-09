import { useEffect } from 'react';
import { socket } from '../api/socket';
import { useUserStore } from '../store/useUserStore';

export const useUserSockets = () => {
  const { fetchUsers, fetchStats, updateUserStatus } = useUserStore();

  useEffect(() => {
    socket.on('user:registered', () => {
      fetchUsers();
      fetchStats(true);
    });

    socket.on('user:online', (userId: number) => {
      updateUserStatus(userId, true);
      fetchStats(true);
    });

    socket.on('user:offline', (userId: number) => {
      updateUserStatus(userId, false);
      fetchStats(true);
    });

    return () => {
      socket.off('user:registered');
      socket.off('user:online');
      socket.off('user:offline');
    };
  }, [fetchUsers, fetchStats, updateUserStatus]);
};
