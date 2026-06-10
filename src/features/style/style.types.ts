export interface StylePresetRequest {
  display_name: string; 
  ai_prompt_text: string; 
  thumbnail_url: string; 
}

export interface StylePresetResponse extends StylePresetRequest {
  _id: string; 
  created_at: string; 
}