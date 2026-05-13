import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import projectApi from '../api/projects';
import type { Project, CreateProjectInput } from '../types';

// ---- Queries ----

export const useProjects = (page: number, search: string) => {
  return useQuery({
    queryKey: ['projects', page, search],
    queryFn: async () => {
      const response = await projectApi.getProjects(page, search) as any;
      return response.data as {
        projects: Project[];
        totalPages: number;
        totalCount: number;
        currentPage: number;
      };
    },
    placeholderData: keepPreviousData,
  });
};

// ---- Mutations ----

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProjectInput) => projectApi.createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateProjectInput> }) =>
      projectApi.updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => projectApi.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useUpdateProjectStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      projectApi.updateStatus(id, status),
    // Оптимистичное обновление
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['projects'] });
      queryClient.setQueriesData({ queryKey: ['projects'] }, (old: any) => {
        if (!old?.projects) return old;
        return {
          ...old,
          projects: old.projects.map((p: Project) =>
            p.id === id ? { ...p, status: status as any } : p
          ),
        };
      });
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};
