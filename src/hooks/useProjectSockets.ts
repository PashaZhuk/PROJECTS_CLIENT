import { useEffect } from 'react';
import { socket } from '../api/socket';
import { useProjectStore } from '../store/useProjectStore';

export const useProjectSockets = (userId: number | undefined) => {
  const setProjects = useProjectStore((state) => state.setProjects);

  useEffect(() => {
    if (!userId) {
      console.log('[ProjectSockets] ⏭️ Skipping - no userId');
      return;
    }

    console.log('[ProjectSockets] 🚀 Initializing for user:', userId);

    const handleConnect = () => {
      console.log('[ProjectSockets] ✅ Socket connected, joining rooms');
      socket.emit('join_self_room', userId);
      socket.emit('subscribe_admin_stats');
    };

    if (socket.connected) handleConnect();
    socket.on('connect', handleConnect);

    const handleStatusChanged = (updatedProject: any) => {
      console.log('[ProjectSockets] 📊 Project status changed:', updatedProject);
      setProjects((prev: any[]) => {
        const existing = prev.find(p => p.id === updatedProject.id);
        const filtered = prev.filter(p => p.id !== updatedProject.id);
        const processed = {
          ...existing,
          ...updatedProject,
          unreadCount: existing?.unreadCount ?? 0,
          hasUnread: existing?.hasUnread ?? false,
        };
        return [processed, ...filtered].sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      });
    };

    socket.on('project_status_changed', handleStatusChanged);

    return () => {
      console.log('[ProjectSockets] 🧹 Cleaning up listeners');
      socket.off('connect', handleConnect);
      socket.off('project_status_changed', handleStatusChanged);
    };
  }, [userId, setProjects]);
};