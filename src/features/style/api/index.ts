import styleService from "./style.service";
import { styleMockService } from "./style.mock";
import type { StylePresetResponse } from "../style.types";

/**
 * API Switcher for Style Service
 * Routes to mock or real service based on VITE_USE_MOCK_DATA environment variable
 */
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === "true";

export const styleApi = {
  /**
   * Get all available style presets
   */
  getStylePresets: async (): Promise<StylePresetResponse[]> => {
    return USE_MOCK_DATA
      ? styleMockService.getStylePresets()
      : styleService.getStylePresets();
  },

  /**
   * Get single style preset by ID
   */
  getStylePresetById: async (
    styleId: string
  ): Promise<StylePresetResponse | null> => {
    return USE_MOCK_DATA
      ? styleMockService.getStylePresetById(styleId)
      : styleService.getStylePresetById(styleId);
  },

  /**
   * Get styles by category
   */
  getStylesByCategory: async (
    category: string
  ): Promise<StylePresetResponse[]> => {
    return USE_MOCK_DATA
      ? styleMockService.getStylesByCategory(category)
      : styleService.getStylesByCategory(category);
  },

  /**
   * Search styles by keyword
   */
  searchStyles: async (keyword: string): Promise<StylePresetResponse[]> => {
    return USE_MOCK_DATA
      ? styleMockService.searchStyles(keyword)
      : styleService.searchStyles(keyword);
  },
};

export default styleApi;
