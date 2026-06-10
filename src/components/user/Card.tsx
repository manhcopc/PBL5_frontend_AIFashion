import React, { useState } from "react";
import type { Project } from "../../types";
import { Calendar, X } from "lucide-react";

interface CardProps {
  project: Project;
  onTap: (projectId: string, productType: string) => void;
}

const PRODUCT_TYPES = [
  { id: "design", label: "Design", icon: "🎨" },
  { id: "development", label: "Development", icon: "💻" },
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
    <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200 p-4">
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
              Select Product Type
            </h2>
            <p className="text-zinc-500 text-xs mt-0.5 font-medium">
              Choose a workspace division to proceed
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-700 transition-colors p-1.5 hover:bg-zinc-100 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Grid Options */}
        <div className="grid grid-cols-2 gap-3">
          {PRODUCT_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => {
                onSelect(type.id);
                onClose();
              }}
              className="p-5 bg-zinc-50 hover:bg-indigo-50 border border-zinc-200 hover:border-indigo-500/50 rounded-xl transition-all duration-200 text-left group active:scale-[0.98] shadow-sm hover:shadow-md"
            >
              <div className="text-3xl mb-3 duration-300 group-hover:scale-110">
                {type.icon}
              </div>
              <div className="text-sm font-bold text-zinc-700 group-hover:text-indigo-600 transition-colors">
                {type.label}
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-5 px-4 py-3 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-600 font-bold transition-all duration-200 text-sm shadow-sm"
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
    console.log(`[Card] Project ID: ${project.id} | Selected Type: ${type}`);
    const projectId = project.id || "";
    onTap(projectId, type);
  };

  return (
    <>
      <div
        // onClick={() => setIsModalOpen(true)}
        onClick={() => onTap(project.id, "design")}
        className="bg-white border border-zinc-200 rounded-2xl overflow-hidden hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-300 group cursor-pointer flex flex-col justify-between h-full shadow-sm"
      >
        {/* Main Content Info */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors tracking-tight line-clamp-1">
            {project.title}
          </h3>
          <p className="text-zinc-500 text-sm mt-2.5 line-relaxed line-clamp-3 font-medium">
            {project.description}
          </p>
        </div>

        {/* Footer Card */}
        <div className="px-6 pb-6">
          <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-xs font-semibold text-zinc-400">
            <div className="flex items-center gap-1.5 bg-zinc-50 px-2.5 py-1.5 rounded-lg border border-zinc-200">
              <Calendar className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-zinc-600">{project.date}</span>
            </div>

            <span className="text-indigo-600 font-bold opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 flex items-center gap-1 text-xs">
              Open Project →
            </span>
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
