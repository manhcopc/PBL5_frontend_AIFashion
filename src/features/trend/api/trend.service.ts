// import type { User } from '../user.types';
import apiClient from "../../../services/ApiClient";
import type { TrendInsightRequest, TrendInsightResponse } from "../trend.types";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const TrendService = {
  // Trend Insights V2 [cite: 8]
  createTrendInsight: async (
    data: TrendInsightRequest
  ): Promise<TrendInsightResponse> => {
    const response = await apiClient.post("/trend_insights/", data);
    return response.data;
  },
  getListInsightsByRequest: async (
    reqId: string
  ): Promise<TrendInsightResponse[]> => {
    const response = await apiClient.get(`/trend_insights/request/${reqId}`);
    return response.data;
  },
  getInsightDetails: async (id: string): Promise<TrendInsightResponse> => {
    const response = await apiClient.get(`/trend_insights/${id}`);
    return response.data;
  },
  deleteInsight: async (id: string) =>
    apiClient.delete(`/trend_insights/${id}`),

  // Trend Result duplicate for now, will be refactored later
  getResultsByRequest: async (reqId: string) =>
    apiClient.get(`/trend-results/request/${reqId}`),

  createResult: async (data) => apiClient.post("/trend-results/", data),
};
