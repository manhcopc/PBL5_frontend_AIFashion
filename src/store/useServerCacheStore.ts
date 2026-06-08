import { create } from "zustand";
import type { AnalysisRequestDetailResponse } from "@/features/analysis/analysis.types";
import type { AnalysisHistoryItem } from "@/features/analysis/mappers/analysisMapper";
import type {
  ProjectDetailsResponse,
  ProjectRequestSummary,
} from "@/features/project/project.types";
import type { Project } from "@/types";

export const PROJECTS_CACHE_TTL_MS = 5 * 60 * 1000;
export const PROJECT_DETAIL_CACHE_TTL_MS = 2 * 60 * 1000;
export const ANALYSIS_LIST_CACHE_TTL_MS = 2 * 60 * 1000;
export const ANALYSIS_DETAIL_CACHE_TTL_MS = 10 * 60 * 1000;

export interface CacheEntry<T> {
  data: T;
  fetchedAt: number;
}

interface ServerCacheState {
  projectsByUser: Record<string, CacheEntry<Project[]>>;
  projectDetailsById: Record<string, CacheEntry<ProjectDetailsResponse>>;
  projectRequestSummaryById: Record<string, CacheEntry<ProjectRequestSummary[]>>;
  analysisByProject: Record<string, CacheEntry<AnalysisHistoryItem[]>>;
  analysisDetailById: Record<string, CacheEntry<AnalysisRequestDetailResponse>>;
  setProjectsForUser: (userId: string, projects: Project[]) => void;
  setProjectDetails: (
    projectId: string,
    details: ProjectDetailsResponse,
    summary: ProjectRequestSummary[]
  ) => void;
  setAnalysisForProject: (
    projectId: string,
    analysis: AnalysisHistoryItem[]
  ) => void;
  setAnalysisDetail: (
    requestId: string,
    detail: AnalysisRequestDetailResponse
  ) => void;
  invalidateProjectsForUser: (userId: string) => void;
  invalidateProject: (projectId: string) => void;
  invalidateAnalysisForProject: (projectId: string) => void;
  invalidateAnalysisDetail: (requestId: string) => void;
  clearServerCache: () => void;
}

export function isCacheFresh<T>(
  entry: CacheEntry<T> | undefined,
  ttlMs: number
): entry is CacheEntry<T> {
  return Boolean(entry && Date.now() - entry.fetchedAt < ttlMs);
}

export const useServerCacheStore = create<ServerCacheState>()((set) => ({
  projectsByUser: {},
  projectDetailsById: {},
  projectRequestSummaryById: {},
  analysisByProject: {},
  analysisDetailById: {},

  setProjectsForUser: (userId, projects) =>
    set((state) => ({
      projectsByUser: {
        ...state.projectsByUser,
        [userId]: { data: projects, fetchedAt: Date.now() },
      },
    })),

  setProjectDetails: (projectId, details, summary) =>
    set((state) => ({
      projectDetailsById: {
        ...state.projectDetailsById,
        [projectId]: { data: details, fetchedAt: Date.now() },
      },
      projectRequestSummaryById: {
        ...state.projectRequestSummaryById,
        [projectId]: { data: summary, fetchedAt: Date.now() },
      },
    })),

  setAnalysisForProject: (projectId, analysis) =>
    set((state) => ({
      analysisByProject: {
        ...state.analysisByProject,
        [projectId]: { data: analysis, fetchedAt: Date.now() },
      },
    })),

  setAnalysisDetail: (requestId, detail) =>
    set((state) => ({
      analysisDetailById: {
        ...state.analysisDetailById,
        [requestId]: { data: detail, fetchedAt: Date.now() },
      },
    })),

  invalidateProjectsForUser: (userId) =>
    set((state) => {
      const { [userId]: _removed, ...projectsByUser } = state.projectsByUser;
      void _removed;
      return { projectsByUser };
    }),

  invalidateProject: (projectId) =>
    set((state) => {
      const { [projectId]: _details, ...projectDetailsById } =
        state.projectDetailsById;
      const { [projectId]: _summary, ...projectRequestSummaryById } =
        state.projectRequestSummaryById;
      void _details;
      void _summary;
      return { projectDetailsById, projectRequestSummaryById };
    }),

  invalidateAnalysisForProject: (projectId) =>
    set((state) => {
      const { [projectId]: _removed, ...analysisByProject } =
        state.analysisByProject;
      void _removed;
      return { analysisByProject };
    }),

  invalidateAnalysisDetail: (requestId) =>
    set((state) => {
      const { [requestId]: _removed, ...analysisDetailById } =
        state.analysisDetailById;
      void _removed;
      return { analysisDetailById };
    }),

  clearServerCache: () =>
    set({
      projectsByUser: {},
      projectDetailsById: {},
      projectRequestSummaryById: {},
      analysisByProject: {},
      analysisDetailById: {},
    }),
}));
