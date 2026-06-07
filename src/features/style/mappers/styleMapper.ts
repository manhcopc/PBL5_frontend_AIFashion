import type { StylePresetResponse } from '../style.types';

/**
 * Style UI Format
 * What the UI components expect to display
 */
export interface StyleUIFormat {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
}

/**
 * Transform Style API Response to UI Format
 * - Maps _id to id
 * - Maps display_name to name
 * - Maps ai_prompt_text to description
 * - Maps thumbnail_url to thumbnail
 */
export function transformStyleToUI(style: StylePresetResponse): StyleUIFormat {
  return {
    id: style._id,
    name: style.display_name,
    description: style.ai_prompt_text,
    thumbnail: style.thumbnail_url,
  };
}

/**
 * Batch transform multiple styles
 */
export function transformStylesToUI(styles: StylePresetResponse[]): StyleUIFormat[] {
  return styles.map(transformStyleToUI);
}

/**
 * Format style name for display (capitalize, add spacing)
 */
export function formatStyleName(name: string): string {
  return name
    .split(/(?=[A-Z])/)
    .join(' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Truncate description to specified length
 */
export function truncateDescription(description: string, maxLength: number = 100): string {
  if (description.length <= maxLength) return description;
  return description.substring(0, maxLength) + '...';
}

export default {
  transformStyleToUI,
  transformStylesToUI,
  formatStyleName,
  truncateDescription,
};
