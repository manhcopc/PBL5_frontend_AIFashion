import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { JobNotification, TrackedJob } from "@/types/job";

const ACTIVE_JOBS_STORAGE_KEY = "active_jobs";

interface JobState {
  jobs: TrackedJob[];
  notifications: JobNotification[];
  addJob: (job: TrackedJob) => void;
  updateJob: (jobId: string, updates: Partial<TrackedJob>) => void;
  removeJob: (jobId: string) => void;
  markAsNotified: (jobId: string) => void;
  clearCompletedJobs: () => void;
  getRunningJobs: () => TrackedJob[];
  addNotification: (notification: JobNotification) => void;
  markNotificationsRead: () => void;
  clearJobStore: () => void;
}

export const useJobStore = create<JobState>()(
  persist(
    (set, get) => ({
      jobs: [],
      notifications: [],

      addJob: (job) =>
        set((state) => {
          const existing = state.jobs.find((item) => item.jobId === job.jobId);
          if (existing) {
            return {
              jobs: state.jobs.map((item) =>
                item.jobId === job.jobId ? { ...item, ...job } : item
              ),
            };
          }

          return { jobs: [job, ...state.jobs] };
        }),

      updateJob: (jobId, updates) =>
        set((state) => ({
          jobs: state.jobs.map((job) =>
            job.jobId === jobId ? { ...job, ...updates } : job
          ),
        })),

      removeJob: (jobId) =>
        set((state) => ({
          jobs: state.jobs.filter((job) => job.jobId !== jobId),
        })),

      markAsNotified: (jobId) =>
        set((state) => ({
          jobs: state.jobs.map((job) =>
            job.jobId === jobId ? { ...job, notified: true } : job
          ),
        })),

      clearCompletedJobs: () =>
        set((state) => ({
          jobs: state.jobs.filter(
            (job) => job.status === "queued" || job.status === "processing"
          ),
        })),

      getRunningJobs: () =>
        get().jobs.filter(
          (job) => job.status === "queued" || job.status === "processing"
        ),

      addNotification: (notification) =>
        set((state) => {
          const exists = state.notifications.some(
            (item) => item.id === notification.id
          );

          if (exists) return state;

          return {
            notifications: [notification, ...state.notifications].slice(0, 50),
          };
        }),

      markNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((notification) => ({
            ...notification,
            read: true,
          })),
        })),

      clearJobStore: () =>
        set({
          jobs: [],
          notifications: [],
        }),
    }),
    {
      name: ACTIVE_JOBS_STORAGE_KEY,
    }
  )
);
