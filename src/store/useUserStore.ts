import { create } from 'zustand';
import userApi from '../api/user';

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  lastSeen: string;
  companyName?: string;
  unp?: string;
  isOnline?: boolean;
  isBlocked?: boolean; // ← добавили
}

interface AdminStats {
  totalUsers: number;
  totalManagers: number;
  onlineCount: number;
  details: {
    onlineUsers: number;
    onlineManagers: number;
  };
}

interface UserStore {
  users: UserData[];
  loading: boolean;
  stats: AdminStats | null;
  searchQuery: string;
  currentPage: number;
  totalPages: number;
  totalCount: number;

  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
  fetchUsers: () => Promise<void>;
  fetchStats: (silent?: boolean) => Promise<void>;
  createUser: (formData: any) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  toggleBlock: (id: number) => Promise<void>; // ← добавили
  updateUserStatus: (userId: number, isOnline: boolean) => void;
  updateUserBlockedStatus: (userId: number, isBlocked: boolean) => void; // ← добавили
}

export const useUserStore = create<UserStore>((set, get) => ({
  users: [],
  loading: false,
  stats: null,
  searchQuery: '',
  currentPage: 1,
  totalPages: 1,
  totalCount: 0,

  setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),
  setCurrentPage: (page) => set({ currentPage: page }),

  fetchUsers: async () => {
    if (get().loading) return;
    set({ loading: true });
    try {
      const { searchQuery, currentPage } = get();
      const data: any = await userApi.getAllUsers({
        page: currentPage,
        limit: 10,
        search: searchQuery
      });
      set({
        users: data.users || [],
        totalPages: data.totalPages || 1,
        totalCount: data.totalCount || 0,
        loading: false
      });
    } catch (error) {
      set({ loading: false });
      console.error('Fetch users error:', error);
    }
  },

  fetchStats: async (silent = false) => {
    if (!silent) set({ loading: true });
    try {
      const data: any = await userApi.getAdminStats();
      set({ stats: data, loading: false });
    } catch (error) {
      set({ loading: false });
      console.error('Fetch stats error:', error);
    }
  },

  createUser: async (formData) => {
    set({ loading: true });
    try {
      await userApi.register(formData);
      await Promise.all([get().fetchUsers(), get().fetchStats(true)]);
    } catch (error: any) {
      if (error.response) {
        const errorData = await error.response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Ошибка регистрации');
      }
      throw new Error(error.message || 'Ошибка сети');
    } finally {
      set({ loading: false });
    }
  },

  deleteUser: async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этого пользователя?')) return;
    try {
      await userApi.deleteUser(id);
      set((state) => ({
        users: state.users.filter(u => u.id !== id),
        totalCount: Math.max(0, state.totalCount - 1),
      }));
      get().fetchStats(true);
    } catch (error) {
      console.error('Delete error:', error);
      alert('Ошибка при удалении');
    }
  },

  toggleBlock: async (id) => {
    try {
      const result = await userApi.toggleBlock(id);
      // Оптимистичное обновление в списке
      set((state) => ({
        users: state.users.map(u =>
          u.id === id ? { ...u, isBlocked: result.isBlocked } : u
        )
      }));
    } catch (error) {
      console.error('Toggle block error:', error);
      alert('Ошибка при изменении статуса блокировки');
    }
  },

  updateUserStatus: (userId, isOnline) => {
    set((state) => ({
      users: state.users.map(u => u.id === userId ? { ...u, isOnline } : u)
    }));
  },

  updateUserBlockedStatus: (userId, isBlocked) => {
    set((state) => ({
      users: state.users.map(u => u.id === userId ? { ...u, isBlocked } : u)
    }));
  },
}));