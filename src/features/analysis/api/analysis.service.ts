import apiClient from "../../../services/ApiClient";
import type {
  AnalysisListItemResponse,
  AnalysisRequestDetailResponse,
  AnalysisRequestResponse,
  CreateAnalysisRequest,
  GenerateDesignRequest,
  TriggerStatusResponse,
} from "../analysis.types";

export const AnalysisService = {
  createAnalysis: async (
    data: CreateAnalysisRequest
  ): Promise<AnalysisRequestResponse> => {
    const response = await apiClient.post("/analysis_requests/", data);
    return response.data;
  },

  getListAnalysisByProject: async (
    projectId: string
  ): Promise<AnalysisListItemResponse[]> => {
    const response = await apiClient.get(
      `/analysis_requests/project/${projectId}`
    );
    return response.data;
  },

  getAnalysisReq: async (
    projectId: string
  ): Promise<AnalysisRequestResponse> => {
    const response = await apiClient.get(`/analysis_requests/${projectId}`);
    return response.data;
  },

  deleteAnalysis: async (projectId: string) => {
    const response = await apiClient.delete(`/analysis_requests/${projectId}`);
    return response.data;
  },

  updateStatus: async (reqId: string): Promise<AnalysisRequestResponse> => {
    const response = await apiClient.patch(
      `/analysis_requests/${reqId}/status`
    );
    return response.data;
  },
  getStatus: async (reqId: string): Promise<AnalysisRequestResponse> => {
    const response = await apiClient.get(`/analysis_requests/${reqId}/status`);
    return response.data;
  },
  discoverTrend: async (data: CreateAnalysisRequest) => {
    const response = await apiClient.post(`/analysis_requests/discover`, data);
    return response.data;
  },

  getRequestTrendInsights: async (reqId: string) => {
    const response = await apiClient.get(`/analysis_requests/${reqId}/trend`);
    return response.data;
  },

  triggerGenerate: async (reqId: string, data: GenerateDesignRequest) => {
    const response = await apiClient.post(
      `/analysis_requests/${reqId}/generate`,
      data
    );
    return response.data;
  },

  getTriggerStatus: async (reqId: string): Promise<TriggerStatusResponse[]> => {
    const response = await apiClient.get(`/generated_designs/request/${reqId}`);
    return response.data;
  },

  getAnalysisResults: async (reqId: string) => {
    const response = await apiClient.get(`/analysis_requests/${reqId}/results`);
    return response.data;
  },

  handleAICallback: async (data: unknown) => {
    const response = await apiClient.post(
      `/analysis_requests/callback/image-results`,
      data
    );
    return response.data;
  },

  getAnalysisRequest: async (
    req_id: string
  ): Promise<AnalysisRequestDetailResponse> => {
    const response = await apiClient.get(`/analysis_requests/${req_id}`);
    return response.data;
  },
};
