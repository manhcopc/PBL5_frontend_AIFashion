export interface CreateDesignRequest {
  request_id: string; 
  design_image_url: string; 
  user_rating: number; 
}

export interface DesignResponse extends CreateDesignRequest {
  _id: string; 
  created_at: string; 
}