import { useCallback, useState } from "react";
import analysisApi from "@/features/analysis/api";
import { useJobStore } from "@/store/useJobStore";
import type { JobStatus } from "@/types/job";
import { normalizeJobStatus } from "@/utils/jobStatus";

export type GenerationState =
  | "PENDING"
  | "ERROR"
  | "SUCCESS"
  | "LOADING";

interface AnalysisPayload {
  project_id: string;
  category_name: string;
}

export function useDesignGeneration() {
  const addJob = useJobStore((state) => state.addJob);
  const removeJob = useJobStore((state) => state.removeJob);
  const jobs = useJobStore((state) => state.jobs);
  const [status, setStatus] = useState<GenerationState>("PENDING");
  const [jobStatus, setJobStatus] = useState<JobStatus>("queued");
  const [designs, setDesigns] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentRequestId, setCurrentRequestId] = useState<string | null>(null);
  const [jobStartedAt, setJobStartedAt] = useState<string | null>(null);
  const [lastPayload, setLastPayload] = useState<AnalysisPayload | null>(null);

  const currentJob = jobs.find(
    (job) => job.type === "trend_analysis" && job.requestId === currentRequestId
  );

  const derivedJobStatus = currentJob?.status || jobStatus;
  const derivedStatus: GenerationState = currentJob
    ? currentJob.status === "queued" || currentJob.status === "processing"
      ? "LOADING"
      : currentJob.status === "completed"
        ? "SUCCESS"
        : "ERROR"
    : status;
  const derivedDesigns =
    currentJob?.status === "completed" ? currentJob.resultImages || [] : designs;
  const derivedError =
    currentJob?.status === "failed" || currentJob?.status === "timeout"
      ? currentJob.error ||
        (currentJob.status === "timeout"
          ? "Trend analysis timed out. Please retry later."
          : "Trend analysis failed. Please retry.")
      : error;
  const derivedStartedAt = currentJob?.startedAt || currentJob?.createdAt || jobStartedAt;

  const generateDesigns = useCallback(
    async (analysisData?: AnalysisPayload) => {
      const payload = analysisData || {
        project_id: "default-project",
        category_name: "Dresses",
      };

      setStatus("LOADING");
      setJobStatus("queued");
      setError(null);
      setDesigns([]);
      setLastPayload(payload);

      try {
        const job = await analysisApi.createTrendAnalysisJob(payload);
        const requestId = job.requestId || job.jobId;

        if (!requestId) {
          throw new Error("Backend did not return a requestId/jobId.");
        }

        setCurrentRequestId(requestId);
        setJobStartedAt(job.startedAt || new Date().toISOString());

        addJob({
          jobId: job.jobId || requestId,
          requestId,
          type: "trend_analysis",
          status: normalizeJobStatus(job.status),
          title: `Trend analysis: ${payload.category_name}`,
          projectId: payload.project_id,
          createdAt: new Date().toISOString(),
          startedAt: job.startedAt || new Date().toISOString(),
        });
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Failed to create analysis job.";
        setError(errorMsg);
        setStatus("ERROR");
        setJobStatus("failed");
      }
    },
    [addJob]
  );

  const retry = useCallback(async () => {
    await generateDesigns(lastPayload || undefined);
  }, [generateDesigns, lastPayload]);

  const resetStudio = useCallback(() => {
    setStatus("PENDING");
    setJobStatus("queued");
    setDesigns([]);
    setError(null);
    setCurrentRequestId(null);
    setJobStartedAt(null);
  }, []);

  const cancelGeneration = useCallback(async () => {
    if (currentJob) {
      removeJob(currentJob.jobId);
    }

    if (currentRequestId) {
      try {
        await analysisApi.deleteAnalysisRequest(currentRequestId);
      } catch (err) {
        console.error("Failed to cancel analysis:", err);
      }
    }

    resetStudio();
  }, [currentJob, currentRequestId, removeJob, resetStudio]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    status: derivedStatus,
    jobStatus: derivedJobStatus,
    jobStartedAt: derivedStartedAt,
    elapsedMs: 0,
    isPolling:
      currentJob?.status === "queued" || currentJob?.status === "processing",
    designs: derivedDesigns,
    error: derivedError,
    currentRequestId,
    generateDesigns,
    retry,
    resetStudio,
    cancelGeneration,
    clearError,
  };
}
