import api from './ky';
import type { Project } from '../types';

interface ProjectsResponse {
  projects: Project[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
}

const projectApi = {
  getProjects: (page: number, search: string) =>
    api.get('projects', {
      searchParams: { page: page.toString(), search }
    }).json<ProjectsResponse>(),

  getProjectById: (id: number) =>
    api.get(`projects/${id}`).json<Project>(),

  createProject: (data: any) =>
    api.post('projects', { json: data }).json<Project>(),

  updateProject: (id: number, data: any) =>
    api.put(`projects/${id}`, { json: data }).json<Project>(),

  deleteProject: (id: number) =>
    api.delete(`projects/${id}`).json<{ success: boolean; message?: string }>(),

  updateStatus: (id: number, status: string) =>
    api.patch(`projects/${id}/status`, { json: { status } }).json<Project>(),
};

export default projectApi;
