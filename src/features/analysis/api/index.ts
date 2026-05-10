import { AnalysisService } from "./analysis.service";
import { analysisMockService } from "./analysis.mock";
import type {
  AnalysisRequestResponse,
  GenerateDesignRequest,
} from "../analysis.types";
import type { DesignResult } from "../mappers/analysisMapper";

/**
 * Environment-based API Service Switcher for Design Generation
 * Automatically selects between mock and real API based on VITE_USE_MOCK_DATA
 *
 * When VITE_USE_MOCK_DATA=true: Uses mock data for development/testing
 * When VITE_USE_MOCK_DATA=false: Uses real API calls to backend
 */

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === "false";

/**
 * Unified Analysis/Design Generation API Interface
 * Provides a consistent interface regardless of mock/real service
 */
export const analysisApi = {
  /**
   * Create a new analysis request for design generation
   * @param data - Analysis request data with project, category, styles, trends
   * @returns Promise of AnalysisRequestResponse with initial status
   */
  createAnalysisRequest: async (data: {
    project_id: string;
    category_name: string;
  }): Promise<AnalysisRequestResponse> => {
    if (USE_MOCK_DATA) {
      return analysisMockService.createAnalysisRequest(data);
    } else {
      return AnalysisService.createAnalysis(data);
    }
  },

  /**
   * Poll for analysis status with simulated progressive updates
   * @param requestId - Analysis request ID to check status
   * @param attempt - Attempt number for status progression simulation
   * @returns Promise of updated AnalysisRequestResponse
   */
  getAnalysisStatus: async (
    requestId: string,
    attempt: number = 0
  ): Promise<AnalysisRequestResponse> => {
    if (USE_MOCK_DATA) {
      return analysisMockService.getAnalysisStatus(requestId, attempt);
    } else {
      return AnalysisService.getAnalysisReq(requestId);
    }
  },

  /**
   * Fetch design generation results
   * @param requestId - Analysis request ID
   * @returns Promise of design results array
   */
  getDesignResults: async (requestId: string): Promise<DesignResult[]> => {
    //designs: DesignResult[]
    if (USE_MOCK_DATA) {
      return analysisMockService.getDesignResults(requestId);
    } else {
      return AnalysisService.getAnalysisResults(requestId);
    }
  },

  /**
   * Trigger AI generation for an analysis request
   * @param requestId - Analysis request ID
   * @returns Promise of updated AnalysisRequestResponse
   */
  triggerGeneration: async (
    requestId: string,
    data: GenerateDesignRequest
  ): Promise<AnalysisRequestResponse> => {
    if (USE_MOCK_DATA) {
      return analysisMockService.triggerGeneration(requestId, data);
    } else {
      return AnalysisService.triggerGenerate(requestId, {
        base_image_url: data.base_image_url,
        target_season: data.target_season,
        target_audience: data.target_audience,
        target_weather: data.target_weather,
        num_images: data.num_images,
        seed: data.seed,
      });
    }
  },

  /**
   * Delete an analysis request
   * @param requestId - Analysis request ID to delete
   * @returns Promise of success status
   */
  deleteAnalysisRequest: async (
    requestId: string
  ): Promise<{ success: boolean }> => {
    if (USE_MOCK_DATA) {
      return analysisMockService.deleteAnalysisRequest(requestId);
    } else {
      return AnalysisService.deleteAnalysis(requestId);
    }
  },
};

export default analysisApi;
