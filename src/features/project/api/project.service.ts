// import type { User } from '../user.types';
import apiClient from "../../../services/ApiClient";
import type {
  ProjectDetailsResponse,
  ProjectRequest,
  ProjectResponse,
} from "../project.types";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const ProjectService = {
  createProject: async (
    userId: string,
    data: ProjectRequest
  ): Promise<ProjectResponse> => {
    const response = await apiClient.post(`/projects/?user_id=${userId}`, data);
    return response.data;
  },

  listProjectByUser: async (userId: string): Promise<ProjectResponse[]> => {
    const response = await apiClient.get(`/projects/user/${userId}`);
    return response.data;
  },

  getProjectDetail: async (id: string): Promise<ProjectDetailsResponse> => {
    console.log(`[Service] Fetching project details for projectId: ${id}`); // Debug log
    const response = await apiClient.get(`/projects/${id}/requests`);
    console.log("[Service] API Response for getProjectDetail:", response); // Debug log
    return response.data;
  },

  getProjectSummary: async (id: string) =>
    apiClient.get(`/projects/${id}/requests`),

  deleteProject: async (id: string) => apiClient.delete(`/projects/${id}`),

  updateProject: async (id: string, data: ProjectRequest) =>
    apiClient.put(`/projects/${id}`, data),
};
