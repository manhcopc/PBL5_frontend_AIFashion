import {
  Plus,
  LayoutTemplate,
  Layers,
  CheckCircle,
  Activity,
} from "lucide-react";
// import { useDesignGeneration } from "../../hooks/useDesignGeneration";
// import { LoadingOverlay } from "../../components/design/LoadingOverlay";
// import { ResultsGrid } from "../../components/design/ResultsGrid";
// import { useNavigate } from "react-router-dom";
import Header from "../../components/user/Header";
import { useState } from "react";
import { ProjectRequestModal } from "@/components/user/ProjectRequestModal";
// import { transformToProxyUrl } from "@/utils/util";
// import { Sidebar } from "../../components/ui/Sidebar";

export default function DesignStudio() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <div className="flex h-screen bg-zinc-50 text-zinc-900 font-sans overflow-hidden">
        <main className="overflow-y-auto w-full relative flex flex-col">
          {/* Header */}
          <Header />

          {/* Container chung để quản lý padding thống nhất */}
          <div className="flex-1 flex flex-col px-8 py-6 max-w-7xl mx-auto w-full">
            {/* Page Title & Action */}
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

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col gap-8">
              {/* Empty State */}
              <div className="flex-1 border-2 border-zinc-200 border-dashed rounded-3xl bg-white flex flex-col items-center justify-center text-center p-12 min-h-[400px] shadow-sm">
                <div className="w-20 h-20 bg-zinc-50 rounded-2xl flex items-center justify-center mb-6 shadow-inner ring-1 ring-zinc-100">
                  <LayoutTemplate className="w-10 h-10 text-zinc-400" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-2">
                  No designs yet
                </h3>
                <p className="text-zinc-500 max-w-sm mb-8 leading-relaxed">
                  Get started by creating your first AI-generated fashion design
                  request. Our AI will analyze current trends based on your
                  prompt.
                </p>
                <button className="bg-zinc-900 hover:bg-zinc-800 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-zinc-200 active:scale-95">
                  Upgrade Plan
                </button>
              </div>

              {/* Footer Stats Row */}
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
                      24
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
                      18
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
                    <p className="text-2xl font-bold text-zinc-900 mt-0.5">6</p>
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
      </div>
    </>
  );
}
