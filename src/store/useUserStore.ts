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
  lockUntil?: string | null;
  failedLoginAttempts?: number;
  twoFactorLockUntil?: string | null;
  twoFactorAttempts?: number;
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
  setStats: (stats: AdminStats) => void;
  fetchUsers: () => Promise<void>;
  fetchStats: (silent?: boolean) => Promise<void>;
  createUser: (formData: any) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  toggleBlock: (id: number) => Promise<void>;
  updateUserStatus: (userId: number, isOnline: boolean) => void;
  updateUserBlockedStatus: (userId: number, isBlocked: boolean) => void;
  updateUserLockStatus: (userId: number, updates: {
    lockUntil?: string | null;
    failedLoginAttempts?: number;
    twoFactorLockUntil?: string | null;
    twoFactorAttempts?: number;
  }) => void;
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

  setStats: (stats) => set({ stats }),

  fetchUsers: async () => {
    set({ loading: true });
    try {
      const response = await userApi.getAllUsers({
        page: get().currentPage,
        search: get().searchQuery,
      }) as { data: { users: UserData[]; totalPages: number; totalCount: number } };

      set({
        users: response.data.users,
        totalPages: response.data.totalPages,
        totalCount: response.data.totalCount,
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
      const response = await userApi.getAdminStats() as { data: AdminStats };
      set({ stats: response.data });
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
    try {
      await userApi.deleteUser(id);
      set((state) => ({
        users: state.users.filter(u => u.id !== id),
        totalCount: Math.max(0, state.totalCount - 1),
      }));
      get().fetchStats(true);
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  },

  toggleBlock: async (id) => {
    try {
      await userApi.toggleBlock(id);
      await get().fetchUsers(); // Полный перезапрос для актуализации всех статусов
    } catch (error) {
      console.error('Toggle block error:', error);
      throw error;
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

  updateUserLockStatus: (userId, updates) => {
    set((state) => ({
      users: state.users.map((u) => 
        u.id === userId ? { ...u, ...updates } : u
      ),
    }));
  },
}));