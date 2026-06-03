import { useState, useEffect, useCallback } from "react";
import projectApi from "@/features/project/api";
import { transformProjectsResponseToUI } from "@/features/project/mappers/projectMapper";
import type { Project } from "@/types";
import { useAuthStore } from "@/features/auth/state/use-auth-store";
import { ProjectService } from "@/features/project/api/project.service";
import type {
  ProjectDetailsResponse,
  ProjectRequestSummary,
} from "@/features/project/project.types";

/**
 * Error State Interface
 */
interface UseProjectsError {
  message: string;
  code?: string;
}

/**
 * Custom Hook: useProjects
 *
 * Manages project data fetching, transformation, and state management
 *
 * Responsibilities:
 * 1. Fetch projects from projectApi (mock or real based on environment)
 * 2. Transform API responses to UI format using projectMapper
 * 3. Handle loading and error states
 * 4. Provide methods for CRUD operations
 *
 * @param userId - User ID to fetch projects for
 * @param autoFetch - Whether to automatically fetch projects on mount (default: true)
 * @returns Object with projects, loading state, error state, and action methods
 */
export function useProjects(autoFetch: boolean = true) {
  // State Management
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectDetails, setProjectDetails] =
    useState<ProjectDetailsResponse | null>(null);
  const [detailSummary, setDetailSummary] = useState<ProjectRequestSummary[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<UseProjectsError | null>(null);
  const userId = useAuthStore((state) => state.userId);

  /**
   * Fetch and transform projects
   * Converts raw API responses to UI-ready format
   */
  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch raw API response
      console.log(`Fetching projects for userId from useProjects: ${userId}`);
      const rawProjects = await projectApi.getUserProjects(userId);
      console.log("Raw projects fetched:", rawProjects);
      // Transform to UI format
      const transformedProjects = await transformProjectsResponseToUI(
        rawProjects
      );

      setProjects(transformedProjects);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch projects";
      setError({
        message: errorMessage,
        code: err instanceof Error ? "FETCH_ERROR" : "UNKNOWN_ERROR",
      });
      console.error("useProjects fetchProjects error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  /**
   * Fetch detailed project information by ID
   * @param projectId - Project ID to fetch details for
   * @returns Detailed Project object or null on error
   */
  const fetchProjectDetails = useCallback(async (projectId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log(`Fetching project details for projectId: ${projectId}`);
      const rawProject = await ProjectService.getProjectDetail(projectId);
      // Debug log: Nên in rawProject ra thay vì in projectDetails
      console.log(
        `Raw project details for projectId ${projectId}:`,
        rawProject
      );
      // 1. Cập nhật vào state để lưu trữ lâu dài cho component sử dụng
      setProjectDetails(rawProject);

      // Debug log: Nên in rawProject ra thay vì in projectDetails
      console.log(
        `Raw project details for projectId ${projectId}:`,
        rawProject
      );

      // 2. SỬA TẠI ĐÂY: Sử dụng trực tiếp rawProject để trích xuất requests một cách an toàn
      if (rawProject && rawProject.requests) {
        setDetailSummary(rawProject.requests);
      } else {
        setDetailSummary([]); // Đề phòng trường hợp API trả về không có requests
      }

      // Nếu giao diện (ProjectDetail.tsx) của bạn đang chờ hàm này return về dữ liệu:
      return rawProject;
      // const rawProject = await ProjectService.getProjectDetail(projectId);
      // setProjectDetails(rawProject);
      // console.log(
      //   `Raw project details for projectId ${projectId}:`,
      //   projectDetails
      // );
      // setDetailSummary(projectDetails.requests);
      // const transformedProject = await import(
      //   "@/features/project/mappers/projectMapper"
      // ).then((m) => m.transformProjectResponseToUI(rawProject));
      // return transformedProject;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch project details";
      setError({
        message: errorMessage,
        code: err instanceof Error ? "FETCH_DETAIL_ERROR" : "UNKNOWN_ERROR",
      });
      console.error("useProjects fetchProjectDetails error:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Create a new project
   * @param projectData - Project creation data
   * @returns Newly created Project object or null on error
   */
  const createProject = useCallback(
    async (projectData: {
      project_name: string;
      description: string;
    }): Promise<Project | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const rawProject = await projectApi.createProject(projectData, userId);
        const transformedProject = await (
          await Promise.all(
            [rawProject].map((p) =>
              import("@/features/project/mappers/projectMapper").then((m) =>
                m.transformProjectResponseToUI(p)
              )
            )
          )
        )[0];

        // Add new project to the beginning of the list
        setProjects((prevProjects) => [transformedProject, ...prevProjects]);

        return transformedProject;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create project";
        setError({
          message: errorMessage,
          code: err instanceof Error ? "CREATE_ERROR" : "UNKNOWN_ERROR",
        });
        console.error("useProjects createProject error:", err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [userId]
  );

  /**
   * Delete a project by ID
   * @param projectId - Project ID to delete
   * @returns boolean indicating success
   */
  const deleteProject = useCallback(
    async (projectId: string): Promise<boolean> => {
      setError(null);

      try {
        await projectApi.deleteProject(projectId);

        // Remove project from state
        setProjects((prevProjects) =>
          prevProjects.filter((p) => p.id !== projectId)
        );

        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete project";
        setError({
          message: errorMessage,
          code: err instanceof Error ? "DELETE_ERROR" : "UNKNOWN_ERROR",
        });
        console.error("useProjects deleteProject error:", err);
        return false;
      }
    },
    []
  );

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Refresh projects manually
   */
  const refresh = useCallback(() => {
    void fetchProjects();
  }, [fetchProjects]);

  // Auto-fetch projects on mount if userId is provided
  useEffect(() => {
    if (userId && autoFetch) {
      (async () => {
        await fetchProjects();
      })();
    }
  }, [userId, autoFetch, fetchProjects]);

  return {
    projectDetails,
    detailSummary,
    projects,
    isLoading,
    error,
    fetchProjectDetails,
    fetchProjects,
    createProject,
    deleteProject,
    clearError,
    refresh,
  };
}

export default useProjects;
