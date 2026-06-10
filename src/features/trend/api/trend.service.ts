import type { TrendInsightResponse } from "../trend.types";
import { apiClient } from "../../../services/ApiClient";

/**
 * Real Trend Service
 * Makes actual API calls to the backend
 */
const trendService = {
  /**
   * Get all available trends
   * GET /api/v2/trends/
   */
  getTrends: async (): Promise<TrendInsightResponse[]> => {
    return apiClient.get("/api/v2/trends/");
  },

  /**
   * Get single trend by ID
   * GET /api/v2/trends/{id}
   */
  getTrendById: async (
    trendId: string
  ): Promise<TrendInsightResponse | null> => {
    return apiClient.get(`/api/v2/trends/${trendId}/`);
  },

  /**
   * Get all categories
   * GET /api/v2/categories/
   */
  getCategories: async (): Promise<string[]> => {
    return apiClient.get("/api/v2/categories/");
  },

  /**
   * Get all style tags
   * GET /api/v2/style-tags/
   */
  getStyleTags: async (): Promise<string[]> => {
    return apiClient.get("/api/v2/style-tags/");
  },

  /**
   * Search trends by keyword
   * GET /api/v2/trends/search?q=keyword
   */
  searchTrends: async (keyword: string): Promise<TrendInsightResponse[]> => {
    return apiClient.get("/api/v2/trends/search", {
      params: { q: keyword },
    });
  },
};

export default trendService;
