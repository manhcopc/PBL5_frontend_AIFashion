import type { DesignResponse } from "../design.types";

/**
 * Design Mock Service
 * Provides mock data for testing and development
 * Layer 5: Data Access Layer
 */

const mockDesigns: DesignResponse[] = [
  {
    _id: "design_001",
    request_id: "req_001",
    design_image_url: "https://api.example.com/designs/001.jpg",
    user_rating: 4,
    created_at: "2026-05-01T10:00:00Z",
  },
  {
    _id: "design_002",
    request_id: "req_001",
    design_image_url: "https://api.example.com/designs/002.jpg",
    user_rating: 5,
    created_at: "2026-05-01T10:15:00Z",
  },
  {
    _id: "design_003",
    request_id: "req_002",
    design_image_url: "https://api.example.com/designs/003.jpg",
    user_rating: 3,
    created_at: "2026-05-02T11:00:00Z",
  },
  {
    _id: "design_004",
    request_id: "req_002",
    design_image_url: "https://api.example.com/designs/004.jpg",
    user_rating: 4,
    created_at: "2026-05-02T11:20:00Z",
  },
];

export const designMockService = {
  /**
   * Create a new design (mock)
   */
  createDesign: async (data): Promise<DesignResponse> => {
    const newDesign: DesignResponse = {
      _id: `design_${Date.now()}`,
      request_id: data.request_id,
      design_image_url: data.design_image_url,
      user_rating: data.user_rating || 0,
      created_at: new Date().toISOString(),
    };
    mockDesigns.push(newDesign);
    return newDesign;
  },

  /**
   * List designs by request ID
   */
  listByRequest: async (reqId: string): Promise<DesignResponse[]> => {
    return mockDesigns.filter((design) => design.request_id === reqId);
  },

  /**
   * Get design by ID
   */
  getDesign: async (id: string): Promise<DesignResponse | null> => {
    return mockDesigns.find((design) => design._id === id) || null;
  },

  /**
   * Rate a design
   */
  rateDesign: async (
    id: string,
    rating: number
  ): Promise<DesignResponse | null> => {
    const design = mockDesigns.find((d) => d._id === id);
    if (design) {
      design.user_rating = rating;
      return design;
    }
    return null;
  },

  /**
   * Delete a design
   */
  deleteDesign: async (id: string): Promise<void> => {
    const index = mockDesigns.findIndex((d) => d._id === id);
    if (index > -1) {
      mockDesigns.splice(index, 1);
    }
  },

  /**
   * Get all designs
   */
  getAllDesigns: async (): Promise<DesignResponse[]> => {
    return mockDesigns;
  },
};
