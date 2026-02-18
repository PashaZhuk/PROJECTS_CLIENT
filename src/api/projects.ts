import api from './ky';
import type { Project } from '../types';

// Интерфейс для ответа списка проектов (на основе твоего fetch в Dashboard)
interface ProjectsResponse {
  projects: Project[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
}

const projectApi = {
  /**
   * Получение списка проектов
   * Используется в UserDashboard (ProjectsListView)
   * URL: http://192.168.85.110:5001/api/projects/?page=X&search=Y
   */
  getProjects: (page: number, search: string) =>
    api.get('projects', {
      searchParams: {
        page: page.toString(),
        search: search
      }
    }).json<ProjectsResponse>(),

  /**
   * Получение одного проекта по ID
   */
  getProjectById: (id: number) =>
    api.get(`projects/${id}`).json<Project>(),

  /**
   * Создание нового проекта
   * URL: POST http://192.168.85.110:5001/api/projects/
   */
  createProject: (data: any) =>
    api.post('projects', {
      json: data
    }).json<Project>(),

  /**
   * Обновление существующего проекта
   * URL: PUT http://192.168.85.110:5001/api/projects/:id
   */
  updateProject: (id: number, data: any) =>
    api.put(`projects/${id}`, {
      json: data
    }).json<Project>(),

  /**
   * Удаление проекта
   * URL: DELETE http://192.168.85.110:5001/api/projects/:id
   */
  deleteProject: (id: number) =>
    api.delete(`projects/${id}`).json<{ success: boolean; message?: string }>(),

  /**
   * Специальный метод для изменения статуса (если потребуется админу)
   */
  updateStatus: (id: number, status: string) =>
    api.patch(`projects/${id}/status`, {
      json: { status }
    }).json<Project>(),
};

export default projectApi;