// --- Trend Insights & Results ---
export interface TrendInsightRequest {
  request_id: string;
  product_name: string;
  source_image_url: string;
  positive_rate: number;
  total_reviews: number;
}

export interface TrendInsightResponse extends TrendInsightRequest {
  _id: string;
  created_at: string;
}
