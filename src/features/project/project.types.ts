export interface ProjectRequest {
  project_name: string; 
  description: string; 
}

export interface ProjectResponse extends ProjectRequest {
  _id: string; 
  user_id: string; 
  created_at: string; 
}
