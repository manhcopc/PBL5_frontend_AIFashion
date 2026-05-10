import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useProjects } from "../../hooks/useProjects";
import { useDesignGeneration } from "../../hooks/useDesignGeneration";
import { useNavigate } from "react-router-dom";
// import type { ProjectResponse } from "../../features/project/api";
// import projectApi from "../../features/project/api";

// Cập nhật lại interface để onSelect có thể nhận cả projectId và text
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

  // 1. GỌI TẤT CẢ CUSTOM HOOKS
  const { status, generateDesigns, error, designs } = useDesignGeneration();
  const { projects, fetchProjects } = useProjects("69e514b094de292600020968");

  // 2. GỌI TẤT CẢ USE EFFECT LÊN TRÊN CÙNG
  useEffect(() => {
    if (status === "SUCCESS" && selectedProjectId) {
      // Gọi onSelect nếu parent component cần
      onSelect({ projectId: selectedProjectId, text });

      // ✅ Đính kèm mảng designs vào state của navigate
      navigate("/create-design", {
        state: {
          generatedImages: designs, // Mảng link ảnh từ useDesignGeneration
          projectId: selectedProjectId,
          promptText: text,
        },
      });

      onClose();
    }
  }, [status, navigate, selectedProjectId, text, onSelect, onClose, designs]);

  // 3. ĐẶT LỆNH RETURN SỚM Ở DƯỚI CÙNG CỦA KHU VỰC KHAI BÁO HOOKS
  if (!isOpen) return null;

  const handleProjects = async () => {
    try {
      fetchProjects();
      setIsDisplay(true);
      console.log("Fetched projects:", projects);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  // 2. Hàm xử lý Submit
  // 2. Hàm xử lý Submit
  const handleSubmit = async () => {
    if (!selectedProjectId) return alert("Vui lòng chọn dự án!");
    if (!text.trim()) return alert("Vui lòng nhập từ khóa!");

    // Chỉ cần gọi hàm này để kích hoạt luồng chạy. Mọi việc còn lại để useEffect lo.
    await generateDesigns({
      project_id: selectedProjectId,
      category_name: text,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">
            Chọn dự án và Nhập yêu cầu
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={handleProjects}
          className="mb-4 px-4 py-2 bg-zinc-800 text-white rounded hover:bg-zinc-700 transition-colors text-sm"
        >
          Tải danh sách Projects
        </button>

        {/* Danh sách Projects */}
        {isDisplay && (
          <div className="grid grid-cols-1 gap-3 mb-6">
            {projects.map((project) => {
              // Kiểm tra xem project này có đang được chọn không
              const isSelected = selectedProjectId === project.id;

              return (
                <button
                  key={project.id}
                  onClick={() => setSelectedProjectId(project.id)} // Chỉ lưu ID vào state, không đóng modal
                  // Thêm hiệu ứng viền màu tím và nền sáng hơn nếu đang được chọn (isSelected)
                  className={`p-4 flex flex-col gap-1 border rounded-lg transition-all duration-200 text-left group
                    ${
                      isSelected
                        ? "bg-purple-500/20 border-purple-500"
                        : "bg-zinc-800 border-zinc-700 hover:bg-zinc-700 hover:border-zinc-500"
                    }`}
                >
                  <div
                    className={`text-lg font-semibold transition-colors ${
                      isSelected ? "text-purple-400" : "text-white"
                    }`}
                  >
                    {project.title}
                  </div>

                  <div className="text-sm font-medium text-zinc-400">
                    {project.description}
                  </div>

                  <div className="text-xs text-zinc-500 mt-2">
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

        {/* Phần Nhập liệu */}
        <div className="flex flex-col gap-2 w-full mb-6">
          <label
            htmlFor="design-search"
            className="text-sm font-medium text-zinc-400"
          >
            Nhập yêu cầu / từ khóa cho dự án:
          </label>

          <input
            id="design-search"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Nhập từ khóa (vd: Mùa xuân ấm áp...)"
            className="p-3 w-full bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        {/* Nút Submit & Cancel */}
        <div className="flex gap-3">
          {/* Thay thế nút Submit cũ bằng logic hiển thị theo trạng thái */}
          <button
            onClick={handleSubmit}
            disabled={status === "LOADING"}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              status === "LOADING"
                ? "bg-zinc-700 text-zinc-500 cursor-not-allowed"
                : "bg-green-700 hover:bg-green-600 text-white"
            }`}
          >
            {status === "LOADING" ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-zinc-500 border-t-white animate-spin rounded-full"></span>
                Đang xử lý...
              </span>
            ) : (
              "Gửi yêu cầu"
            )}
          </button>

          {/* Hiển thị lỗi nếu có từ Hook */}
          {error && (
            <p className="text-red-500 text-xs mt-2 text-center">{error}</p>
          )}
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-zinc-300 font-medium transition-all duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
