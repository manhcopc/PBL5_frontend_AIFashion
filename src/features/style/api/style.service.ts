import type { StylePresetResponse } from "../style.types";
import { apiClient } from "../../../services/ApiClient";

/**
 * Real Style Service
 * Makes actual API calls to the backend
 */
const styleService = {
  /**
   * Get all available style presets
   * GET /style-presets/
   */
  getStylePresets: async (): Promise<StylePresetResponse[]> => {
    return apiClient.get("/style-presets/");
  },

  /**
   * Get single style preset by ID
   * GET /style-presets/{id}
   */
  getStylePresetById: async (
    styleId: string
  ): Promise<StylePresetResponse | null> => {
    return apiClient.get(`/style-presets/${styleId}/`);
  },

  /**
   * Get styles by category
   * GET /style-presets/category/{category}
   */
  getStylesByCategory: async (
    category: string
  ): Promise<StylePresetResponse[]> => {
    return apiClient.get(`/style-presets/category/${category}/`);
  },

  /**
   * Search styles by keyword
   * GET /style-presets/search?q=keyword
   */
  searchStyles: async (keyword: string): Promise<StylePresetResponse[]> => {
    return apiClient.get("/style-presets/search", {
      params: { q: keyword },
    });
  },
};

export default styleService;
