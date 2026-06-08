import apiClient from "../../../services/ApiClient";
import type {
  AnalysisListItemResponse,
  AnalysisRequestDetailResponse,
  AnalysisRequestResponse,
  CreateAnalysisRequest,
  GenerateDesignRequest,
  TriggerStatusResponse,
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
  ): Promise<AnalysisListItemResponse[]> => {
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

  triggerGenerate: async (reqId: string, data: GenerateDesignRequest) => {
    const response = await apiClient.post(
      `/analysis_requests/${reqId}/generate`,
      data
    );
    return response.data;
  },

  getTriggerStatus: async (reqId: string): Promise<TriggerStatusResponse[]> => {
    // Du lieu api chua hoan chinh
    // const response = await apiClient.get(`/analysis_requests/request/${reqId}`);
    const response = await apiClient.get(`/generated_designs/request/${reqId}`);
    return response.data;
  },

  getAnalysisResults: async (
    // Du lieu api chua hoan chinh
    reqId: string
  ) => {
    const response = await apiClient.get(`/analysis_requests/${reqId}/results`);
    return response.data;
  },

  handleAICallback: async (data: unknown) => {
    // Du lieu api chua hoan chinh
    const response = await apiClient.post(
      `/analysis_requests/callback/image-results`,
      data
    );
    return response.data;
  },
  // Lấy thông tin chi tiết và trạng thái hiện tại của một phiên phân tích. GET /api/v2/analysis_requests/{req_id}
  getAnalysisRequest: async (
    req_id: string
  ): Promise<AnalysisRequestDetailResponse> => {
    const response = await apiClient.get(`/analysis_requests/${req_id}`);
    return response.data;
  },
};
