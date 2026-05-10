import { useState } from "react";
import type { Project } from "../../types";
import { Calendar, Folder, X } from "lucide-react";

interface CardProps {
  project: Project;
  onTap;
}

const PRODUCT_TYPES = [
  { id: "design", label: "Design", icon: "🎨" },
  { id: "development", label: "Development", icon: "��" },
  { id: "marketing", label: "Marketing", icon: "📢" },
  { id: "analytics", label: "Analytics", icon: "📊" },
];

interface ProductTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: string) => void;
}

const ProductTypeModal: React.FC<ProductTypeModalProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">
            Select Product Type
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {PRODUCT_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => {
                onSelect(type.id);
                onClose();
              }}
              className="p-4 bg-zinc-800 hover:bg-purple-500/20 border border-zinc-700 hover:border-purple-500/50 rounded-lg transition-all duration-200 text-left group"
            >
              <div className="text-2xl mb-2">{type.icon}</div>
              <div className="text-sm font-medium text-white group-hover:text-purple-400 transition-colors">
                {type.label}
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-zinc-300 transition-all duration-200"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export const Card: React.FC<CardProps> = ({ project, onTap }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectProductType = (type: string) => {
    console.log(`Selected product type: ${type}`);
    if (onTap) {
      onTap(type);
    }
  };

  return (
    <>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-purple-500/50 hover:shadow-[0_0_15px_rgba(168,85,247,0.15)] transition-all duration-300 group">
        <div className="h-48 overflow-hidden">
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        <div className="p-5">
          <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">
            {project.title}
          </h3>
          <p className="text-zinc-400 text-sm mt-2 line-clamp-2">
            {project.description}
          </p>

          <div className="mt-5 pt-4 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{project.date}</span>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded text-purple-400 transition-all duration-200"
            >
              Click here
            </button>
            <div className="flex items-center gap-1.5">
              <Folder className="w-3.5 h-3.5" />
              <span>{project.requests} Requests</span>
            </div>
          </div>
        </div>
      </div>

      <ProductTypeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleSelectProductType}
      />
    </>
  );
};
