// import type { User } from '../user.types';
import apiClient from "../../../services/ApiClient";
import type { ProjectRequest, ProjectResponse } from "../project.types";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const ProjectService = {
  create: async (
    userId: string,
    data: ProjectRequest
  ): Promise<ProjectResponse> => {
    const response = await apiClient.post(`/projects/?user_id=${userId}`, data);
    return response.data;
  },

  listByUser: async (userId: string): Promise<ProjectResponse[]> => {
    const response = await apiClient.get(`/projects/user/${userId}`);
    return response.data;
  },

  getDetail: async (id: string): Promise<ProjectResponse> => {
    const response = await apiClient.get(`/projects/${id}`);
    return response.data;
  },

  getSummary: async (id: string) => apiClient.get(`/projects/${id}/requests`),
};
