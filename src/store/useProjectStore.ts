import { create } from 'zustand';
import projectApi from '../api/projects'; // Наш новый API на ky
import type { Project } from '../types';

interface ProjectState {
  projects: Project[];
  loading: boolean;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  searchQuery: string;
  fetchProjects: (silent?: boolean) => Promise<void>;
  updateProjectStatus: (id: number, status: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
  setProjects: (projects: Project[]) => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  loading: false,
  totalCount: 0,
  totalPages: 1,
  currentPage: 1,
  searchQuery: '',

  setProjects: (projects) => set({ projects }),
  setSearchQuery: (searchQuery) => set({ searchQuery, currentPage: 1 }),
  setCurrentPage: (currentPage) => set({ currentPage }),

  fetchProjects: async (silent = false) => {
    if (!silent) set({ loading: true });
    try {
      const { currentPage, searchQuery } = get();
      
      // Вызываем API. Ky автоматически возвращает распарсенный JSON
      const response = await projectApi.getProjects(currentPage, searchQuery);
      
      // На скриншоте видно структуру: { projects: [...], totalCount: 57, totalPages: 6 }
      set({ 
        projects: response.projects || [], 
        totalPages: response.totalPages || 1,
        totalCount: response.totalCount || 0 // Теперь берем реальное число из базы
      });
    } catch (error) {
      console.error('Ошибка стора при загрузке проектов:', error);
    } finally {
      set({ loading: false });
    }
  },

  updateProjectStatus: async (id, status) => {
    try {
      // Используем метод из нашего нового API клиента
      await projectApi.updateStatus(id, status);
      
      // Оптимистичное обновление: меняем статус в локальном стейте мгновенно
      set((state) => ({
        projects: state.projects.map((p) => 
          p.id === id ? { ...p, status: status as any } : p
        ),
      }));
    } catch (error: any) {
      console.error('Ошибка при обновлении статуса:', error);
      throw error;
    }
  },
}));