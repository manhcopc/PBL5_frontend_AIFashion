import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Plus,
  Download,
  Loader2,
  Clock,
  AlertCircle,
  Eye,
  Image as ImageIcon,
  XCircle,
  X,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useProjects } from "@/hooks/useProjects";
import type { ProjectRequestSummary } from "@/features/project/project.types";
import { useJobStore } from "@/store/useJobStore";
import type { TrackedJob } from "@/types/job";

type TabType = "requests" | "gallery";

interface RequestCardProps {
  request: ProjectRequestSummary;
  loadingMessage?: string;
  onView?: (request: ProjectRequestSummary) => void;
}

function mapJobToRequestSummary(job: TrackedJob): ProjectRequestSummary {
  const statusMap: Record<TrackedJob["status"], ProjectRequestSummary["status"]> = {
    queued: "PENDING",
    processing: "GENERATING_IMAGES",
    completed: "COMPLETED",
    failed: "FAILED",
    timeout: "FAILED",
  };

  return {
    request_id: job.requestId,
    category_name:
      job.type === "trend_analysis" ? "Trend Analysis" : "Image Generation",
    style_name: job.title,
    status: statusMap[job.status],
    created_at: job.createdAt,
    result_thumbnail_url: job.resultImages || null,
    payload: undefined,
  };
}

const payloadLabels: Array<{
  key: keyof NonNullable<ProjectRequestSummary["payload"]>;
  label: string;
}> = [
  { key: "target_style_prompt", label: "Style prompt" },
  { key: "target_season", label: "Season" },
  { key: "target_audience", label: "Audience" },
  { key: "target_weather", label: "Weather" },
  { key: "num_images", label: "Number of images" },
  { key: "seed", label: "Seed" },
];

function RequestDetailModal({
  request,
  onClose,
}: {
  request: ProjectRequestSummary | null;
  onClose: () => void;
}) {
  if (!request) return null;

  const images = request.result_thumbnail_url || [];
  const payload = request.payload || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/50 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-zinc-100 px-6 py-5">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-zinc-400">
              Request details
            </p>
            <h2 className="mt-1 text-2xl font-extrabold text-zinc-900">
              {request.category_name}
            </h2>
            <p className="mt-1 text-sm font-medium text-zinc-500">
              ID: {request.request_id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
            aria-label="Close request details"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-0 overflow-y-auto lg:grid-cols-[1.35fr_0.65fr]">
          <section className="border-b border-zinc-100 p-6 lg:border-b-0 lg:border-r">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500">
                Generated images ({images.length})
              </h3>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                {request.status}
              </span>
            </div>

            {images.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {images.slice(0, 4).map((url, index) => (
                  <a
                    key={`${url}-${index}`}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 shadow-sm"
                  >
                    <img
                      src={url}
                      alt={`Generated design ${index + 1}`}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-zinc-700 shadow-sm">
                      #{index + 1}
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 text-center">
                <ImageIcon className="mb-3 h-10 w-10 text-zinc-300" />
                <p className="text-sm font-bold text-zinc-700">
                  No generated images available
                </p>
              </div>
            )}
          </section>

          <aside className="p-6">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-500">
              Generation payload
            </h3>
            <div className="space-y-3">
              {payloadLabels.map(({ key, label }) => {
                const value = payload[key];
                return (
                  <div
                    key={key}
                    className="rounded-xl border border-zinc-200 bg-zinc-50 p-3"
                  >
                    <p className="text-[11px] font-black uppercase tracking-wider text-zinc-400">
                      {label}
                    </p>
                    <p className="mt-1 break-words text-sm font-semibold text-zinc-900">
                      {value === undefined || value === null || value === ""
                        ? "N/A"
                        : String(value)}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
              <p className="text-sm font-bold text-indigo-900">
                These parameters explain why this image set was generated.
              </p>
              <p className="mt-1 text-xs leading-relaxed text-indigo-700">
                The style prompt, season, audience, weather, image count, and
                seed are the inputs sent to the AI generation request.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

// ==================== COMPLETED REQUEST CARD ====================
function CompletedRequestCard({ request, onView }: RequestCardProps) {
  const imageUrl =
    request.result_thumbnail_url && request.result_thumbnail_url.length > 0
      ? request.result_thumbnail_url[0]
      : "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&auto=format&fit=crop&q=60";

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden group shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
      {/* Image Preview Area */}
      <div className="relative aspect-[3/4] bg-zinc-100 overflow-hidden">
        <img
          src={imageUrl}
          alt={request.request_id}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-zinc-900/0 group-hover:bg-zinc-900/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-[1px]">
          <a
            href={imageUrl}
            download
            target="_blank"
            rel="noreferrer"
            className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg transform scale-75 group-hover:scale-100 transition-all duration-300"
          >
            <Download className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider truncate max-w-[120px]">
              ID: {request.request_id}
            </p>
            <p className="text-xs text-zinc-500 mt-0.5 font-medium">
              {new Date(request.created_at).toLocaleDateString("vi-VN")}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-xs font-bold">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            Completed
          </span>
        </div>

        <div className="flex-1">
          <p className="text-xs text-zinc-600 leading-relaxed">
            <span className="font-bold text-zinc-400 uppercase text-[10px] tracking-wider block mb-0.5">
              Category
            </span>
            <span className="text-zinc-900 font-medium">
              {request.category_name}
            </span>
            <br />
            <span className="font-bold text-zinc-400 uppercase text-[10px] tracking-wider block mt-1.5 mb-0.5">
              Style
            </span>
            <span className="text-zinc-900 font-medium">
              {request.style_name}
            </span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-3 border-t border-zinc-100">
          <button
            onClick={() => onView?.(request)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 rounded-lg text-xs font-bold transition-all active:scale-95 border border-zinc-200"
          >
            <Eye className="w-3.5 h-3.5 text-zinc-500" />
            View
          </button>
          <a
            href={imageUrl}
            download
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition-all active:scale-95 border border-indigo-100"
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </a>
        </div>
      </div>
    </div>
  );
}

// ==================== GENERATING REQUEST CARD ====================
function GeneratingRequestCard({ request, loadingMessage }: RequestCardProps) {
  return (
    <div className="bg-white border-2 border-dashed border-blue-200 rounded-2xl overflow-hidden flex flex-col h-full shadow-sm">
      {/* Loading Animation Area */}
      <div className="relative aspect-[3/4] bg-blue-50/40 flex flex-col items-center justify-center gap-4 border-b border-zinc-100">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <div className="text-center px-4 animate-pulse">
          <p className="text-blue-700 font-extrabold text-sm tracking-wider uppercase">
            ⚡ AI Rendering
          </p>
          <p className="text-blue-600/80 text-xs mt-1.5 font-semibold px-2">
            {loadingMessage || "Processing your design..."}
          </p>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider truncate max-w-[120px]">
              ID: {request.request_id}
            </p>
            <p className="text-xs text-zinc-500 mt-0.5 font-medium">
              {new Date(request.created_at).toLocaleDateString("vi-VN")}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-xs font-bold">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping" />
            Generating
          </span>
        </div>

        <div className="flex-1">
          <p className="text-xs text-zinc-600 leading-relaxed">
            <span className="font-bold text-zinc-400 uppercase text-[10px] tracking-wider block mb-0.5">
              Category
            </span>
            <span className="text-zinc-900 font-medium">
              {request.category_name}
            </span>
            <br />
            <span className="font-bold text-zinc-400 uppercase text-[10px] tracking-wider block mt-1.5 mb-0.5">
              Style
            </span>
            <span className="text-zinc-900 font-medium">
              {request.style_name}
            </span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-3 border-t border-zinc-100">
          <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-bold transition-all active:scale-95 border border-rose-100">
            ✕ Cancel
          </button>
          <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition-all active:scale-95 border border-blue-100">
            <Clock className="w-3.5 h-3.5" />
            Monitor
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== PENDING REQUEST CARD ====================
function PendingRequestCard({ request }: RequestCardProps) {
  return (
    <div className="bg-white border-2 border-dashed border-amber-200 rounded-2xl overflow-hidden flex flex-col h-full shadow-sm">
      {/* Waiting Area */}
      <div className="relative aspect-[3/4] bg-amber-50/30 flex flex-col items-center justify-center gap-4 border-b border-zinc-100">
        <Clock className="w-10 h-10 text-amber-600 animate-pulse" />
        <div className="text-center px-4">
          <p className="text-amber-700 font-extrabold text-sm tracking-wider uppercase">
            ⏳ In Queue
          </p>
          <p className="text-amber-600/80 text-xs mt-1.5 font-semibold">
            Waiting for AI server availability...
          </p>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider truncate max-w-[120px]">
              ID: {request.request_id}
            </p>
            <p className="text-xs text-zinc-500 mt-0.5 font-medium">
              {new Date(request.created_at).toLocaleDateString("vi-VN")}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-full text-xs font-bold">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
            Pending
          </span>
        </div>

        <div className="flex-1">
          <p className="text-xs text-zinc-600 leading-relaxed">
            <span className="font-bold text-zinc-400 uppercase text-[10px] tracking-wider block mb-0.5">
              Category
            </span>
            <span className="text-zinc-900 font-medium">
              {request.category_name}
            </span>
            <br />
            <span className="font-bold text-zinc-400 uppercase text-[10px] tracking-wider block mt-1.5 mb-0.5">
              Style
            </span>
            <span className="text-zinc-900 font-medium">
              {request.style_name}
            </span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-3 border-t border-zinc-100">
          <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 rounded-lg text-xs font-bold transition-all active:scale-95 border border-zinc-200">
            ✕ Remove
          </button>
          <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg text-xs font-bold transition-all active:scale-95 border border-amber-100">
            <AlertCircle className="w-3.5 h-3.5" />
            Priority
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== FAILED REQUEST CARD ====================
function FailedRequestCard({ request }: RequestCardProps) {
  return (
    <div className="bg-white border border-rose-200 rounded-2xl overflow-hidden flex flex-col h-full shadow-sm">
      {/* Error Area */}
      <div className="relative aspect-[3/4] bg-rose-50/50 flex flex-col items-center justify-center gap-3 border-b border-rose-100">
        <XCircle className="w-10 h-10 text-rose-500" />
        <div className="text-center px-4">
          <p className="text-rose-700 font-extrabold text-sm tracking-wider uppercase">
            ❌ Generation Failed
          </p>
          <p className="text-rose-600/80 text-xs mt-1.5 font-medium px-4">
            System timeout or invalid prompt guide.
          </p>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider truncate max-w-[120px]">
              ID: {request.request_id}
            </p>
            <p className="text-xs text-zinc-500 mt-0.5 font-medium">
              {new Date(request.created_at).toLocaleDateString("vi-VN")}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-100 rounded-full text-xs font-bold">
            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
            Failed
          </span>
        </div>

        <div className="flex-1">
          <p className="text-xs text-zinc-600 leading-relaxed">
            <span className="font-bold text-zinc-400 uppercase text-[10px] tracking-wider block mb-0.5">
              Category
            </span>
            <span className="text-zinc-900 font-medium">
              {request.category_name}
            </span>
            <br />
            <span className="font-bold text-zinc-400 uppercase text-[10px] tracking-wider block mt-1.5 mb-0.5">
              Style
            </span>
            <span className="text-zinc-900 font-medium">
              {request.style_name}
            </span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-3 border-t border-zinc-100">
          <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 rounded-lg text-xs font-bold transition-all active:scale-95 border border-zinc-200">
            Dismiss
          </button>
          <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all active:scale-95">
            Retry
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== REQUEST CARD ROUTER ====================
function RequestCard({ request, loadingMessage, onView }: RequestCardProps) {
  switch (request.status) {
    case "COMPLETED":
      return <CompletedRequestCard request={request} onView={onView} />;
    case "GENERATING_IMAGES":
      return (
        <GeneratingRequestCard
          request={request}
          loadingMessage={loadingMessage}
        />
      );
    case "PENDING":
      return <PendingRequestCard request={request} />;
    case "FAILED":
      return <FailedRequestCard request={request} />;
    default:
      return null;
  }
}

// ==================== MAIN COMPONENT ====================
export default function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const [activeTab, setActiveTab] = useState<TabType>("requests");
  const [selectedRequest, setSelectedRequest] =
    useState<ProjectRequestSummary | null>(null);
  const {
    detailSummary,
    fetchProjectDetails,
    projectDetails,
    isLoading,
    error,
  } = useProjects();
  const trackedJobs = useJobStore((state) => state.jobs);

  useEffect(() => {
    if (projectId) {
      fetchProjectDetails(projectId);
    }
  }, [fetchProjectDetails, projectId]);

  const [loadingMessage] = useState(
    "Status: ANALYZING_AI - Scoring styles with PhoBERT..."
  );

  const projectJobs = trackedJobs.filter(
    (job) => job.projectId === projectId && job.type === "image_generation"
  );
  const backendRequestIds = new Set(
    (detailSummary || []).map((request) => request.request_id)
  );
  const trackedSummaries = projectJobs
    .filter((job) => !backendRequestIds.has(job.requestId))
    .map(mapJobToRequestSummary);
  const displayedSummary = [...trackedSummaries, ...(detailSummary || [])];

  // Lấy ra toàn bộ danh sách ảnh đã được tạo thành công để đổ vào tab Gallery thực tế
  const galleryImages = displayedSummary
    .filter((req) => req.status === "COMPLETED" && req.result_thumbnail_url)
    .flatMap((req) => req.result_thumbnail_url || []);

  // KHÔI PHỤC LOGIC LOADING: Mang lại trải nghiệm UX mượt mà tránh giật lag layout dữ liệu cũ
  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-zinc-500 font-medium text-sm animate-pulse">
          Loading project details...
        </p>
      </div>
    );
  }

  // GIAO DIỆN KHI CÓ LỖI XẢY RA TỪ HOOK
  if (error) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center gap-4 px-6 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500" />
        <div>
          <p className="text-xl font-bold text-zinc-900">
            Failed to load project
          </p>
          <p className="text-sm text-zinc-500 mt-1 max-w-sm">{error.message}</p>
        </div>
        <Link
          to="/workspace"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Workspace
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans">
      <RequestDetailModal
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
      />

      {/* Header Navigation */}
      <header className="border-b border-zinc-200 bg-white/70 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Link
            to="/workspace"
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors mb-4 font-bold text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Workspace
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-4xl font-extrabold text-zinc-900 mb-2 tracking-tight">
                {projectDetails?.project_name || "Project Details"}
              </h1>
              <p className="text-zinc-500 text-lg">
                {projectDetails?.description ||
                  "Manage your design requests and assets"}
              </p>
            </div>

            <button className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md shadow-indigo-100 active:scale-95 whitespace-nowrap">
              <Plus className="w-5 h-5" />
              New Design Request
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Tab Navigation */}
        <div className="flex gap-8 border-b border-zinc-200 mb-10">
          <button
            onClick={() => setActiveTab("requests")}
            className={`pb-4 font-bold transition-all relative text-sm uppercase tracking-wider ${
              activeTab === "requests"
                ? "text-indigo-600"
                : "text-zinc-400 hover:text-zinc-600"
            }`}
          >
            Request History ({displayedSummary.length})
            {activeTab === "requests" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("gallery")}
            className={`pb-4 font-bold transition-all relative text-sm uppercase tracking-wider ${
              activeTab === "gallery"
                ? "text-indigo-600"
                : "text-zinc-400 hover:text-zinc-600"
            }`}
          >
            Asset Gallery ({galleryImages.length})
            {activeTab === "gallery" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t" />
            )}
          </button>
        </div>

        {/* Request History Tab - Visual Grid Layout */}
        {activeTab === "requests" && (
          <>
            {displayedSummary.length === 0 ? (
              <div className="bg-white border border-zinc-200 rounded-2xl p-12 text-center shadow-sm">
                <ImageIcon className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
                <p className="text-base font-bold text-zinc-700">
                  No requests found
                </p>
                <p className="text-xs text-zinc-400 mt-1">
                  Create your first design request to see history data.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayedSummary.map((request) => (
                  <RequestCard
                    key={request.request_id}
                    request={request}
                    loadingMessage={loadingMessage}
                    onView={setSelectedRequest}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Asset Gallery Tab */}
        {activeTab === "gallery" && (
          <>
            {galleryImages.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-zinc-200 rounded-3xl p-16 text-center shadow-sm">
                <div className="max-w-md mx-auto">
                  <ImageIcon className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
                  <p className="text-xl font-bold text-zinc-900 mb-2">
                    Gallery is Empty
                  </p>
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    Once your design requests status becomes "Completed", their
                    generated assets will automatically appear inside this
                    space.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {galleryImages.map((url, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-xl overflow-hidden group border border-zinc-200 shadow-sm bg-white"
                  >
                    <img
                      src={url}
                      alt={`Asset ${index}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 bg-white rounded-lg text-zinc-900 hover:bg-zinc-100 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                      <a
                        href={url}
                        download
                        className="p-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
