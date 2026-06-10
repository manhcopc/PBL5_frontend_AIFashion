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

  addNewStylePreset: async (data: {
    name: string;
    description: string;
    category: string;
    parameters: Record<string, any>;
  }): Promise<StylePresetResponse> => {
    return apiClient.post("/style-presets/", data);
  },

  updateStylePreset: async (
    styleId: string,
    data: {
      name?: string;
      description?: string;
      category?: string;
      parameters?: Record<string, any>;
    }
  ): Promise<StylePresetResponse> => {
    return apiClient.put(`/style-presets/${styleId}/`, data);
  },

  deleteStylePreset: async (styleId: string): Promise<void> => {
    return apiClient.delete(`/style-presets/${styleId}/`);
  },
};

export default styleService;
