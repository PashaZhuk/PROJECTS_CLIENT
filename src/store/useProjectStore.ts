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
  setProjects: (projects: Project[] | ((prev: Project[]) => Project[])) => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  loading: false,
  totalCount: 0,
  totalPages: 1,
  currentPage: 1,
  searchQuery: '',

 setProjects: (next) => {
  set((state) => ({
    projects: typeof next === 'function' ? next(state.projects) : next
  }));
},

  setSearchQuery: (searchQuery) => set({ searchQuery, currentPage: 1 }),

  setCurrentPage: (currentPage) => set({ currentPage }),

  fetchProjects: async (silent = false) => {
    if (!silent) set({ loading: true });
    try {
      const { currentPage, searchQuery } = get();
      
      // Вызываем API. Ky автоматически возвращает распарсенный JSON
      const response = await projectApi.getProjects(currentPage, searchQuery);
      
      // Защита от некорректного ответа API
      const projects = Array.isArray(response?.projects) ? response.projects : [];
      
      set({ 
        projects: projects, 
        totalPages: response?.totalPages ?? 1,
        totalCount: response?.totalCount ?? 0
      });
    } catch (error) {
      console.error('Ошибка стора при загрузке проектов:', error);
      // При ошибке сбрасываем проекты в пустой массив
      set({ projects: [] });
    } finally {
      set({ loading: false });
    }
  },

  updateProjectStatus: async (id, status) => {
    try {
      // Используем метод из нашего нового API клиента
      await projectApi.updateStatus(id, status);
      
      // Оптимистичное обновление: меняем статус в локальном стейте мгновенно
      set((state) => {
        // Критическая проверка: убеждаемся, что projects - это массив
        if (!Array.isArray(state.projects)) {
          console.error('updateProjectStatus: state.projects не является массивом!', state.projects);
          return { projects: [] };
        }
        
        return {
          projects: state.projects.map((p) => 
            p.id === id ? { ...p, status: status as any } : p
          ),
        };
      });
    } catch (error: any) {
      console.error('Ошибка при обновлении статуса:', error);
      throw error;
    }
  },
}));