import { AnalysisService } from "./analysis.service";
import { analysisMockService } from "./analysis.mock";
import type {
  AnalysisListItemResponse,
  AnalysisRequestDetailResponse,
  AnalysisRequestResponse,
  GenerateDesignRequest,
  JobCreateResponse,
  TriggerStatusResponse,
} from "../analysis.types";
import type { DesignResult } from "../mappers/analysisMapper";

/**
 * Environment-based API Service Switcher for Design Generation
 * Automatically selects between mock and real API based on VITE_USE_MOCK_DATA
 *
 * When VITE_USE_MOCK_DATA=true: Uses mock data for development/testing
 * When VITE_USE_MOCK_DATA=false: Uses real API calls to backend
 */

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === "true";

/**
 * Unified Analysis/Design Generation API Interface
 * Provides a consistent interface regardless of mock/real service
 */
export const analysisApi = {
  createTrendAnalysisJob: async (data: {
    project_id: string;
    category_name: string;
  }): Promise<JobCreateResponse> => {
    const response = USE_MOCK_DATA
      ? await analysisMockService.createAnalysisRequest(data)
      : await AnalysisService.createAnalysis(data);

    return {
      jobId: response.ai_job_id || response._id,
      requestId: response._id,
      status: response.status,
      startedAt: response.created_at,
    };
  },

  fetchTrendAnalysisStatus: async (
    requestId: string
  ): Promise<AnalysisRequestResponse> => {
    return USE_MOCK_DATA
      ? analysisMockService.getAnalysisStatus(requestId)
      : AnalysisService.getAnalysisReq(requestId);
  },

  createImageGenerationJob: async (
    requestId: string,
    data: GenerateDesignRequest
  ): Promise<JobCreateResponse> => {
    const response = USE_MOCK_DATA
      ? await analysisMockService.triggerGeneration(requestId, data)
      : await AnalysisService.triggerGenerate(requestId, data);

    return {
      jobId: response.ai_job_id || response._id,
      requestId: response._id || requestId,
      status: response.status,
      startedAt: response.created_at,
    };
  },

  fetchImageGenerationStatus: async (
    requestId: string
  ): Promise<TriggerStatusResponse[]> => {
    return USE_MOCK_DATA
      ? analysisMockService.getTriggerStatus(requestId)
      : AnalysisService.getTriggerStatus(requestId);
  },

  getProjectAnalysisRequests: async (
    projectId: string
  ): Promise<AnalysisListItemResponse[]> => {
    return USE_MOCK_DATA
      ? analysisMockService.getListAnalysisByProject(projectId)
      : AnalysisService.getListAnalysisByProject(projectId);
  },

  getAnalysisRequestDetail: async (
    requestId: string
  ): Promise<AnalysisRequestDetailResponse> => {
    return USE_MOCK_DATA
      ? analysisMockService.getAnalysisRequest(requestId)
      : AnalysisService.getAnalysisRequest(requestId);
  },

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
   * @param projectId - Analysis request ID to check status
   * @param attempt - Attempt number for status progression simulation
   * @returns Promise of updated AnalysisRequestResponse
   */
  getAnalysisStatus: async (
    projectId: string,
    attempt: number = 0
  ): Promise<AnalysisRequestResponse> => {
    if (USE_MOCK_DATA) {
      return analysisMockService.getAnalysisStatus(projectId, attempt);
    } else {
      return AnalysisService.getAnalysisReq(projectId);
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
   * Get the status of a triggered generation
   * @param requestId - Analysis request ID
   * @returns Promise of generation status
   */
  getTriggerStatus: async (
    requestId: string
  ): Promise<TriggerStatusResponse[]> => {
    return USE_MOCK_DATA
      ? analysisMockService.getTriggerStatus(requestId)
      : AnalysisService.getTriggerStatus(requestId);
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
