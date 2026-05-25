import { useState, useCallback, useEffect, useRef } from "react";
import analysisApi from "@/features/analysis/api";
// import { transformDesignResults } from "@/features/analysis/mappers/analysisMapper";
import { useUserStore } from "@/store/UserContext";
import type { GenerateDesignRequest } from "@/features/analysis/analysis.types";
// import { useAuthStore } from "@/features/auth/state/use-auth-store";

/**
 * Hook: useGenerationFlow
 *
 * Manages the complete design generation workflow:
 * 1. User selects trend, category, and styles
 * 2. Initiates design generation via API
 * 3. Polls for status with progressive messages
 * 4. Returns results when generation completes
 */
type InitialGenerationData = Omit<
  GenerateDesignRequest,
  "target_season" | "target_audience" | "target_weather"
>;
export function useGenerationFlow(
  requestId: string,
  data: InitialGenerationData
) {
  // const userId = useAuthStore((state) => state.userId);

  const { credits, consumeCredits } = useUserStore();

  const [selectedTrend, setSelectedTrend] = useState<string | null>(null);
  // const [category, setCategory] = useState<string>("");
  // const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [weather, setWeather] = useState<string>("");
  const [season, setSeason] = useState<string>("");
  const [audience, setAudience] = useState<string>("");

  // Validate available categories and styles

  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [designs, setDesigns] = useState<string[]>([]);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Polling control
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollAttemptRef = useRef(0);
  // const pollAnalysisStatus = useCallback(async (requestId: string) => {
  const pollAnalysisStatus = useCallback(async (currentRequestId: string) => {
    try {
      const attempt = pollAttemptRef.current;

      // LOG 1: Kiểm tra thông tin đầu vào của nhịp Polling
      console.group(`🔍 Polling Attempt #${attempt}`);
      console.log("Request ID:", currentRequestId);
      console.log("Thời điểm gọi:", new Date().toLocaleTimeString());

      const response = await analysisApi.getTriggerStatus(currentRequestId);

      // LOG 2: Xem toàn bộ dữ liệu thô trả về từ Server
      console.log("Raw Response from Server:", response);

      if (!response || response.length === 0) {
        console.log("Kết quả: Mảng rỗng -> Tiếp tục chờ...");
        setLoadingMessage("Tình trạng: Đang chờ máy chủ AI tiếp nhận...");
        pollAttemptRef.current += 1;
        console.groupEnd();
        return;
      }

      const result = response[0];
      const statusFromAPI = result.status;
      const imagesFromAPI = result.design_image_url || [];

      // LOG 3: Phân tích trạng thái cụ thể
      console.log("Trạng thái nhận được:", statusFromAPI);
      console.log("Số lượng ảnh đang có:", imagesFromAPI.length);

      // Cập nhật loading message
      const messages: Record<string, string> = {
        PENDING: "Tình trạng: Đang nằm trong hàng đợi...",
        PROCESSING: "Tình trạng: AI đang render hình ảnh...",
        COMPLETED: "Tình trạng: Đã hoàn thiện thiết kế!",
        FAILED: "Tình trạng: Quá trình tạo mẫu thất bại.",
      };
      setLoadingMessage(
        messages[statusFromAPI] || `Tình trạng: ${statusFromAPI}`
      );

      // LOG 4: Kiểm tra điều kiện dừng
      if (statusFromAPI === "COMPLETED") {
        if (imagesFromAPI.length > 0) {
          console.log("✅ ĐIỀU KIỆN THÀNH CÔNG THỎA MÃN. Dừng Polling.");
          setDesigns(imagesFromAPI);
          setIsGenerating(false);
          setIsSuccess(true);

          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
          }
        } else {
          console.warn(
            "⚠️ Cảnh báo: Trạng thái là COMPLETED nhưng mảng ảnh rỗng!"
          );
        }
      } else if (statusFromAPI === "FAILED") {
        console.log("❌ Server báo FAILED. Dừng Polling.");
        setIsGenerating(false);
        setAnalysisError("Máy chủ AI gặp sự cố.");
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
        }
      }

      pollAttemptRef.current += 1;
      console.groupEnd(); // Kết thúc nhóm log
    } catch (err) {
      console.error("🚨 Polling Exception:", err);
      console.groupEnd();
      // ... logic catch error giữ nguyên
    }
  }, []);

  const isValid =
    selectedTrend !== null &&
    weather !== "" &&
    season !== "" &&
    audience !== "";
  const hasEnoughCredits = credits >= 10;

  /**
   * Start design generation
   */
  const startGeneration = useCallback(async () => {
    if (!isValid || !hasEnoughCredits) return;

    setIsGenerating(true);
    setLoadingMessage("Status: PENDING - Queuing design request...");
    setAnalysisError(null);
    setDesigns([]);
    setIsSuccess(false);

    pollAttemptRef.current = 0;

    try {
      // Consume credits immediately
      if (!consumeCredits(10)) {
        setIsGenerating(false);
        setAnalysisError("Insufficient credits for design generation");
        return;
      }
      const requestPayload: GenerateDesignRequest = {
        ...data,
        base_image_url: selectedTrend,
        target_season: season,
        target_audience: audience,
        target_weather: weather,
      };

      console.log(
        "start generate with id: ",
        requestId,
        ". And Starting generation with payload:",
        requestPayload
      );
      // Create analysis request
      const analysisRequest = await analysisApi.triggerGeneration(
        requestId,
        requestPayload
      );
      console.log("Analysis request created:", analysisRequest);

      // Start polling for status (every 1 second)
      setTimeout(() => {
        pollIntervalRef.current = setInterval(() => {
          void pollAnalysisStatus(requestId);
        }, 4000);
      }, 2000);

      // Initial poll immediately
      // void pollAnalysisStatus(requestId);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to start generation";
      setIsGenerating(false);
      setAnalysisError(errorMsg);
    }
  }, [
    isValid,
    hasEnoughCredits,
    selectedTrend,
    weather,
    season,
    audience,
    consumeCredits,
    pollAnalysisStatus,
  ]);

  const resetFlow = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    pollAttemptRef.current = 0;

    setSelectedTrend(null);
    setWeather("");
    setSeason("");
    setAudience("");
    setIsSuccess(false);
    setDesigns([]);
    setAnalysisError(null);
  };

  const clearError = useCallback(() => {
    setAnalysisError(null);
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
    weather,
    setWeather,
    season,
    setSeason,
    audience,
    setAudience,
    selectedTrend,
    setSelectedTrend,
    isGenerating,
    loadingMessage,
    isSuccess,
    isValid,
    hasEnoughCredits,
    startGeneration,
    resetFlow,
    designs,
    analysisError,
    clearError,
    // validCategories,
    // validStyles,
  };
}
