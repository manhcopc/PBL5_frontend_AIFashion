import { useState, useCallback, useEffect, useRef } from "react";
import analysisApi from "@/features/analysis/api";
import { transformDesignResults } from "@/features/analysis/mappers/analysisMapper";
import { useUserStore } from "@/store/UserContext";
import { trendApi } from "@/features/trend/api";
import { styleApi } from "@/features/style/api";
import type { StylePresetResponse } from "@/features/style/style.types";

/**
 * Hook: useGenerationFlow
 *
 * Manages the complete design generation workflow:
 * 1. User selects trend, category, and styles
 * 2. Initiates design generation via API
 * 3. Polls for status with progressive messages
 * 4. Returns results when generation completes
 */
export function useGenerationFlow(requestId: string) {
  const { credits, consumeCredits } = useUserStore();

  const [selectedTrend, setSelectedTrend] = useState<string | null>(null);
  // const [category, setCategory] = useState<string>("");
  // const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [weather, setWeather] = useState<string>("");
  const [season, setSeason] = useState<string>("");
  const [audience, setAudience] = useState<string>("");

  // Validate available categories and styles
  const [validCategories, setValidCategories] = useState<string[]>([]);
  const [validStyles, setValidStyles] = useState<StylePresetResponse[]>([]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [designs, setDesigns] = useState<string[]>([]);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Polling control
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollAttemptRef = useRef(0);

  // Fetch valid categories and styles on mount

  // const toggleStyle = (style: string) => {
  //   setSelectedStyles((prev) =>
  //     prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
  //   );
  // };

  /**
   * Poll for analysis status and update loading message
   */
  const pollAnalysisStatus = useCallback(async (requestId: string) => {
    try {
      const attempt = pollAttemptRef.current;
      const status = await analysisApi.getAnalysisStatus(requestId, attempt);

      // Update loading message based on status progression
      const messages: Record<string, string> = {
        PENDING: "Status: PENDING - Queuing design request...",
        PROCESSING: "Status: PROCESSING - Analyzing trends with AI...",
        COMPLETED: "Status: COMPLETED - Rendering final designs...",
        FAILED: "Status: FAILED - Generation encountered an error",
      };

      setLoadingMessage(messages[status.status] || status.status);

      // If completed, fetch results and stop polling
      if (status.status === "COMPLETED") {
        const designResults = await analysisApi.getDesignResults(requestId);
        const transformed = transformDesignResults(designResults);

        setDesigns(transformed.map((d) => d.imageUrl)); // Chỉ lấy URL để hiển thị
        setIsGenerating(false);
        setIsSuccess(true);

        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
        }
      } else if (status.status === "FAILED") {
        setIsGenerating(false);
        setAnalysisError("Design generation failed. Please try again.");

        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
        }
      }

      pollAttemptRef.current += 1;
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to poll status";
      setAnalysisError(errorMsg);

      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
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

      // Create analysis request
      const analysisRequest = await analysisApi.triggerGeneration(requestId);

      // Start polling for status (every 1 second)
      pollIntervalRef.current = setInterval(() => {
        void pollAnalysisStatus(analysisRequest._id);
      }, 1000);

      // Initial poll immediately
      void pollAnalysisStatus(analysisRequest._id);
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
    validCategories,
    validStyles,
  };
}
