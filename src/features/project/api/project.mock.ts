import type { ProjectDetailsResponse, ProjectResponse } from "../project.types";

/**
 * Mock Projects Data Layer
 * Simulates backend API responses for ProjectResponse objects
 * Used when VITE_USE_MOCK_DATA=true
 */

export const mockProjectsResponse: ProjectResponse[] = [
  {
    _id: "1",
    user_id: "user-123",
    project_name: "Spring Blossom 2026",
    description:
      "A vibrant collection inspired by early spring flowers and pastel colors.",
    created_at: "2026-02-10T14:30:00Z",
  },
  {
    _id: "2",
    user_id: "user-123",
    project_name: "Summer Collection 2026",
    description:
      "Lightweight fabrics and bold patterns for the upcoming summer season.",
    created_at: "2026-03-15T09:45:00Z",
  },
  {
    _id: "3",
    user_id: "user-123",
    project_name: "Urban Streetwear Vol. 4",
    description:
      "Edgy, modern streetwear designs focusing on utility and comfort.",
    created_at: "2026-04-02T16:20:00Z",
  },
  {
    _id: "4",
    user_id: "user-123",
    project_name: "Autumn Essentials",
    description: "Warm earth tones and cozy layering pieces for fall.",
    created_at: "2026-05-20T11:00:00Z",
  },
];

/**
 * Mock service for projects API
 * Simulates backend API calls with realistic response data
 */
export const projectMockService = {
  /**
   * Fetch user's projects with optional pagination
   * @param userId - User ID to fetch projects for
   * @param page - Page number (1-indexed)
   * @param limit - Items per page
   * @returns Promise of ProjectResponse array
   */
  getUserProjects: async (
    _userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ProjectResponse[]> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // In a real mock service, you'd implement pagination logic here
    // For now, return a slice of mock data based on pagination params
    const startIndex = (page - 1) * limit;
    return mockProjectsResponse.slice(startIndex, startIndex + limit);
  },

  /**
   * Fetch a single project by ID
   * @param projectId - Project ID to fetch
   * @returns Promise of ProjectResponse
   */
  getProjectById: async (
    projectId: string
  ): Promise<ProjectDetailsResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const project = mockProjectsResponse.find((p) => p._id === projectId);
    if (!project) {
      throw new Error(`Project with ID ${projectId} not found`);
    }
    return {
      ...project,
      total_requests: 0,
      requests: [],
    };
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
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newProject: ProjectResponse = {
      _id: `${Date.now()}`,
      user_id: userId,
      project_name: projectData.project_name,
      description: projectData.description,
      created_at: new Date().toISOString(),
    };

    return newProject;
  },

  /**
   * Delete a project
   * @param projectId - Project ID to delete
   * @returns Promise of success status
   */
  deleteProject: async (projectId: string): Promise<{ success: boolean }> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    console.log(`Mock delete project with ID: ${projectId}`);
    return { success: true };
  },
};
