export interface Project {
  id: string;
  title: string;
  description: string;
  date: string;
  requests: number;
  imageUrl: string;
}

export interface DesignRequest {
  id: string;
  category: string;
  targetStyle: string;
  date: string;
  status: 'Completed' | 'Generating' | 'Pending';
}

export interface DesignRequestWithImages extends DesignRequest {
  design_image_url?: string[];
}
