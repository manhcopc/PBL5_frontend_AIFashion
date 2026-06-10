import trendService from "./trend.service";
import { trendMockService } from "./trend.mock";
import type { TrendInsightResponse } from "../trend.types";

/**
 * API Switcher for Trend Service
 * Routes to mock or real service based on VITE_USE_MOCK_DATA environment variable
 */
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === "true";

export const trendApi = {
  /**
   * Get all available trends
   */
  getTrends: async (): Promise<TrendInsightResponse[]> => {
    return USE_MOCK_DATA
      ? trendMockService.getTrends()
      : trendService.getTrends();
  },

  /**
   * Get single trend by ID
   */
  getTrendById: async (
    trendId: string
  ): Promise<TrendInsightResponse | null> => {
    return USE_MOCK_DATA
      ? trendMockService.getTrendById(trendId)
      : trendService.getTrendById(trendId);
  },

  /**
   * Get all categories
   */
  getCategories: async (): Promise<string[]> => {
    return USE_MOCK_DATA
      ? trendMockService.getCategories()
      : trendService.getCategories();
  },

  /**
   * Get all style tags
   */
  getStyleTags: async (): Promise<string[]> => {
    return USE_MOCK_DATA
      ? trendMockService.getStyleTags()
      : trendService.getStyleTags();
  },

  /**
   * Search trends by keyword
   */
  searchTrends: async (keyword: string): Promise<TrendInsightResponse[]> => {
    return USE_MOCK_DATA
      ? trendMockService.searchTrends(keyword)
      : trendService.searchTrends(keyword);
  },
};

export default trendApi;
