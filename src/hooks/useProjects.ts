import { useState, useEffect, useCallback } from "react";
import projectApi from "@/features/project/api";
import {
  transformProjectResponseToUI,
  transformProjectsResponseToUI,
} from "@/features/project/mappers/projectMapper";
import type { Project } from "@/types";
import { useAuthStore } from "@/features/auth/state/use-auth-store";
import type {
  ProjectDetailsResponse,
  ProjectRequestSummary,
} from "@/features/project/project.types";
import {
  isCacheFresh,
  PROJECT_DETAIL_CACHE_TTL_MS,
  PROJECTS_CACHE_TTL_MS,
  useServerCacheStore,
} from "@/store/useServerCacheStore";

/**
 * Error State Interface
 */
interface UseProjectsError {
  message: string;
  code?: string;
}

const projectListRequests = new Map<string, Promise<Project[]>>();
const projectDetailRequests = new Map<
  string,
  Promise<ProjectDetailsResponse | null>
>();

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
  const setProjectsForUser = useServerCacheStore(
    (state) => state.setProjectsForUser
  );
  const setProjectDetailsCache = useServerCacheStore(
    (state) => state.setProjectDetails
  );
  const invalidateProject = useServerCacheStore(
    (state) => state.invalidateProject
  );
  const invalidateAnalysisForProject = useServerCacheStore(
    (state) => state.invalidateAnalysisForProject
  );

  /**
   * Fetch and transform projects
   * Converts raw API responses to UI-ready format
   */
  const fetchProjects = useCallback(async (refreshArg?: unknown) => {
    const forceRefresh =
      refreshArg === true ||
      (refreshArg !== undefined && refreshArg !== false);

    setIsLoading(true);
    setError(null);

    try {
      if (!userId) {
        setProjects([]);
        return [];
      }

      const cachedProjects =
        useServerCacheStore.getState().projectsByUser[userId];

      if (
        !forceRefresh &&
        isCacheFresh(cachedProjects, PROJECTS_CACHE_TTL_MS)
      ) {
        setProjects(cachedProjects.data);
        return cachedProjects.data;
      }

      if (cachedProjects?.data?.length) {
        setProjects(cachedProjects.data);
      }

      const existingRequest = projectListRequests.get(userId);
      if (existingRequest) {
        const cachedOrFetchedProjects = await existingRequest;
        setProjects(cachedOrFetchedProjects);
        return cachedOrFetchedProjects;
      }

      const request = (async () => {
        const rawProjects = await projectApi.getUserProjects(userId);
        const transformedProjects = await transformProjectsResponseToUI(
          rawProjects
        );
        setProjectsForUser(userId, transformedProjects);
        return transformedProjects;
      })();

      projectListRequests.set(userId, request);
      const transformedProjects = await request;
      setProjects(transformedProjects);
      return transformedProjects;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch projects";
      setError({
        message: errorMessage,
        code: err instanceof Error ? "FETCH_ERROR" : "UNKNOWN_ERROR",
      });
      console.error("useProjects fetchProjects error:", err);
      return [];
    } finally {
      setIsLoading(false);
      if (userId) {
        projectListRequests.delete(userId);
      }
    }
  }, [setProjectsForUser, userId]);

  /**
   * Fetch detailed project information by ID
   * @param projectId - Project ID to fetch details for
   * @returns Detailed Project object or null on error
   */
  const fetchProjectDetails = useCallback(async (
    projectId: string,
    forceRefresh: boolean = false
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const cacheState = useServerCacheStore.getState();
      const cachedProject = cacheState.projectDetailsById[projectId];
      const cachedSummary = cacheState.projectRequestSummaryById[projectId];

      if (
        !forceRefresh &&
        isCacheFresh(cachedProject, PROJECT_DETAIL_CACHE_TTL_MS)
      ) {
        setProjectDetails(cachedProject.data);
        setDetailSummary(cachedSummary?.data || []);
        return cachedProject.data;
      }

      if (cachedProject?.data) {
        setProjectDetails(cachedProject.data);
        setDetailSummary(cachedSummary?.data || []);
      }

      const existingRequest = projectDetailRequests.get(projectId);
      if (existingRequest) {
        const fetchedProject = await existingRequest;
        if (fetchedProject) {
          setProjectDetails(fetchedProject);
          setDetailSummary(fetchedProject.requests || []);
        }
        return fetchedProject;
      }

      const request = (async () => {
        const rawProject = await projectApi.getProjectDetail(projectId);
        const summary = rawProject?.requests || [];
        setProjectDetailsCache(projectId, rawProject, summary);
        return rawProject;
      })();

      projectDetailRequests.set(projectId, request);
      const rawProject = await request;
      setProjectDetails(rawProject);
      setDetailSummary(rawProject?.requests || []);
      return rawProject;
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
      projectDetailRequests.delete(projectId);
    }
  }, [setProjectDetailsCache]);

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
        if (!userId) {
          throw new Error("User ID is required to create a project");
        }

        const rawProject = await projectApi.createProject(projectData, userId);
        const transformedProject = await transformProjectResponseToUI(rawProject);

        // Add new project to the beginning of the list
        setProjects((prevProjects) => {
          const nextProjects = [transformedProject, ...prevProjects];
          setProjectsForUser(userId, nextProjects);
          return nextProjects;
        });

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
    [setProjectsForUser, userId]
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
        setProjects((prevProjects) => {
          const nextProjects = prevProjects.filter((p) => p.id !== projectId);
          if (userId) {
            setProjectsForUser(userId, nextProjects);
          }
          return nextProjects;
        });
        invalidateProject(projectId);
        invalidateAnalysisForProject(projectId);

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
    [invalidateAnalysisForProject, invalidateProject, setProjectsForUser, userId]
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
    void fetchProjects(true);
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
