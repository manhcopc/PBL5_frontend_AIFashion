import React from "react";
import { X, Maximize2 } from "lucide-react";

interface ImageItem {
  _id: string;
  imageUrl: string;
  name: string;
}

interface ImagesProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: ImageItem[];
  title?: string;
}

export const ImagesProjectModal: React.FC<ImagesProjectModalProps> = ({
  isOpen,
  onClose,
  images,
  title = "Danh sách hình ảnh",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Lớp nền mờ (Overlay) */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Nội dung Modal */}
      <div className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Danh sách ảnh - Responsive Grid */}
        <div className="p-4 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((img) => (
              <div
                key={img._id}
                className="group relative aspect-square bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700 hover:border-purple-500/50 transition-all shadow-lg"
              >
                <img
                  src={img.imageUrl}
                  alt={img.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />

                {/* Overlay khi hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white border border-white/20">
                    <Maximize2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Tên ảnh phía dưới */}
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-xs text-white truncate font-medium">
                    {img.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-all font-medium"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
