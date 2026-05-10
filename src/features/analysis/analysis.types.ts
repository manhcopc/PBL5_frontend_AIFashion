export interface CreateAnalysisRequest {
  project_id: string;
  category_name: string;
}

export interface AnalysisRequestResponse extends CreateAnalysisRequest {
  _id: string;
  project_id: string;
  category_name: string;
  status: "PENDING" | "COMPLETED" | "FAILED" | "GENERATING_IMAGES";
  created_at: string;
  updated_at: string;
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

export interface GenerateDesignRequest {
  base_image_url?: string;
  target_season: string;
  target_audience: string;
  target_weather: string;
  num_images: number;
  seed: number;
}
