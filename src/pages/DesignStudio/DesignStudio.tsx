import {
  Plus,
  LayoutTemplate,
  Layers,
  CheckCircle,
  Activity,
  AlertCircle,
  ArrowRight,
  Clock,
  Loader2,
} from "lucide-react";
// import { useDesignGeneration } from "../../hooks/useDesignGeneration";
// import { LoadingOverlay } from "../../components/design/LoadingOverlay";
// import { ResultsGrid } from "../../components/design/ResultsGrid";
// import { useNavigate } from "react-router-dom";
import Header from "../../components/user/Header";
import { useState } from "react";
import { ProjectRequestModal } from "@/components/user/ProjectRequestModal";
import useProjects from "@/hooks/useProjects";
import useAnalysisHistory from "@/hooks/useAnalysisHistory";
// import { transformToProxyUrl } from "@/utils/util";
// import { Sidebar } from "../../components/ui/Sidebar";

export default function DesignStudio() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    projects,
    isLoading: isLoadingProjects,
    error: projectError,
  } = useProjects();
  const {
    selectedProjectId,
    analysisRequests,
    isLoadingList,
    isLoadingDetail,
    activeRequestId,
    error: analysisError,
    loadProjectAnalysis,
    openAnalysisRequest,
  } = useAnalysisHistory();

  const selectedProject = projects.find(
    (project) => project.id === selectedProjectId
  );
  const completedRequests = analysisRequests.filter(
    (request) => request.status === "COMPLETED"
  ).length;
  const inProgressRequests = analysisRequests.filter(
    (request) =>
      request.status === "PENDING" ||
      request.status === "PROCESSING" ||
      request.status === "GENERATING_IMAGES"
  ).length;

  const getStatusClassName = (status: string) => {
    if (status === "COMPLETED") return "bg-emerald-50 text-emerald-700";
    if (status === "FAILED") return "bg-rose-50 text-rose-700";
    return "bg-indigo-50 text-indigo-700";
  };

  return (
    <>
      <main className="overflow-y-auto w-full relative flex flex-col">
        <Header />

        <div className="flex-1 flex flex-col px-8 py-6 max-w-7xl mx-auto w-full">
          <div className="flex flex-col sm:items-center sm:flex-row justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
                Design Studio
              </h1>
              <p className="text-zinc-500 mt-1">
                Create and manage your AI fashion designs
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-md shadow-indigo-100 active:scale-95"
            >
              <Plus className="w-5 h-5" />
              New Design Request
            </button>
          </div>

          {(projectError || analysisError) && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-rose-700">
              <AlertCircle className="mt-0.5 h-5 w-5" />
              <p className="text-sm font-semibold">
                {projectError?.message || analysisError?.message}
              </p>
            </div>
          )}

          <div className="flex-1 flex flex-col gap-8">
            <section className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_420px]">
              <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-extrabold text-zinc-900">
                      Projects
                    </h2>
                    <p className="mt-1 text-sm font-medium text-zinc-500">
                      Select a project to view its analysis history.
                    </p>
                  </div>
                  {isLoadingProjects && (
                    <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
                  )}
                </div>

                {projects.length === 0 && !isLoadingProjects ? (
                  <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 p-10 text-center">
                    <LayoutTemplate className="mb-4 h-10 w-10 text-zinc-400" />
                    <h3 className="text-lg font-bold text-zinc-900">
                      No projects yet
                    </h3>
                    <p className="mt-2 max-w-sm text-sm leading-relaxed text-zinc-500">
                      Create a design request to start collecting trend analysis
                      sessions for your projects.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {projects.map((project) => {
                      const isSelected = selectedProjectId === project.id;

                      return (
                        <button
                          key={project.id}
                          onClick={() => void loadProjectAnalysis(project.id)}
                          className={`overflow-hidden rounded-2xl border bg-white text-left transition-all hover:-translate-y-0.5 hover:shadow-lg ${
                            isSelected
                              ? "border-indigo-500 ring-4 ring-indigo-50"
                              : "border-zinc-200"
                          }`}
                        >
                          <div className="aspect-[16/9] bg-zinc-100">
                            <img
                              src={project.imageUrl}
                              alt={project.title}
                              className="h-full w-full object-cover"
                              onError={(event) => {
                                event.currentTarget.src =
                                  "https://placehold.co/640x360/f4f4f5/71717a?text=Project";
                              }}
                            />
                          </div>
                          <div className="p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <h3 className="truncate text-base font-extrabold text-zinc-900">
                                  {project.title}
                                </h3>
                                <p className="mt-1 line-clamp-2 text-sm text-zinc-500">
                                  {project.description || "No description"}
                                </p>
                              </div>
                              <ArrowRight
                                className={`mt-1 h-4 w-4 shrink-0 ${
                                  isSelected
                                    ? "text-indigo-600"
                                    : "text-zinc-400"
                                }`}
                              />
                            </div>
                            <p className="mt-4 text-xs font-bold uppercase tracking-wide text-zinc-400">
                              {project.date}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <aside className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-extrabold text-zinc-900">
                      Analysis History
                    </h2>
                    <p className="mt-1 text-sm font-medium text-zinc-500">
                      {selectedProject
                        ? selectedProject.title
                        : "Choose a project first"}
                    </p>
                  </div>
                  {isLoadingList && (
                    <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
                  )}
                </div>

                {!selectedProjectId ? (
                  <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 p-8 text-center">
                    <Clock className="mb-4 h-9 w-9 text-zinc-400" />
                    <p className="text-sm font-bold text-zinc-700">
                      Select a project to load analysis sessions
                    </p>
                  </div>
                ) : analysisRequests.length === 0 && !isLoadingList ? (
                  <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 p-8 text-center">
                    <LayoutTemplate className="mb-4 h-9 w-9 text-zinc-400" />
                    <p className="text-sm font-bold text-zinc-700">
                      No analysis history for this project
                    </p>
                  </div>
                ) : (
                  <div className="max-h-[620px] space-y-3 overflow-y-auto pr-1">
                    {analysisRequests.map((request) => {
                      const isOpening = activeRequestId === request.requestId;

                      return (
                        <button
                          key={request.requestId}
                          onClick={() =>
                            void openAnalysisRequest(request.requestId)
                          }
                          disabled={isLoadingDetail}
                          className="w-full rounded-2xl border border-zinc-200 p-4 text-left transition-colors hover:border-indigo-200 hover:bg-indigo-50/40 disabled:cursor-wait disabled:opacity-75"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h3 className="truncate text-sm font-extrabold text-zinc-900">
                                {request.categoryName}
                              </h3>
                              <p className="mt-1 text-xs font-medium text-zinc-500">
                                Created {request.createdAtLabel}
                              </p>
                            </div>
                            {isOpening ? (
                              <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                            ) : (
                              <span
                                className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${getStatusClassName(
                                  request.status
                                )}`}
                              >
                                {request.status.replace("_", " ")}
                              </span>
                            )}
                          </div>
                          <p className="mt-3 text-[11px] font-semibold text-zinc-400">
                            Updated {request.updatedAtLabel}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                )}
              </aside>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-8">
              <div className="bg-white border border-zinc-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="p-3 bg-purple-50 rounded-xl">
                  <Layers className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-zinc-500 text-sm font-semibold">
                    Total Requests
                  </p>
                  <p className="text-2xl font-bold text-zinc-900 mt-0.5">
                    {analysisRequests.length}
                  </p>
                </div>
              </div>

              <div className="bg-white border border-zinc-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="p-3 bg-emerald-50 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-zinc-500 text-sm font-semibold">
                    Completed
                  </p>
                  <p className="text-2xl font-bold text-zinc-900 mt-0.5">
                    {completedRequests}
                  </p>
                </div>
              </div>

              <div className="bg-white border border-zinc-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="p-3 bg-cyan-50 rounded-xl">
                  <Activity className="w-6 h-6 text-cyan-600" />
                </div>
                <div>
                  <p className="text-zinc-500 text-sm font-semibold">
                    In Progress
                  </p>
                  <p className="text-2xl font-bold text-zinc-900 mt-0.5">
                    {inProgressRequests}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ProjectRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={() => {
          alert("Selected product type:");
        }}
      />
    </>
  );
}
