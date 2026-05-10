import apiClient from "../../../services/ApiClient";
import type {
  AnalysisRequestResponse,
  CreateAnalysisRequest,
} from "../analysis.types";

// Dịch vụ phân tích
export const AnalysisService = {
  // Tạo yêu cầu phân tích mới
  createAnalysis: async (
    data: CreateAnalysisRequest
  ): Promise<AnalysisRequestResponse> => {
    const response = await apiClient.post("/analysis_requests/", data);
    return response.data;
  },

  // Lấy danh sách yêu cầu phân tích theo dự án
  getListAnalysisByProject: async (
    projectId: string
  ): Promise<AnalysisRequestResponse[]> => {
    const response = await apiClient.get(
      `/analysis_requests/project/${projectId}`
    );
    return response.data;
  },

  // Lấy chi tiết yêu cầu phân tích theo ID
  getAnalysisReq: async (
    projectId: string
  ): Promise<AnalysisRequestResponse> => {
    const response = await apiClient.get(`/analysis_requests/${projectId}`);
    return response.data;
  },

  // Xóa yêu cầu phân tích theo ID
  deleteAnalysis: async (projectId: string) => {
    const response = await apiClient.delete(`/analysis_requests/${projectId}`);
    return response.data;
  },

  // Cập nhật trạng thái yêu cầu phân tích
  updateStatus: async (reqId: string): Promise<AnalysisRequestResponse> => {
    const response = await apiClient.patch(
      `/analysis_requests/${reqId}/status`
    );
    return response.data;
  },
  getStatus: async (reqId: string): Promise<AnalysisRequestResponse> => {
    // Du lieu api chua hoan chinh
    const response = await apiClient.get(`/analysis_requests/${reqId}/status`);
    return response.data;
  },
  discoverTrend: async (data: CreateAnalysisRequest) => {
    const response = await apiClient.post(`/analysis_requests/discover`, data);
    return response.data;
  },

  getRequestTrendInsights: async (reqId: string) => {
    // Du lieu api chua hoan chinh
    const response = await apiClient.get(`/analysis_requests/${reqId}/trend`);
    return response.data;
  },

  triggerGenerate: async (reqId: string, data) => {
    // Du lieu api chua hoan chinh
    const response = await apiClient.post(
      `/analysis_requests/${reqId}/generate`,
      data
    );
    return response.data;
  },

  getAnalysisResults: async (
    // Du lieu api chua hoan chinh
    reqId: string
  ) => {
    const response = await apiClient.get(`/analysis_requests/${reqId}/results`);
    return response.data;
  },

  handleAICallback: async (data) => {
    // Du lieu api chua hoan chinh
    const response = await apiClient.post(
      `/analysis_requests/callback/image-results`,
      data
    );
    return response.data;
  },
};
