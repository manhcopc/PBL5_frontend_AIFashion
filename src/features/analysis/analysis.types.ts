export interface CreateAnalysisRequest {
  project_id: string; 
  category_name: string; 
  target_style_id: string; 
  selected_trend_image_ids: string[]; 
}

export interface AnalysisRequestResponse extends CreateAnalysisRequest {
  _id: string; 
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'; 
  created_at: string; 
  updated_at: string; 
}