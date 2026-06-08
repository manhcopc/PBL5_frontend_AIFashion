import { useCallback, useEffect, useRef, useState } from "react";
import type { JobStatus } from "@/types/job";
import { normalizeJobStatus } from "@/utils/jobStatus";

interface UsePollingJobStatusOptions<TStatusResponse> {
  jobId?: string | null;
  enabled: boolean;
  fetchStatus: (jobId: string) => Promise<TStatusResponse | null | undefined>;
  getStatus?: (response: TStatusResponse) => string | JobStatus | null | undefined;
  intervalMs?: number;
  timeoutMs?: number;
  maxNetworkErrors?: number;
  onCompleted?: (response: TStatusResponse) => void;
  onFailed?: (response: TStatusResponse | null, errorMessage?: string) => void;
  onTimeout?: () => void;
  onUpdate?: (response: TStatusResponse, status: JobStatus) => void;
}

interface PollingState<TStatusResponse> {
  status: JobStatus;
  isPolling: boolean;
  error: string | null;
  elapsedMs: number;
  lastResponse: TStatusResponse | null;
  networkErrorCount: number;
}

export function usePollingJobStatus<TStatusResponse>({
  jobId,
  enabled,
  fetchStatus,
  getStatus,
  intervalMs = 3000,
  timeoutMs = 120000,
  maxNetworkErrors = 3,
  onCompleted,
  onFailed,
  onTimeout,
  onUpdate,
}: UsePollingJobStatusOptions<TStatusResponse>) {
  const [state, setState] = useState<PollingState<TStatusResponse>>({
    status: "queued",
    isPolling: false,
    error: null,
    elapsedMs: 0,
    lastResponse: null,
    networkErrorCount: 0,
  });

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stoppedRef = useRef(false);
  const startedAtRef = useRef<number>(0);
  const inFlightRef = useRef(false);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    stoppedRef.current = true;
    inFlightRef.current = false;
    clearTimer();
    setState((prev) => ({ ...prev, isPolling: false }));
  }, [clearTimer]);

  useEffect(() => {
    if (!enabled || !jobId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      stop();
      return;
    }

    stoppedRef.current = false;
    startedAtRef.current = Date.now();
    setState({
      status: "queued",
      isPolling: true,
      error: null,
      elapsedMs: 0,
      lastResponse: null,
      networkErrorCount: 0,
    });

    const scheduleNext = () => {
      clearTimer();
      if (!stoppedRef.current) {
        timeoutRef.current = setTimeout(() => {
          void poll();
        }, intervalMs);
      }
    };

    const poll = async () => {
      if (stoppedRef.current || inFlightRef.current) return;

      const elapsedMs = Date.now() - startedAtRef.current;
      if (elapsedMs >= timeoutMs) {
        stoppedRef.current = true;
        clearTimer();
        setState((prev) => ({
          ...prev,
          isPolling: false,
          status: "timeout",
          elapsedMs,
          error: "Polling timed out. Please try again later.",
        }));
        onTimeout?.();
        return;
      }

      inFlightRef.current = true;

      try {
        const response = await fetchStatus(jobId);
        if (stoppedRef.current) return;

        if (!response) {
          setState((prev) => ({
            ...prev,
            status: "processing",
            elapsedMs,
            error: null,
          }));
          scheduleNext();
          return;
        }

        const status = normalizeJobStatus(getStatus?.(response));
        onUpdate?.(response, status);

        setState((prev) => ({
          ...prev,
          status,
          isPolling: status === "queued" || status === "processing",
          elapsedMs,
          error: null,
          lastResponse: response,
          networkErrorCount: 0,
        }));

        if (status === "completed") {
          stoppedRef.current = true;
          clearTimer();
          onCompleted?.(response);
          return;
        }

        if (status === "failed") {
          stoppedRef.current = true;
          clearTimer();
          onFailed?.(response);
          return;
        }

        scheduleNext();
      } catch (error) {
        if (stoppedRef.current) return;

        const message =
          error instanceof Error ? error.message : "Unable to fetch job status.";

        setState((prev) => {
          const nextCount = prev.networkErrorCount + 1;
          const shouldFail = nextCount >= maxNetworkErrors;

          if (shouldFail) {
            stoppedRef.current = true;
            clearTimer();
            onFailed?.(prev.lastResponse, message);
          } else {
            scheduleNext();
          }

          return {
            ...prev,
            status: shouldFail ? "failed" : prev.status,
            isPolling: !shouldFail,
            elapsedMs,
            error: message,
            networkErrorCount: nextCount,
          };
        });
      } finally {
        inFlightRef.current = false;
      }
    };

    void poll();

    return () => {
      stoppedRef.current = true;
      inFlightRef.current = false;
      clearTimer();
    };
  }, [
    clearTimer,
    enabled,
    fetchStatus,
    getStatus,
    intervalMs,
    jobId,
    maxNetworkErrors,
    onCompleted,
    onFailed,
    onTimeout,
    onUpdate,
    stop,
    timeoutMs,
  ]);

  return {
    ...state,
    stop,
  };
}
