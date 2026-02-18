import { create } from 'zustand';
import userApi from '../api/user'; // Наш API на базе ky

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
  
  updateUserStatus: (userId: number, isOnline: boolean) => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  users: [],
  loading: false,
  stats: null,
  searchQuery: '',
  currentPage: 1,
  totalPages: 1,
  totalCount: 0,

  setSearchQuery: (query) => {
    set({ searchQuery: query, currentPage: 1 });
  },

  setCurrentPage: (page) => {
    set({ currentPage: page });
  },

  fetchUsers: async () => {
    if (get().loading) return;
    set({ loading: true });
    try {
      const { searchQuery, currentPage } = get();
      
      // В ky.js мы настроили получение JSON, поэтому data — это уже тело ответа
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
      // Отправляем данные. ky сам сделает JSON.stringify
      await userApi.register(formData);
      
      // Обновляем данные после успеха
      await Promise.all([
        get().fetchUsers(),
        get().fetchStats(true)
      ]);
    } catch (error: any) {
    if (error.response) {
      // Извлекаем JSON из ответа
      const errorData = await error.response.json().catch(() => ({}));
      
      // КРИТИЧНО: берем сообщение из поля errorData.error, так как бэкенд шлет его туда
      const errorMessage = errorData.error || errorData.message || 'Ошибка регистрации';
      
      throw new Error(errorMessage);
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
      
      // Оптимистичное обновление
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

  updateUserStatus: (userId, isOnline) => {
    set((state) => ({
      users: state.users.map((u) => 
        u.id === userId ? { ...u, isOnline } : u
      )
    }));
  }
}));