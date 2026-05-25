import type {
  AnalysisRequestResponse,
  DesignResultResponse,
} from "../analysis.types";

/**
 * Design Result UI Type
 * Format expected by ResultsGrid component
 */
export interface DesignResult {
  id: string;
  requestId: string;
  imageUrl: string;
  title: string;
  description?: string;
}

/**
 * Transformed Analysis Request for UI
 * Combines analysis status with design results
 */
export interface TransformedAnalysisResult {
  requestId: string;
  status: "PENDING" | "COMPLETED" | "FAILED" | "GENERATING_IMAGES";
  designs: DesignResult[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Generate a placeholder image URL for design results
 * In production, this would come from the AI-generated images
 * @param designId - Design ID for consistent image selection
 * @returns URL to a design image
 */
function generateDesignImageUrl(designId: string): string {
  // Fashion design image collection from Unsplash
  const designImages = [
    "photo-1515886657613-9f3515b0c78f", // Fashion shot 1
    "photo-1529139574466-a303027c1d8b", // Fashion shot 2
    "photo-1509631179647-0177331693ae", // Fashion shot 3
    "photo-1434389678232-04ce6c5b9088", // Fashion shot 4
    "photo-1595777707802-41cefc7e7f45", // Fashion shot 5
    "photo-1551986782-d244d7d4538b", // Fashion shot 6
  ];

  // Hash design ID to select consistent image
  const hashCode = designId.split("").reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);

  const imageId = designImages[hashCode % designImages.length];
  return `https://images.unsplash.com/${imageId}?w=800&auto=format&fit=crop&q=60`;
}

/**
 * Format ISO date to readable string
 * @param isoDateString - ISO 8601 date string
 * @returns Formatted date string
 */
function formatDateForUI(isoDateString: string): string {
  try {
    const date = new Date(isoDateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Invalid date";
  }
}

/**
 * Transform Backend Analysis Response to UI Format
 * Handles:
 * - Status mapping and formatting
 * - Date formatting (ISO → readable)
 * - Design image URL generation for missing imageUrl fields
 * - Description extraction or generation
 *
 * @param apiResponse - Raw AnalysisRequestResponse from backend
 * @param designs - Array of design results (can include missing imageUrl)
 * @returns Transformed result ready for UI consumption
 */
export function transformAnalysisResponseToUI(
  apiResponse: AnalysisRequestResponse,
  designs: DesignResult[] = []
): TransformedAnalysisResult {
  // ✅ Đảm bảo designs luôn là mảng trước khi map
  const safeDesigns = Array.isArray(designs) ? designs : [];

  const designsWithImages = safeDesigns.map((design) => ({
    ...design,
    imageUrl: design.imageUrl || generateDesignImageUrl(design.id),
  }));

  return {
    requestId: apiResponse._id,
    status: apiResponse.status,
    designs: designsWithImages,
    createdAt: formatDateForUI(apiResponse.created_at),
    updatedAt: formatDateForUI(apiResponse.updated_at),
  };
}

/**
 * Transform single design result
 * Ensures imageUrl is present (generates if missing)
 * @param design - Raw design result
 * @returns Transformed design with guaranteed imageUrl
 */
export function transformDesignResult(design: DesignResult): DesignResult {
  return {
    ...design,
    imageUrl: design.imageUrl || generateDesignImageUrl(design.id),
  };
}

/**
 * Transform multiple design results
 * @param designs - Array of design results
 * @returns Transformed designs with guaranteed imageUrl for all
 */
export function transformDesignResults(
  responseOrDesigns: AnalysisRequestResponse | any
): DesignResult[] {
  // 1. Nếu truyền thẳng toàn bộ response từ API (Cách an toàn và khuyên dùng nhất)
  if (
    responseOrDesigns &&
    responseOrDesigns.ai_callback_raw?.generated_designs
  ) {
    const rawDesigns = responseOrDesigns.ai_callback_raw.generated_designs;

    return rawDesigns.map((item: any, index: number) => ({
      id: item.seed ? String(item.seed) : `design-${index}`,
      imageUrl: item.url,
      title: `Thiết kế mẫu ${index + 1}`,
      description: `Mã Seed: ${item.seed}`,
    }));
  }

  // 2. Nếu response trả về mảng result_images (dự phòng theo interface của bạn)
  if (
    responseOrDesigns &&
    Array.isArray(responseOrDesigns.result_images) &&
    responseOrDesigns.result_images.length > 0
  ) {
    return responseOrDesigns.result_images.map(
      (url: string, index: number) => ({
        id: `res-img-${index}`,
        imageUrl: url,
        title: `Kết quả ${index + 1}`,
      })
    );
  }

  // 3. Nếu lỡ truyền thẳng mảng {url, seed} vào
  // if (Array.isArray(responseOrDesigns)) {
  //   return responseOrDesigns.map((item: any, index: number) => ({
  //     id: item.id || (item.seed ? String(item.seed) : `design-${index}`),
  //     imageUrl: item.imageUrl || item.url, // Hỗ trợ cả 2 chuẩn key
  //     title: item.title || `Thiết kế ${index + 1}`,
  //   }));
  // }

  // Nếu không rơi vào trường hợp nào, trả về mảng rỗng để không bị crash map()
  console.warn(
    "Không tìm thấy dữ liệu ảnh hợp lệ trong response:",
    responseOrDesigns
  );
  return [];
}

/**
 * Get status display text
 * @param status - Analysis status
 * @returns Human-readable status text
 */
export function getStatusDisplayText(status: string): string {
  const statusMap: Record<string, string> = {
    PENDING: "Queued - Waiting to process...",
    PROCESSING: "Processing - Generating designs...",
    COMPLETED: "Complete - Designs ready!",
    FAILED: "Failed - Please try again",
  };
  return statusMap[status] || status;
}

// export const transformDesignResponse = (
//   res: DesignResultResponse
// ): DesignResult => {
//   return {
//     id: res._id,
//     requestId: res.request_id,
//     // Lấy ảnh đầu tiên làm ảnh chính, nếu mảng rỗng thì dùng placeholder
//     rating: res.user_rating,
//     date: new Date(res.created_at).toLocaleDateString("vi-VN"), // Format ngày tiếng Việt
//   };
// };
