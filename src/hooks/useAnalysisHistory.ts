import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AnalysisRequestDetailResponse } from "@/features/analysis/analysis.types";
import analysisApi from "@/features/analysis/api";
import {
  getAnalysisDetailImages,
  transformAnalysisHistoryList,
  type AnalysisHistoryItem,
} from "@/features/analysis/mappers/analysisMapper";
import {
  ANALYSIS_DETAIL_CACHE_TTL_MS,
  ANALYSIS_LIST_CACHE_TTL_MS,
  isCacheFresh,
  useServerCacheStore,
} from "@/store/useServerCacheStore";

interface UseAnalysisHistoryError {
  message: string;
  code?: string;
}

const analysisListRequests = new Map<string, Promise<AnalysisHistoryItem[]>>();
const analysisDetailRequests = new Map<
  string,
  Promise<AnalysisRequestDetailResponse>
>();

export function useAnalysisHistory() {
  const navigate = useNavigate();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [analysisRequests, setAnalysisRequests] = useState<
    AnalysisHistoryItem[]
  >([]);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);
  const [error, setError] = useState<UseAnalysisHistoryError | null>(null);
  const setAnalysisForProject = useServerCacheStore(
    (state) => state.setAnalysisForProject
  );
  const setAnalysisDetail = useServerCacheStore(
    (state) => state.setAnalysisDetail
  );

  const loadProjectAnalysis = useCallback(async (
    projectId: string,
    forceRefresh: boolean = false
  ) => {
    setSelectedProjectId(projectId);
    setIsLoadingList(true);
    setError(null);

    try {
      const cachedAnalysis =
        useServerCacheStore.getState().analysisByProject[projectId];

      if (
        !forceRefresh &&
        isCacheFresh(cachedAnalysis, ANALYSIS_LIST_CACHE_TTL_MS)
      ) {
        setAnalysisRequests(cachedAnalysis.data);
        return cachedAnalysis.data;
      }

      if (cachedAnalysis?.data?.length) {
        setAnalysisRequests(cachedAnalysis.data);
      }

      const existingRequest = analysisListRequests.get(projectId);
      if (existingRequest) {
        const cachedOrFetchedAnalysis = await existingRequest;
        setAnalysisRequests(cachedOrFetchedAnalysis);
        return cachedOrFetchedAnalysis;
      }

      const request = (async () => {
        const response = await analysisApi.getProjectAnalysisRequests(projectId);
        const transformedAnalysis = transformAnalysisHistoryList(response);
        setAnalysisForProject(projectId, transformedAnalysis);
        return transformedAnalysis;
      })();

      analysisListRequests.set(projectId, request);
      const transformedAnalysis = await request;
      setAnalysisRequests(transformedAnalysis);
      return transformedAnalysis;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to fetch analysis history.";
      setAnalysisRequests([]);
      setError({ message, code: "FETCH_ANALYSIS_HISTORY_ERROR" });
      return [];
    } finally {
      setIsLoadingList(false);
      analysisListRequests.delete(projectId);
    }
  }, [setAnalysisForProject]);

  const openAnalysisRequest = useCallback(
    async (requestId: string, forceRefresh: boolean = false) => {
      setActiveRequestId(requestId);
      setIsLoadingDetail(true);
      setError(null);

      try {
        const cachedDetail =
          useServerCacheStore.getState().analysisDetailById[requestId];

        const detailTtl =
          cachedDetail?.data?.status === "COMPLETED"
            ? ANALYSIS_DETAIL_CACHE_TTL_MS
            : 15 * 1000;

        const detail =
          !forceRefresh && isCacheFresh(cachedDetail, detailTtl)
            ? cachedDetail.data
            : await (async () => {
                const existingRequest = analysisDetailRequests.get(requestId);
                if (existingRequest) return existingRequest;

                const request =
                  analysisApi.getAnalysisRequestDetail(requestId);
                analysisDetailRequests.set(requestId, request);
                return request;
              })();

        if (!isCacheFresh(cachedDetail, detailTtl) || forceRefresh) {
          setAnalysisDetail(requestId, detail);
        }

        const generatedImages = getAnalysisDetailImages(detail);

        navigate("/create-design", {
          state: {
            requestId: detail._id || requestId,
            projectId: detail.project_id,
            generatedImages,
            promptText: detail.category_name,
          },
        });
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to fetch analysis request.";
        setError({ message, code: "FETCH_ANALYSIS_DETAIL_ERROR" });
      } finally {
        setIsLoadingDetail(false);
        setActiveRequestId(null);
        analysisDetailRequests.delete(requestId);
      }
    },
    [navigate, setAnalysisDetail]
  );

  const clearError = useCallback(() => setError(null), []);

  return {
    selectedProjectId,
    analysisRequests,
    isLoadingList,
    isLoadingDetail,
    activeRequestId,
    error,
    loadProjectAnalysis,
    openAnalysisRequest,
    clearError,
  };
}

export default useAnalysisHistory;
