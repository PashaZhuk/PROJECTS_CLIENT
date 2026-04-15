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
  isBlocked?: boolean;
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
  
  // Actions
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
  setStats: (stats: AdminStats) => void;
  fetchUsers: () => Promise<void>;
  fetchStats: (silent?: boolean) => Promise<void>;
  createUser: (formData: any) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  toggleBlock: (id: number) => Promise<void>;
  updateUserStatus: (userId: number, isOnline: boolean) => void;
  updateUserBlockedStatus: (userId: number, isBlocked: boolean) => void;
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
  
  setCurrentPage: (page) => {
    set({ currentPage: page });
    get().fetchUsers();
  },

  setStats: (stats: AdminStats) => set({ stats }),

  fetchUsers: async () => {
    set({ loading: true });
    try {
      // Здесь мы указываем TS, что ожидаем объект с определенными полями
      const response = await userApi.getAllUsers({
        page: get().currentPage,
        search: get().searchQuery,
      }) as { users: UserData[]; totalPages: number; totalCount: number };
      
      set({
        users: response.users,
        totalPages: response.totalPages,
        totalCount: response.totalCount,
      });
    } catch (error) {
      console.error('Fetch users error:', error);
    } finally {
      set({ loading: false });
    }
  },

  fetchStats: async (silent = false) => {
    if (!silent) set({ loading: true });
    try {
      // КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ: приведение к AdminStats
      const stats = await userApi.getAdminStats() as AdminStats;
      set({ stats });
    } catch (error) {
      console.error('Fetch stats error:', error);
    } finally {
      if (!silent) set({ loading: false });
    }
  },

  createUser: async (formData) => {
    set({ loading: true });
    try {
      await userApi.register(formData);
      await get().fetchUsers();
      await get().fetchStats(true);
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
      const result = await userApi.toggleBlock(id) as { isBlocked: boolean };
      get().updateUserBlockedStatus(id, result.isBlocked);
      get().fetchStats(true);
    } catch (error) {
      console.error('Toggle block error:', error);
      alert('Ошибка при изменении статуса блокировки');
    }
  },

  updateUserStatus: (userId, isOnline) => {
    set((state) => ({
      users: state.users.map((u) => 
        u.id === userId ? { ...u, isOnline } : u
      ),
    }));
  },

  updateUserBlockedStatus: (userId, isBlocked) => {
    set((state) => ({
      users: state.users.map((u) => 
        u.id === userId ? { ...u, isBlocked } : u
      ),
    }));
  },
}));