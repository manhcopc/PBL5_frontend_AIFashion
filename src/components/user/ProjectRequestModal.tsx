import { useEffect, useState } from "react";
import { Clock, Loader2, RotateCcw, X } from "lucide-react";
import { useProjects } from "../../hooks/useProjects";
import { useDesignGeneration } from "../../hooks/useDesignGeneration";
import { useNavigate } from "react-router-dom";
import { getJobStatusLabel } from "@/utils/jobStatus";

interface ProjectRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (payload: { projectId: string; text: string }) => void;
}

export const ProjectRequestModal: React.FC<ProjectRequestModalProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );

  const [isDisplay, setIsDisplay] = useState(false);

  const {
    status,
    jobStatus,
    jobStartedAt,
    isPolling,
    generateDesigns,
    retry,
    error,
    designs,
    currentRequestId,
  } = useDesignGeneration();
  const { projects, fetchProjects } = useProjects();

  useEffect(() => {
    if (status === "SUCCESS" && selectedProjectId) {
      onSelect({ projectId: selectedProjectId, text });

      navigate("/create-design", {
        state: {
          generatedImages: designs,
          projectId: selectedProjectId,
          requestId: currentRequestId,
          promptText: text,
        },
      });

      onClose();
    }
  }, [
    status,
    navigate,
    selectedProjectId,
    text,
    onSelect,
    onClose,
    designs,
    currentRequestId,
  ]);

  if (!isOpen) return null;

  const handleProjects = async () => {
    try {
      await fetchProjects();
      setIsDisplay(true);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  const handleSubmit = async () => {
    if (!selectedProjectId) return alert("Vui lòng chọn dự án!");
    if (!text.trim()) return alert("Vui lòng nhập từ khóa!");

    await generateDesigns({
      project_id: selectedProjectId,
      category_name: text,
    });
  };

  return (
    <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 max-w-md w-full shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-zinc-900">
            Chọn dự án & Nhập yêu cầu
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={handleProjects}
          className="mb-5 w-full sm:w-auto px-4 py-2 bg-zinc-100 text-zinc-700 rounded-lg hover:bg-zinc-200 font-medium transition-colors text-sm border border-zinc-200"
        >
          Tải danh sách Projects
        </button>

        {isDisplay && (
          <div className="grid grid-cols-1 gap-3 mb-6">
            {projects.map((project) => {
              const isSelected = selectedProjectId === project.id;

              return (
                <button
                  key={project.id}
                  onClick={() => setSelectedProjectId(project.id)}
                  className={`p-4 flex flex-col gap-1 border rounded-xl transition-all duration-200 text-left group
                ${
                  isSelected
                    ? "bg-indigo-50 border-indigo-600 ring-1 ring-indigo-600"
                    : "bg-white border-zinc-200 hover:border-indigo-300 hover:bg-zinc-50"
                }`}
                >
                  <div
                    className={`text-lg font-bold transition-colors ${
                      isSelected ? "text-indigo-700" : "text-zinc-900"
                    }`}
                  >
                    {project.title}
                  </div>

                  <div className="text-sm font-medium text-zinc-500">
                    {project.description}
                  </div>

                  <div className="text-xs text-zinc-400 mt-2 flex items-center gap-1">
                    <span className="w-1 h-1 bg-zinc-300 rounded-full"></span>
                    Ngày tạo:{" "}
                    {project.date
                      ? new Date(project.date).toLocaleDateString("vi-VN")
                      : "N/A"}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        <div className="flex flex-col gap-2 w-full mb-8">
          <label
            htmlFor="design-search"
            className="text-sm font-semibold text-zinc-700"
          >
            Nhập yêu cầu / từ khóa cho dự án:
          </label>

          <input
            id="design-search"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ví dụ: Phong cách mùa hè năng động..."
            className="p-3 w-full bg-white border border-zinc-300 rounded-xl text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-zinc-400"
          />
        </div>

        {status === "LOADING" && (
          <div className="mb-6 rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-xl bg-white p-2 text-indigo-600 shadow-sm">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-bold text-zinc-900">
                    Analyzing trends...
                  </p>
                  <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase text-indigo-700">
                    {getJobStatusLabel(jobStatus)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-zinc-500">
                  {text || "Trend analysis request"} is running in the
                  background while this modal remains open.
                </p>
                {jobStartedAt && (
                  <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-zinc-500">
                    <Clock className="h-3.5 w-3.5" />
                    Started {new Date(jobStartedAt).toLocaleTimeString("vi-VN")}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleSubmit}
            disabled={status === "LOADING"}
            className={`flex-[2] px-4 py-3 rounded-xl font-bold transition-all duration-200 shadow-sm ${
              status === "LOADING"
                ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 text-white active:scale-[0.98]"
            }`}
          >
            {status === "LOADING" ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-zinc-300 border-t-indigo-600 animate-spin rounded-full"></span>
                Đang phân tích...
              </span>
            ) : (
              "Gửi yêu cầu"
            )}
          </button>

          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-600 font-semibold transition-all"
          >
            Hủy bỏ
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-rose-100 bg-rose-50 p-3">
            <p className="text-sm font-semibold text-rose-700">{error}</p>
            <button
              onClick={retry}
              disabled={isPolling}
              className="mt-3 inline-flex items-center gap-2 rounded-lg bg-rose-600 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-rose-300"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Retry analysis
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
