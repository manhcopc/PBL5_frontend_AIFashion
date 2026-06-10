export interface CreateAnalysisRequest {
  project_id: string;
  category_name: string;
}

export type AnalysisRequestStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED"
  | "GENERATING_IMAGES";

export interface AnalysisListItemResponse extends CreateAnalysisRequest {
  _id: string;
  project_id: string;
  category_name: string;
  status: AnalysisRequestStatus;
  created_at: string;
  updated_at: string;
}

export interface AnalysisRequestResponse extends AnalysisListItemResponse {
  ai_job_id: string;
  ai_callback_raw: {
    job_id: string;
    request_id: string;
    status: string;
    created_at: string;
    updated_at: string;
    started_at: string;
    finished_at: string;
    generated_designs: {
      url: string;
      seed: number;
    }[];
    error: string;
  };
  result_images?: string[];
}

export interface AnalysisRequestDetailResponse
  extends AnalysisListItemResponse {
  base_img_url?: string;
  ai_job_id?: string;
  result_images?: string[];
  ai_callback_raw?: AnalysisRequestResponse["ai_callback_raw"];
}

export interface GenerateDesignRequest {
  base_image_url?: string;
  target_season: string;
  target_audience: string;
  target_weather: string;
  num_images: number;
  seed: number;
}

// src/features/analysis/analysis.types.ts

// Kiểu dữ liệu thô từ API
export interface DesignResultResponse {
  _id: string;
  request_id: string;
  design_image_url: string[]; // Lưu ý đây là mảng
  user_rating: number;
  created_at: string;
}

export interface TriggerStatusResponse extends DesignResultResponse {
  status: AnalysisRequestStatus;
}

export interface JobCreateResponse {
  jobId: string;
  requestId: string;
  status: string;
  startedAt?: string;
}
