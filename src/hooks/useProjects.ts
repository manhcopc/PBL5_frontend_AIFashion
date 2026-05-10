import { useState, useEffect, useCallback } from "react";
import projectApi from "@/features/project/api";
import { transformProjectsResponseToUI } from "@/features/project/mappers/projectMapper";
import type { Project } from "@/types";

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
export function useProjects(userId: string, autoFetch: boolean = true) {
  // State Management
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<UseProjectsError | null>(null);

  /**
   * Fetch and transform projects
   * Converts raw API responses to UI-ready format
   */
  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch raw API response
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
    projects,
    isLoading,
    error,
    fetchProjects,
    createProject,
    deleteProject,
    clearError,
    refresh,
  };
}

export default useProjects;
