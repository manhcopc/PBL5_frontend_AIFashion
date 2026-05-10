import type { ProjectResponse } from "../project.types";
import type { Project } from "../../../types";

/**
 * Date Formatter Utility
 * Converts ISO 8601 date string to readable format
 * @param isoDateString - ISO date string (e.g., "2026-02-10T14:30:00Z")
 * @returns Formatted date string (e.g., "Feb 10, 2026")
 */
function formatDateForUI(isoDateString: string): string {
  try {
    const date = new Date(isoDateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "Invalid date";
  }
}

/**
 * Generate a placeholder image URL for projects
 * In production, this would come from the API or be stored in the database
 * @param projectId - Project ID for consistent image selection
 * @returns URL to a placeholder image
 */
function generateProjectImageUrl(projectId: string): string {
  // Using Unsplash API for consistent placeholder images based on project ID
  const imageIds = [
    "photo-1515886657613-9f3515b0c78f",
    "photo-1490481651871-ab68de25d43d",
    "photo-1529139574466-a303027c1d8b",
    "photo-1434389678232-04ce6c5b9088",
  ];

  // Hash project ID to select consistent image
  const hashCode = projectId.split("").reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);

  const imageId = imageIds[hashCode % imageIds.length];
  return `https://images.unsplash.com/${imageId}?q=80&w=1000&auto=format&fit=crop`;
}

/**
 * Fetch project requests count
 * This is a placeholder until the API provides this data
 * @param projectId - Project ID
 * @returns Promise of request count
 */
async function fetchProjectRequestCount(projectId: string): Promise<number> {
  // TODO: Replace with actual API call to /projects/{projectId}/requests
  // For now, return a mock count based on project ID
  console.log(projectId);
  await new Promise((resolve) => setTimeout(resolve, 100));
  return Math.floor(Math.random() * 50) + 5;
}

/**
 * Transform Backend API Response to UI Format
 * Handles all field mismatches identified in the Data Compatibility Audit:
 * - _id → id
 * - project_name → title
 * - created_at → date (formatted)
 * - Adds missing fields: imageUrl, requests
 *
 * @param apiResponse - Raw ProjectResponse from backend
 * @returns Transformed Project object ready for UI consumption
 */
export async function transformProjectResponseToUI(
  apiResponse: ProjectResponse
): Promise<Project> {
  // Fetch request count concurrently to minimize delay
  const requests = await fetchProjectRequestCount(apiResponse._id);

  return {
    id: apiResponse._id,
    title: apiResponse.project_name,
    description: apiResponse.description,
    date: formatDateForUI(apiResponse.created_at),
    requests,
    imageUrl: generateProjectImageUrl(apiResponse._id),
  };
}

/**
 * Batch transform multiple API responses
 * More efficient than calling transformProjectResponseToUI individually
 *
 * @param apiResponses - Array of ProjectResponse objects from backend
 * @returns Promise of transformed Project array
 */
export async function transformProjectsResponseToUI(
  apiResponses: ProjectResponse[]
): Promise<Project[]> {
  return Promise.all(
    apiResponses.map((response) => transformProjectResponseToUI(response))
  );
}

/**
 * Synchronous version of date formatter for use in other contexts
 * @param isoDateString - ISO date string
 * @returns Formatted date string
 */
export function formatProjectDate(isoDateString: string): string {
  return formatDateForUI(isoDateString);
}

/**
 * Synchronous version of image URL generator
 * @param projectId - Project ID
 * @returns Image URL
 */
export function getProjectImageUrl(projectId: string): string {
  return generateProjectImageUrl(projectId);
}
