import { X } from "lucide-react";
import { useCreateProject } from "../../hooks/useCreateProject";
import type { Project } from "../../types";
// import { ProjectRequestModal } from "./ProjectRequestModal";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (project: Project) => void;
}

export const CreateProjectModal = ({
  isOpen,
  onClose,
  onSuccess,
}: CreateProjectModalProps) => {
  const {
    title,
    setTitle,
    description,
    setDescription,
    isSubmitting,
    error,
    handleSubmit,
    handleClose,
  } = useCreateProject(onSuccess, onClose);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={handleClose}
    >
      <div
        className="bg-[#0A0A0A] border border-zinc-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <h2 className="text-xl font-semibold text-white">
            Create New Project
          </h2>
          <button
            onClick={handleClose}
            className="text-zinc-400 hover:text-white transition-colors p-1 rounded-md hover:bg-zinc-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label
              htmlFor="title"
              className="text-sm font-medium text-zinc-300"
            >
              Project Name
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Summer Collection 2026"
              className="bg-zinc-900 border border-zinc-800 text-white rounded-lg px-4 py-2.5 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all focus:border-2"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="description"
              className="text-sm font-medium text-zinc-300"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your project..."
              rows={4}
              className="bg-zinc-900 border border-zinc-800 text-white rounded-lg px-4 py-2.5 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none focus:border-2"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex items-center justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-sm font-medium bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center justify-center min-w-[140px] disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(168,85,247,0.2)]"
            >
              {isSubmitting ? "Creating..." : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
