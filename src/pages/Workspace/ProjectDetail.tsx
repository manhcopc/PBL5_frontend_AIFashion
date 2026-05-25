import { useState } from "react";
import {
  ArrowLeft,
  Plus,
  Download,
  Loader2,
  Clock,
  AlertCircle,
  Eye,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { mockDesignRequests } from "../../constants/mockDesignRequests";
import type { DesignRequest } from "../../types";

type TabType = "requests" | "gallery";

interface RequestCardProps {
  request: DesignRequest & { design_image_url?: string[] };
  loadingMessage?: string;
}

// ==================== COMPLETED REQUEST CARD ====================
function CompletedRequestCard({ request }: RequestCardProps) {
  const imageUrl =
    request.design_image_url?.[0] ||
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&auto=format&fit=crop&q=60";

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden group shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
      {/* Image Preview Area */}
      <div className="relative aspect-[3/4] bg-zinc-100 overflow-hidden">
        <img
          src={imageUrl}
          alt={`${request.id}`}
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
            <p className="text-xs text-zinc-400 font-mono uppercase tracking-wider">
              {request.id}
            </p>
            <p className="text-xs text-zinc-500 mt-0.5 font-medium">
              {request.date}
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
              {request.category}
            </span>
            <br />
            <span className="font-bold text-zinc-400 uppercase text-[10px] tracking-wider block mt-1.5 mb-0.5">
              Style
            </span>
            <span className="text-zinc-900 font-medium">
              {request.targetStyle}
            </span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-3 border-t border-zinc-100">
          <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 rounded-lg text-xs font-bold transition-all active:scale-95 border border-zinc-200">
            <Eye className="w-3.5 h-3.5 text-zinc-500" />
            View
          </button>
          <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition-all active:scale-95 border border-indigo-100">
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
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
            <p className="text-xs text-zinc-400 font-mono uppercase tracking-wider">
              {request.id}
            </p>
            <p className="text-xs text-zinc-500 mt-0.5 font-medium">
              {request.date}
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
              {request.category}
            </span>
            <br />
            <span className="font-bold text-zinc-400 uppercase text-[10px] tracking-wider block mt-1.5 mb-0.5">
              Style
            </span>
            <span className="text-zinc-900 font-medium">
              {request.targetStyle}
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
        <div className="relative">
          <Clock className="w-10 h-10 text-amber-600 animate-pulse" />
        </div>
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
            <p className="text-xs text-zinc-400 font-mono uppercase tracking-wider">
              {request.id}
            </p>
            <p className="text-xs text-zinc-500 mt-0.5 font-medium">
              {request.date}
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
              {request.category}
            </span>
            <br />
            <span className="font-bold text-zinc-400 uppercase text-[10px] tracking-wider block mt-1.5 mb-0.5">
              Style
            </span>
            <span className="text-zinc-900 font-medium">
              {request.targetStyle}
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

// ==================== REQUEST CARD ROUTER ====================
function RequestCard({ request, loadingMessage }: RequestCardProps) {
  switch (request.status) {
    case "Completed":
      return <CompletedRequestCard request={request} />;
    case "Generating":
      return (
        <GeneratingRequestCard
          request={request}
          loadingMessage={loadingMessage}
        />
      );
    case "Pending":
      return <PendingRequestCard request={request} />;
  }
}

// ==================== MAIN COMPONENT ====================
export default function ProjectDetail() {
  const { projectId: _ } = useParams<{ projectId: string }>();
  const [activeTab, setActiveTab] = useState<TabType>("requests");
  const [requests] =
    useState<(DesignRequest & { design_image_url?: string[] })[]>(
      mockDesignRequests
    );
  const [loadingMessage] = useState(
    "Status: ANALYZING_AI - Scoring styles with PhoBERT..."
  );

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans">
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
                Summer Collection 2026
              </h1>
              <p className="text-zinc-500 text-lg">
                View and manage your design requests and assets
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
            Request History
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
            Asset Gallery
            {activeTab === "gallery" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t" />
            )}
          </button>
        </div>

        {/* Request History Tab - Visual Grid Layout */}
        {activeTab === "requests" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {requests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                loadingMessage={loadingMessage}
              />
            ))}
          </div>
        )}

        {/* Asset Gallery Tab */}
        {activeTab === "gallery" && (
          <div className="bg-white border-2 border-dashed border-zinc-200 rounded-3xl p-16 text-center shadow-sm">
            <div className="max-w-md mx-auto">
              <p className="text-xl font-bold text-zinc-900 mb-2">
                Gallery Coming Soon
              </p>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Your generated design assets will automatically appear inside
                this clean space.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
