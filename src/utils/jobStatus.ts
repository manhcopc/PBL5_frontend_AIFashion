import type { JobStatus } from "@/types/job";

const queuedStatuses = new Set(["queued", "queue", "pending", "created"]);
const processingStatuses = new Set([
  "processing",
  "running",
  "in_progress",
  "generating",
  "generating_images",
  "analyzing",
  "started",
]);
const completedStatuses = new Set(["completed", "complete", "success", "succeeded", "done"]);
const failedStatuses = new Set(["failed", "failure", "error", "cancelled", "canceled", "timeout"]);

export function normalizeJobStatus(status?: string | null): JobStatus {
  const normalized = String(status || "queued").trim().toLowerCase();

  if (queuedStatuses.has(normalized)) return "queued";
  if (processingStatuses.has(normalized)) return "processing";
  if (completedStatuses.has(normalized)) return "completed";
  if (normalized === "timeout") return "timeout";
  if (failedStatuses.has(normalized)) return "failed";

  return "processing";
}

export function getJobStatusLabel(status: JobStatus): string {
  const labels: Record<JobStatus, string> = {
    queued: "Queued",
    processing: "Processing",
    completed: "Completed",
    failed: "Failed",
    timeout: "Timeout",
  };

  return labels[status];
}
