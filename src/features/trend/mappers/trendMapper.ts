import { TrendInsightResponse } from '../trend.types';

/**
 * Trend UI Format
 * What the UI components expect to display
 */
export interface TrendUIFormat {
  id: string;
  title: string;
  imageUrl: string;
  percentage: string; // Formatted like "+85%"
}

/**
 * Transform Trend API Response to UI Format
 * - Maps _id to id
 * - Maps product_name to title
 * - Maps source_image_url to imageUrl
 * - Formats positive_rate (85) to percentage ("+85%")
 */
export function transformTrendToUI(trend: TrendInsightResponse): TrendUIFormat {
  return {
    id: trend._id,
    title: trend.product_name,
    imageUrl: trend.source_image_url,
    percentage: formatPositiveRate(trend.positive_rate),
  };
}

/**
 * Batch transform multiple trends
 */
export function transformTrendsToUI(trends: TrendInsightResponse[]): TrendUIFormat[] {
  return trends.map(transformTrendToUI);
}

/**
 * Format positive_rate (0-100) to display format ("+85%", "+42%")
 * KEY FEATURE: Converts numeric positive_rate to formatted percentage string
 */
export function formatPositiveRate(rate: number): string {
  const rounded = Math.round(rate);
  return `+${rounded}%`;
}

/**
 * Get status text for percentage (trending, stable, declining)
 */
export function getPercentageStatus(rate: number): 'trending' | 'stable' | 'declining' {
  if (rate >= 75) return 'trending';
  if (rate >= 50) return 'stable';
  return 'declining';
}

export default {
  transformTrendToUI,
  transformTrendsToUI,
  formatPositiveRate,
  getPercentageStatus,
};
