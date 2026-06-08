import type { DesignResponse } from "../design.types";

/**
 * Design Mapper
 * Transforms API responses into UI domain models
 * Layer 4: Data Transformation Layer
 */

export interface DesignUI {
  id: string;
  requestId: string;
  imageUrl: string;
  rating: number;
  createdAt: string;
  formattedDate: string;
}

export const designMapper = {
  /**
   * Transform API response to UI model
   */
  toUI(design: DesignResponse): DesignUI {
    return {
      id: design._id,
      requestId: design.request_id,
      imageUrl: design.design_image_url,
      rating: design.user_rating || 0,
      createdAt: design.created_at,
      formattedDate: new Date(design.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  },

  /**
   * Transform multiple API responses to UI models
   */
  toUIList(designs: DesignResponse[]): DesignUI[] {
    return designs.map((design) => this.toUI(design));
  },

  /**
   * Transform UI model back to API request format
   */
  toAPI(design: DesignUI): Partial<DesignResponse> {
    return {
      _id: design.id,
      request_id: design.requestId,
      design_image_url: design.imageUrl,
      user_rating: design.rating,
      created_at: design.createdAt,
    };
  },
};
