export type JobType = "trend_analysis" | "image_generation";

export type JobStatus =
  | "queued"
  | "processing"
  | "completed"
  | "failed"
  | "timeout";

export interface JobStatusPayload {
  jobId: string;
  status: JobStatus;
  startedAt?: string;
  updatedAt?: string;
  error?: string;
}

export interface TrackedJob {
  jobId: string;
  requestId: string;
  type: JobType;
  status: JobStatus;
  title: string;
  projectId?: string;
  campaignId?: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  resultUrl?: string;
  resultImages?: string[];
  error?: string;
  notified?: boolean;
}

export interface JobNotification {
  id: string;
  jobId: string;
  type: JobType;
  status: Extract<JobStatus, "completed" | "failed" | "timeout">;
  title: string;
  message: string;
  projectId?: string;
  requestId?: string;
  createdAt: string;
  read: boolean;
}
