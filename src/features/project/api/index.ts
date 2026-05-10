import { ProjectService } from "./project.service";
import { projectMockService } from "./project.mock";
import type { ProjectResponse } from "../project.types";

/**
 * Environment-based API Service Switcher
 * Automatically selects between mock and real API based on VITE_USE_MOCK_DATA
 *
 * When VITE_USE_MOCK_DATA=true: Uses mock data for development/testing
 * When VITE_USE_MOCK_DATA=false: Uses real API calls to backend
 */

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === "true";

/**
 * Unified Projects API Interface
 * Provides a consistent interface regardless of mock/real service
 */
export const projectApi = {
  /**
   * Fetch user's projects
   * @param userId - User ID to fetch projects for
   * @param page - Page number (1-indexed)
   * @param limit - Items per page
   * @returns Promise of ProjectResponse array
   */
  getUserProjects: async (userId: string): Promise<ProjectResponse[]> => {
    return USE_MOCK_DATA
      ? projectMockService.getUserProjects(userId, 10, 10)
      : ProjectService.listProjectByUser(userId);
  },

  /**
   * Fetch a single project by ID
   * @param projectId - Project ID to fetch
   * @returns Promise of ProjectResponse
   */
  getProjectById: async (projectId: string): Promise<ProjectResponse> => {
    return USE_MOCK_DATA
      ? projectMockService.getProjectById(projectId)
      : ProjectService.getProjectDetail(projectId);
  },

  /**
   * Create a new project
   * @param projectData - Project creation data
   * @param userId - User ID creating the project
   * @returns Promise of newly created ProjectResponse
   */
  createProject: async (
    projectData: { project_name: string; description: string },
    userId: string
  ): Promise<ProjectResponse> => {
    return USE_MOCK_DATA
      ? projectMockService.createProject(projectData, userId)
      : ProjectService.createProject(userId, projectData);
  },

  /**
   * Delete a project
   * @param projectId - Project ID to delete
   * @returns Promise of success status
   */
  deleteProject: async (projectId: string): Promise<{ success: boolean }> => {
    return USE_MOCK_DATA
      ? projectMockService.deleteProject(projectId)
      : ProjectService.deleteProject(projectId).then(() => ({ success: true }));
  },
};

export default projectApi;
