import { type TrendInsightResponse } from "../trend.types";

/**
 * Mock Trend Data
 * Represents real fashion trends with positive_rate (0-100) that gets formatted to "+85%" by mapper
 */
export const mockTrendInsights: TrendInsightResponse[] = [
  {
    _id: "t1",
    request_id: "req-t1",
    product_name: "Y2K Cyber Y2K",
    source_image_url:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=60",
    positive_rate: 85,
    total_reviews: 1200,
    created_at: "2026-05-01T08:00:00Z",
  },
  {
    _id: "t2",
    request_id: "req-t2",
    product_name: "Minimalist Utility",
    source_image_url:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&auto=format&fit=crop&q=60",
    positive_rate: 65,
    total_reviews: 890,
    created_at: "2026-05-02T10:30:00Z",
  },
  {
    _id: "t3",
    request_id: "req-t3",
    product_name: "Cottage Core Dream",
    source_image_url:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=60",
    positive_rate: 42,
    total_reviews: 650,
    created_at: "2026-05-03T14:15:00Z",
  },
  {
    _id: "t4",
    request_id: "req-t4",
    product_name: "Gorpcore Aesthetic",
    source_image_url:
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&auto=format&fit=crop&q=60",
    positive_rate: 92,
    total_reviews: 2100,
    created_at: "2026-05-04T09:45:00Z",
  },
];

/**
 * Mock Categories
 * Garment types available for design generation
 */
export const mockCategories = [
  "Dresses",
  "Outerwear",
  "Tops & Blouses",
  "Trousers",
  "Accessories",
];

/**
 * Mock Style Tags
 * Design style elements users can select
 */
export const mockStyleTags = [
  "Oversized",
  "Streetwear",
  "Vintage",
  "Futuristic",
  "Floral",
  "Monochrome",
  "Asymmetrical",
  "Techwear",
];

/**
 * Mock Trend Service
 * Provides trend data with simulated API delays
 */
export const trendMockService = {
  /**
   * Get all available trends
   * Simulates GET /api/v2/trends/
   */
  getTrends: async (): Promise<TrendInsightResponse[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate network delay
    return mockTrendInsights;
  },

  /**
   * Get single trend by ID
   * Simulates GET /api/v2/trends/{id}
   */
  getTrendById: async (
    trendId: string
  ): Promise<TrendInsightResponse | null> => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return mockTrendInsights.find((t) => t._id === trendId) || null;
  },

  /**
   * Get all categories
   * Simulates GET /api/v2/categories/
   */
  getCategories: async (): Promise<string[]> => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return mockCategories;
  },

  /**
   * Get all style tags
   * Simulates GET /api/v2/style-tags/
   */
  getStyleTags: async (): Promise<string[]> => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return mockStyleTags;
  },

  /**
   * Search trends by keyword
   * Simulates GET /api/v2/trends/search?q=keyword
   */
  searchTrends: async (keyword: string): Promise<TrendInsightResponse[]> => {
    await new Promise((resolve) => setTimeout(resolve, 250));
    return mockTrendInsights.filter((t) =>
      t.product_name.toLowerCase().includes(keyword.toLowerCase())
    );
  },
};
