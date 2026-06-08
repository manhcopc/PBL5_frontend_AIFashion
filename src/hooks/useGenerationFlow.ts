import { useState, useCallback } from "react";
import analysisApi from "@/features/analysis/api";
import { useUserStore } from "@/store/UserContext";
import { useJobStore } from "@/store/useJobStore";
import type { GenerateDesignRequest } from "@/features/analysis/analysis.types";
import type { JobStatus } from "@/types/job";
import { normalizeJobStatus } from "@/utils/jobStatus";

type InitialGenerationData = Omit<
  GenerateDesignRequest,
  "target_season" | "target_audience" | "target_weather"
>;

export function useGenerationFlow(
  requestId: string,
  data: InitialGenerationData,
  projectId?: string
) {
  const { credits, consumeCredits } = useUserStore();
  const addJob = useJobStore((state) => state.addJob);
  const jobs = useJobStore((state) => state.jobs);

  const [selectedTrend, setSelectedTrend] = useState<string | null>(null);
  const [weather, setWeather] = useState<string>("");
  const [season, setSeason] = useState<string>("");
  const [audience, setAudience] = useState<string>("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [jobStatus, setJobStatus] = useState<JobStatus>("queued");
  const [jobStartedAt, setJobStartedAt] = useState<string | null>(null);
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);
  const [chargedRequestId, setChargedRequestId] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [designs, setDesigns] = useState<string[]>([]);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const activeJob = jobs.find(
    (job) =>
      job.type === "image_generation" && job.requestId === activeRequestId
  );

  const statusMessages: Record<JobStatus, string> = {
    queued: "Tình trạng: Đang nằm trong hàng đợi...",
    processing: "Tình trạng: AI đang render hình ảnh...",
    completed: "Tình trạng: Đã hoàn thiện thiết kế!",
    failed: "Tình trạng: Quá trình tạo mẫu thất bại.",
    timeout: "Tình trạng: Quá trình tạo mẫu quá thời gian chờ.",
  };

  const derivedJobStatus = activeJob?.status || jobStatus;
  const derivedIsGenerating = activeJob
    ? activeJob.status === "queued" || activeJob.status === "processing"
    : isGenerating;
  const derivedIsSuccess =
    activeJob?.status === "completed" ? true : isSuccess;
  const derivedDesigns =
    activeJob?.status === "completed" ? activeJob.resultImages || [] : designs;
  const derivedError =
    activeJob?.status === "failed" || activeJob?.status === "timeout"
      ? activeJob.error ||
        (activeJob.status === "timeout"
          ? "Image generation timed out. Please retry later."
          : "Image generation failed. Please retry.")
      : analysisError;
  const derivedLoadingMessage = activeJob
    ? statusMessages[activeJob.status]
    : loadingMessage;
  const derivedStartedAt = activeJob?.startedAt || activeJob?.createdAt || jobStartedAt;

  const isValid =
    selectedTrend !== null &&
    weather !== "" &&
    season !== "" &&
    audience !== "";

  const hasEnoughCredits = credits >= 10 || chargedRequestId === requestId;

  const startGeneration = useCallback(async () => {
    if (!isValid || !requestId) return;
    if (!hasEnoughCredits) return;

    setIsGenerating(true);
    setJobStatus("queued");
    setLoadingMessage("Status: queued - Queuing design request...");
    setAnalysisError(null);
    setDesigns([]);
    setIsSuccess(false);

    try {
      if (chargedRequestId !== requestId) {
        if (!consumeCredits(10)) {
          setIsGenerating(false);
          setAnalysisError("Insufficient credits for design generation");
          return;
        }
        setChargedRequestId(requestId);
      }

      const requestPayload: GenerateDesignRequest = {
        ...data,
        base_image_url: selectedTrend || undefined,
        target_season: season,
        target_audience: audience,
        target_weather: weather,
      };

      const job = await analysisApi.createImageGenerationJob(
        requestId,
        requestPayload
      );

      const nextRequestId = job.requestId || requestId;
      const startedAt = job.startedAt || new Date().toISOString();

      setActiveRequestId(nextRequestId);
      setJobStartedAt(startedAt);
      setJobStatus("queued");

      addJob({
        jobId: job.jobId || nextRequestId,
        requestId: nextRequestId,
        type: "image_generation",
        status: normalizeJobStatus(job.status),
        title: "Image generation",
        projectId,
        createdAt: new Date().toISOString(),
        startedAt,
      });
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to start generation";
      setIsGenerating(false);
      setJobStatus("failed");
      setAnalysisError(errorMsg);
    }
  }, [
    addJob,
    chargedRequestId,
    consumeCredits,
    data,
    hasEnoughCredits,
    isValid,
    projectId,
    requestId,
    selectedTrend,
    season,
    audience,
    weather,
  ]);

  const resetFlow = useCallback(() => {
    setSelectedTrend(null);
    setWeather("");
    setSeason("");
    setAudience("");
    setIsGenerating(false);
    setJobStatus("queued");
    setJobStartedAt(null);
    setActiveRequestId(null);
    setIsSuccess(false);
    setDesigns([]);
    setAnalysisError(null);
    setLoadingMessage("");
  }, []);

  const clearError = useCallback(() => {
    setAnalysisError(null);
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
    isGenerating: derivedIsGenerating,
    jobStatus: derivedJobStatus,
    jobStartedAt: derivedStartedAt,
    elapsedMs: 0,
    loadingMessage: derivedLoadingMessage,
    isSuccess: derivedIsSuccess,
    isValid,
    hasEnoughCredits,
    startGeneration,
    retryGeneration: startGeneration,
    resetFlow,
    designs: derivedDesigns,
    analysisError: derivedError,
    clearError,
  };
}
