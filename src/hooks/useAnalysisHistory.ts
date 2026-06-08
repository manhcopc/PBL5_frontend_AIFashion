import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import analysisApi from "@/features/analysis/api";
import {
  getAnalysisDetailImages,
  transformAnalysisHistoryList,
  type AnalysisHistoryItem,
} from "@/features/analysis/mappers/analysisMapper";

interface UseAnalysisHistoryError {
  message: string;
  code?: string;
}

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

  const loadProjectAnalysis = useCallback(async (projectId: string) => {
    setSelectedProjectId(projectId);
    setIsLoadingList(true);
    setError(null);

    try {
      const response = await analysisApi.getProjectAnalysisRequests(projectId);
      setAnalysisRequests(transformAnalysisHistoryList(response));
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to fetch analysis history.";
      setAnalysisRequests([]);
      setError({ message, code: "FETCH_ANALYSIS_HISTORY_ERROR" });
    } finally {
      setIsLoadingList(false);
    }
  }, []);

  const openAnalysisRequest = useCallback(
    async (requestId: string) => {
      setActiveRequestId(requestId);
      setIsLoadingDetail(true);
      setError(null);

      try {
        const detail = await analysisApi.getAnalysisRequestDetail(requestId);
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
      }
    },
    [navigate]
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
