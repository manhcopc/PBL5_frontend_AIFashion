import { useState, useCallback, useEffect, useRef } from "react";
import analysisApi from "@/features/analysis/api";
import { transformDesignResults } from "@/features/analysis/mappers/analysisMapper";

/**
 * Generation State Type
 */
export type GenerationState =
  | "PENDING"
  | "COMPLETED"
  | "FAILED"
  | "GENERATING_IMAGES"
  | "ERROR"
  | "SUCCESS"
  | "LOADING";

/**
 * Hook: useDesignGeneration
 *
 * Manages async design generation with polling
 * Handles state transitions: IDLE → LOADING → SUCCESS/ERROR
 * Supports polling for long-running AI generation tasks
 */
export function useDesignGeneration() {
  const [status, setStatus] = useState<GenerationState>("PENDING");
  const [designs, setDesigns] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentRequestId, setCurrentRequestId] = useState<string | null>(null);

  // Polling control
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollAttemptRef = useRef(0);

  /**
   * Poll for generation status
   */
  const pollGenerationStatus = useCallback(async (requestId: string) => {
    try {
      const attempt = pollAttemptRef.current;

      // Chỉ gọi API 1 LẦN DUY NHẤT trong mỗi nhịp polling
      const response = await analysisApi.getAnalysisStatus(requestId, attempt);

      if (response.status === "COMPLETED") {
        // KIỂM TRA: Đã COMPLETED nhưng đã trả về mảng ảnh chưa?
        if (response.result_images && response.result_images.length > 0) {
          console.log(
            "API response contains result_images:",
            response.result_images
          );

          // Format dữ liệu
          const transformed = transformDesignResults(response);

          // Cập nhật State
          setDesigns(transformed.map((d) => d.imageUrl)); // Lấy URL để hiển thị
          setStatus("SUCCESS");
          setError(null);

          // ✅ ĐÃ CÓ ẢNH: Dừng vòng lặp polling
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
          }
        } else {
          // ⏳ BÁO COMPLETED NHƯNG CHƯA CÓ ẢNH:
          // Chỉ log ra cảnh báo và KHÔNG clear interval.
          // Vòng lặp sẽ tự động chạy lại vào 1 giây sau để check tiếp.
          console.warn(
            "Status là COMPLETED nhưng chưa có ảnh, tiếp tục chờ..."
          );
        }
      } else if (response.status === "FAILED") {
        setStatus("ERROR");
        setError("Quá trình tạo thiết kế thất bại từ máy chủ.");

        // ❌ LỖI TỪ SERVER: Dừng vòng lặp polling
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
        }
      }

      // Tăng biến đếm số lần gọi (nếu bạn có dùng limit)
      pollAttemptRef.current += 1;
    } catch (err) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Failed to check generation status";
      setError(errorMsg);
      setStatus("ERROR");

      // ❌ LỖI MẠNG / CRASH: Dừng vòng lặp polling
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    }
  }, []);

  /**
   * Start design generation
   */
  const generateDesigns = useCallback(
    async (analysisData?: { project_id: string; category_name: string }) => {
      // 1. Dọn dẹp polling cũ nếu đang chạy để tránh xung đột
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }

      setStatus("LOADING"); // Thống nhất trạng thái đang xử lý
      setError(null);
      setDesigns([]);
      pollAttemptRef.current = 0;

      try {
        // 2. Chuẩn bị payload (Sử dụng dữ liệu mặc định nếu không có analysisData)
        const payload = analysisData || {
          project_id: "default-project",
          category_name: "Dresses",
        };

        const analysisRequest = await analysisApi.createAnalysisRequest(
          payload
        );

        const requestId = analysisRequest._id;

        if (!requestId)
          throw new Error("Không nhận được Request ID từ máy chủ.");

        setCurrentRequestId(requestId);

        // 3. Thiết lập Polling
        pollIntervalRef.current = setInterval(() => {
          // Sử dụng void để tránh cảnh báo floating promise của linter
          void pollGenerationStatus(requestId);
        }, 1000);

        // Gọi poll lần đầu ngay lập tức để giảm thời gian chờ của người dùng
        await pollGenerationStatus(requestId);
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Khởi tạo thiết kế thất bại";
        setError(errorMsg);
        setStatus("ERROR");

        // Đảm bảo dừng polling nếu bước khởi tạo lỗi
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
        }
      }
    },
    [pollGenerationStatus]
  );

  /**
   * Reset generation state
   */
  const resetStudio = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    pollAttemptRef.current = 0;

    setStatus("PENDING");
    setDesigns([]);
    setError(null);
    setCurrentRequestId(null);
  }, []);

  /**
   * Cancel ongoing generation
   */
  const cancelGeneration = useCallback(async () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }

    if (currentRequestId) {
      try {
        await analysisApi.deleteAnalysisRequest(currentRequestId);
      } catch (err) {
        console.error("Failed to cancel generation:", err);
      }
    }

    resetStudio();
  }, [currentRequestId, resetStudio]);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  return {
    status,
    designs,
    error,
    currentRequestId,
    generateDesigns,
    resetStudio,
    cancelGeneration,
    clearError,
  };
}
