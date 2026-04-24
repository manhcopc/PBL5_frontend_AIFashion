

export interface Project {
  _id: string;
  project_name: string;
  description: string;
  user_id: string;
  created_at: string;
}

export interface CreateProjectPayload {
  project_name: string;
  description: string;
}

export interface UpdateProjectPayload {
  project_name?: string;
  description?: string;
}

export interface AnalysisRequest {
  _id: string;
  project_id: string;
  category_name: string;
  target_style_id: string;
  selected_trend_image_ids: string[];
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAnalysisRequestPayload {
  project_id: string;
  category_name: string;
  target_style_id: string;
  selected_trend_image_ids: string[];
}

export interface DiscoverTrendsPayload {
  project_id: string;
  category_name: string;
  target_style_id: string;
  selected_trend_image_ids: string[];
}

export interface SubscriptionPlan {
  _id: string;
  plan_name: string;
  price_per_month: number;
  credits_per_month: number;
  description: string;
  is_popular: boolean;
  features: string[];
  created_at: string;
}

export interface CreateSubscriptionPlanPayload {
  plan_name: string;
  price_per_month: number;
  credits_per_month: number;
  description: string;
  is_popular: boolean;
  features: string[];
}

export interface UpdateSubscriptionPlanPayload {
  plan_name?: string;
  price_per_month?: number;
  credits_per_month?: number;
  description?: string;
  is_popular?: boolean;
  features?: string[];
}

export interface Transaction {
  id: string;
  date: string;
  type: 'Top Up' | 'Usage AI';
  amount: number;
  relatedRequestId?: string;
}

export interface TrendItem {
  id: string;
  name: string;
  image: string;
  positiveRating: number;
}

export interface GeneratedDesign {
  id: string;
  title: string;
  image: string;
}

export interface Asset {
  id: string;
  image: string;
  category: string;
}

// ============= CREDIT TRANSACTIONS =============
export interface CreditTransaction {
  _id: string;
  user_id: string;
  transaction_type: 'TOP_UP' | 'USAGE_AI';
  amount: number;
  related_request_id?: string;
  created_at: string;
}

export interface CreateCreditTransactionPayload {
  user_id: string;
  transaction_type: 'TOP_UP' | 'USAGE_AI';
  amount: number;
  related_request_id?: string;
}

// ============= GENERATED DESIGNS =============
export interface GeneratedDesignResponse {
  _id: string;
  request_id: string;
  design_image_url: string;
  user_rating: number;
  created_at: string;
}

export interface CreateGeneratedDesignPayload {
  request_id: string;
  design_image_url: string;
  user_rating?: number;
}

export interface RateDesignPayload {
  user_rating: number;
}

// ============= STYLE PRESETS =============
export interface StylePreset {
  _id: string;
  display_name: string;
  ai_prompt_text: string;
  thumbnail_url: string;
  created_at: string;
}

export interface CreateStylePresetPayload {
  display_name: string;
  ai_prompt_text: string;
  thumbnail_url: string;
}

export interface UpdateStylePresetPayload {
  thumbnail_url?: string;
}

// ============= TREND INSIGHTS =============
export interface TrendInsight {
  _id: string;
  request_id: string;
  product_name: string;
  source_image_url: string;
  positive_rate: number;
  total_reviews: number;
  created_at: string;
}

export interface CreateTrendInsightPayload {
  request_id: string;
  product_name: string;
  source_image_url: string;
  positive_rate: number;
  total_reviews: number;
}

// ============= ANALYSIS ADVANCED =============
export interface AnalysisStatus {
  request_id: string;
  status: string;
  progress: number;
  updated_at: string;
}

// export interface TrendInsights {
//   [key: string]: any;
// }

// export interface AnalysisResults {
//   [key: string]: any;
// }

// export interface TriggerGenerationPayload {
//   [key: string]: any;
// }

// ============= API RESPONSE WRAPPERS =============
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  detail: Array<{
    loc: (string | number)[];
    msg: string;
    type: string;
    input: string;
  }>;
}
