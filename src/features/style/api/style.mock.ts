import type { StylePresetResponse } from "../style.types";

/**
 * Mock Style Preset Data
 * Represents pre-defined style templates for design generation
 */
export const mockStylePresets: StylePresetResponse[] = [
  {
    _id: "style-1",
    display_name: "Oversized",
    ai_prompt_text:
      "Loose fitting, comfortable silhouette with exaggerated proportions",
    thumbnail_url:
      "https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=400&auto=format&fit=crop&q=60",
    created_at: "2026-04-01T00:00:00Z",
  },
  {
    _id: "style-2",
    display_name: "Streetwear",
    ai_prompt_text:
      "Urban fashion with bold graphics, sneaker culture influence",
    thumbnail_url:
      "https://images.unsplash.com/photo-1515521396207-6211120bd2f1?w=400&auto=format&fit=crop&q=60",
    created_at: "2026-04-02T00:00:00Z",
  },
  {
    _id: "style-3",
    display_name: "Vintage",
    ai_prompt_text: "Retro inspired designs, nostalgic elements, classic cuts",
    thumbnail_url:
      "https://images.unsplash.com/photo-1595526014635-a91febc20dca?w=400&auto=format&fit=crop&q=60",
    created_at: "2026-04-03T00:00:00Z",
  },
  {
    _id: "style-4",
    display_name: "Futuristic",
    ai_prompt_text:
      "Modern tech-inspired, metallic accents, innovative materials",
    thumbnail_url:
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&auto=format&fit=crop&q=60",
    created_at: "2026-04-04T00:00:00Z",
  },
  {
    _id: "style-5",
    display_name: "Floral",
    ai_prompt_text: "Nature-inspired, botanical prints, feminine aesthetics",
    thumbnail_url:
      "https://images.unsplash.com/photo-1595537267015-add247cb2571?w=400&auto=format&fit=crop&q=60",
    created_at: "2026-04-05T00:00:00Z",
  },
  {
    _id: "style-6",
    display_name: "Monochrome",
    ai_prompt_text:
      "Single color palette, minimalist elegance, tonal variations",
    thumbnail_url:
      "https://images.unsplash.com/photo-1552052375-118efb5d0a60?w=400&auto=format&fit=crop&q=60",
    created_at: "2026-04-06T00:00:00Z",
  },
  {
    _id: "style-7",
    display_name: "Asymmetrical",
    ai_prompt_text:
      "Unbalanced cuts, unique hemlines, avant-garde construction",
    thumbnail_url:
      "https://images.unsplash.com/photo-1595537707802-91d2df46acca?w=400&auto=format&fit=crop&q=60",
    created_at: "2026-04-07T00:00:00Z",
  },
  {
    _id: "style-8",
    display_name: "Techwear",
    ai_prompt_text:
      "Technical fabrics, functional design, utility pockets and straps",
    thumbnail_url:
      "https://images.unsplash.com/photo-1591047990872-f62e2b6fcef1?w=400&auto=format&fit=crop&q=60",
    created_at: "2026-04-08T00:00:00Z",
  },
];

/**
 * Mock Style Service
 * Provides style preset data with simulated API delays
 */
export const styleMockService = {
  /**
   * Get all available style presets
   * Simulates GET /api/v2/style-presets/
   */
  getStylePresets: async (): Promise<StylePresetResponse[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockStylePresets;
  },

  /**
   * Get single style preset by ID
   * Simulates GET /api/v2/style-presets/{id}
   */
  getStylePresetById: async (
    styleId: string
  ): Promise<StylePresetResponse | null> => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return mockStylePresets.find((s) => s._id === styleId) || null;
  },

  /**
   * Get styles by category/tags
   * Simulates GET /api/v2/style-presets/category/{category}
   */
  getStylesByCategory: async (
    category: string
  ): Promise<StylePresetResponse[]> => {
    await new Promise((resolve) => setTimeout(resolve, 250));
    // Mock filtering by category - in real API would filter by backend
    return mockStylePresets;
  },

  /**
   * Search styles by keyword
   * Simulates GET /api/v2/style-presets/search?q=keyword
   */
  searchStyles: async (keyword: string): Promise<StylePresetResponse[]> => {
    await new Promise((resolve) => setTimeout(resolve, 250));
    return mockStylePresets.filter(
      (s) =>
        s.display_name.toLowerCase().includes(keyword.toLowerCase()) ||
        s.ai_prompt_text.toLowerCase().includes(keyword.toLowerCase())
    );
  },
};
