import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import analysisApi from "@/features/analysis/api";
import type {
  AnalysisRequestResponse,
  TriggerStatusResponse,
} from "@/features/analysis/analysis.types";
import { useJobStore } from "@/store/useJobStore";
import type { JobNotification, JobStatus, TrackedJob } from "@/types/job";
import { normalizeJobStatus } from "@/utils/jobStatus";

const JOB_POLL_INTERVAL_MS = 3000;
const JOB_TIMEOUT_MS = 120000;

interface ToastMessage {
  id: string;
  jobId: string;
  title: string;
  message: string;
  tone: "success" | "error" | "warning";
}

function extractTrendImages(response: AnalysisRequestResponse): string[] {
  const callbackImages =
    response.ai_callback_raw?.generated_designs?.map((item) => item.url) || [];

  return response.result_images?.length
    ? response.result_images
    : callbackImages;
}

function extractGenerationImages(response: TriggerStatusResponse[]): string[] {
  return response?.[0]?.design_image_url || [];
}

function createNotification(
  job: TrackedJob,
  status: Extract<JobStatus, "completed" | "failed" | "timeout">,
  message: string
): JobNotification {
  return {
    id: `${job.jobId}-${status}`,
    jobId: job.jobId,
    type: job.type,
    status,
    title: job.title,
    message,
    projectId: job.projectId,
    requestId: job.requestId,
    createdAt: new Date().toISOString(),
    read: false,
  };
}

export function GlobalJobWatcher() {
  const navigate = useNavigate();
  const jobs = useJobStore((state) => state.jobs);
  const updateJob = useJobStore((state) => state.updateJob);
  const markAsNotified = useJobStore((state) => state.markAsNotified);
  const addNotification = useJobStore((state) => state.addNotification);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const inFlightJobsRef = useRef<Set<string>>(new Set());

  const runningJobs = useMemo(
    () =>
      jobs.filter(
        (job) => job.status === "queued" || job.status === "processing"
      ),
    [jobs]
  );

  const pushToast = (toast: ToastMessage) => {
    setToasts((prev) => [toast, ...prev].slice(0, 3));
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== toast.id));
    }, 6000);
  };

  const handleViewJob = (jobId: string) => {
    const job = jobs.find((item) => item.jobId === jobId);
    if (!job) return;

    if (job.type === "trend_analysis" && job.status === "completed") {
      navigate("/create-design", {
        state: {
          requestId: job.requestId,
          projectId: job.projectId,
          generatedImages: job.resultImages || [],
          promptText: job.title,
        },
      });
      return;
    }

    if (job.type === "image_generation" && job.status === "completed") {
      navigate("/create-design", {
        state: {
          requestId: job.requestId,
          projectId: job.projectId,
          generatedResultImages: job.resultImages || [],
          openGeneratedResults: true,
        },
      });
      return;
    }

    if (job.projectId) {
      navigate(`/workspace/${job.projectId}`);
      return;
    }

    navigate("/design-studio");
  };

  useEffect(() => {
    jobs.forEach((job) => {
      if (
        (job.status === "completed" ||
          job.status === "failed" ||
          job.status === "timeout") &&
        !job.notified
      ) {
        const message =
          job.status === "completed"
            ? `${job.title} completed`
            : job.error || `${job.title} ${job.status}`;

        addNotification(
          createNotification(
            job,
            job.status,
            message
          )
        );
        pushToast({
          id: `${job.jobId}-${job.status}-restore`,
          jobId: job.jobId,
          title: job.status === "completed" ? "Task completed" : "Task failed",
          message,
          tone: job.status === "completed" ? "success" : "error",
        });
        markAsNotified(job.jobId);
      }
    });
  }, [addNotification, jobs, markAsNotified]);

  useEffect(() => {
    if (runningJobs.length === 0) return;

    const pollJob = async (job: TrackedJob) => {
      if (inFlightJobsRef.current.has(job.jobId)) return;

      const ageMs = Date.now() - new Date(job.createdAt).getTime();
      if (ageMs >= JOB_TIMEOUT_MS) {
        const message = `${job.title} timed out. Please retry later.`;
        updateJob(job.jobId, {
          status: "timeout",
          error: message,
          completedAt: new Date().toISOString(),
        });
        addNotification(createNotification(job, "timeout", message));
        pushToast({
          id: `${job.jobId}-timeout`,
          jobId: job.jobId,
          title: "Task timeout",
          message,
          tone: "warning",
        });
        markAsNotified(job.jobId);
        return;
      }

      inFlightJobsRef.current.add(job.jobId);

      try {
        if (job.type === "trend_analysis") {
          const response = await analysisApi.fetchTrendAnalysisStatus(
            job.requestId
          );
          const status = normalizeJobStatus(response?.status);

          if (status === "completed") {
            const images = extractTrendImages(response);
            const message = "Phân tích xu hướng đã hoàn tất";
            updateJob(job.jobId, {
              status,
              resultImages: images,
              completedAt: new Date().toISOString(),
              error: undefined,
            });
            addNotification(createNotification(job, "completed", message));
            pushToast({
              id: `${job.jobId}-completed`,
              jobId: job.jobId,
              title: "Trend analysis completed",
              message,
              tone: "success",
            });
            markAsNotified(job.jobId);
          } else if (status === "failed" || status === "timeout") {
            const message =
              response?.ai_callback_raw?.error ||
              "Trend analysis failed. Please retry.";
            updateJob(job.jobId, {
              status,
              error: message,
              completedAt: new Date().toISOString(),
            });
            addNotification(createNotification(job, status, message));
            pushToast({
              id: `${job.jobId}-failed`,
              jobId: job.jobId,
              title: "Trend analysis failed",
              message,
              tone: "error",
            });
            markAsNotified(job.jobId);
          } else {
            updateJob(job.jobId, {
              status,
              startedAt: job.startedAt || new Date().toISOString(),
            });
          }
        } else {
          const response = await analysisApi.fetchImageGenerationStatus(
            job.requestId
          );
          const firstResult = response?.[0];
          const status = normalizeJobStatus(firstResult?.status);

          if (status === "completed") {
            const images = extractGenerationImages(response);
            const message = "Sinh ảnh AI đã hoàn tất";
            updateJob(job.jobId, {
              status,
              resultImages: images,
              completedAt: new Date().toISOString(),
              error: images.length === 0 ? "No generated images returned." : undefined,
            });
            addNotification(createNotification(job, "completed", message));
            pushToast({
              id: `${job.jobId}-completed`,
              jobId: job.jobId,
              title: "Image generation completed",
              message,
              tone: "success",
            });
            markAsNotified(job.jobId);
          } else if (status === "failed" || status === "timeout") {
            const message = "Image generation failed. Please retry.";
            updateJob(job.jobId, {
              status,
              error: message,
              completedAt: new Date().toISOString(),
            });
            addNotification(createNotification(job, status, message));
            pushToast({
              id: `${job.jobId}-failed`,
              jobId: job.jobId,
              title: "Image generation failed",
              message,
              tone: "error",
            });
            markAsNotified(job.jobId);
          } else {
            updateJob(job.jobId, {
              status,
              startedAt: job.startedAt || new Date().toISOString(),
            });
          }
        }
      } catch (error) {
        updateJob(job.jobId, {
          error:
            error instanceof Error
              ? error.message
              : "Unable to refresh job status.",
        });
      } finally {
        inFlightJobsRef.current.delete(job.jobId);
      }
    };

    const tick = () => {
      runningJobs.forEach((job) => {
        void pollJob(job);
      });
    };

    tick();
    const intervalId = window.setInterval(tick, JOB_POLL_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [addNotification, markAsNotified, runningJobs, updateJob]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed right-6 top-24 z-[120] flex w-[340px] flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-2xl border bg-white p-4 shadow-xl ${
            toast.tone === "success"
              ? "border-emerald-100"
              : toast.tone === "warning"
                ? "border-amber-100"
                : "border-rose-100"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-extrabold text-zinc-900">
                {toast.title}
              </p>
              <p className="mt-1 text-xs font-medium text-zinc-500">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() =>
                setToasts((prev) =>
                  prev.filter((item) => item.id !== toast.id)
                )
              }
              className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {toast.jobId && (
            <button
              onClick={() => {
                handleViewJob(toast.jobId);
                setToasts((prev) =>
                  prev.filter((item) => item.id !== toast.id)
                );
              }}
              className="mt-3 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-indigo-700"
            >
              {toast.tone === "success" ? "Xem kết quả" : "Mở tác vụ"}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
