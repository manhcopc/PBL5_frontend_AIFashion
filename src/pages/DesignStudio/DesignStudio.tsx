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
import { useNavigate } from "react-router-dom";
import Header from "../../components/ui/Header";
// import { Sidebar } from "../../components/ui/Sidebar";

export default function DesignStudio() {
  const navigate = useNavigate();
  // const { status, generateDesigns, resetStudio } = useDesignGeneration();

  return (
    <div className=" h-screen bg-zinc-950 text-zinc-50 font-sans overflow-hidden hidden-scrollbar">
      {/* <Sidebar /> */}
      <main className="flex-1 overflow-y-auto p-8 flex flex-col hidden-scrollbar relative">
        {/* {status === "LOADING" && <LoadingOverlay />} */}

        <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col">
          <Header />
          {/* Header */}
          <div className="flex items-center justify-between mb-4 mt-4">
            {/* <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
                Design Studio
              </h1>
              <p className="text-zinc-400 mt-1">
                Create and manage your AI fashion designs
              </p>
            </div> */}

            {/* {status === "IDLE" && ( */}
            <button
              onClick={() => navigate("/create-design")}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-purple-600/20 active:scale-95"
            >
              <Plus className="w-5 h-5" />
              New Design Request
            </button>
            {/* )} */}
          </div>
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col gap-6">
            {/* {status === "IDLE" ? ( */}
            {/* // Empty State */}
            <div className="flex-1 border border-zinc-800/60 border-dashed rounded-2xl bg-zinc-900/20 flex flex-col items-center justify-center text-center p-12 min-h-[400px]">
              <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <LayoutTemplate className="w-10 h-10 text-zinc-600" />
              </div>
              <h3 className="text-xl font-bold text-zinc-200 mb-2">
                No designs yet
              </h3>
              <p className="text-zinc-500 max-w-md mb-8">
                Get started by creating your first AI-generated fashion design
                request. Our AI will analyze current trends based on your
                prompt.
              </p>
              <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-md">
                Upgrade Plan
              </button>
            </div>
            {/* // Results Grid */}
            {/* <ResultsGrid onReset={resetStudio} /> */}
            {/* // Loading State Content Placeholder (Covered by overlay) */}
            <div className="flex-1"></div>
            {/* Footer Stats Row - only show when IDLE */}
            {/* {status === "IDLE" && ( */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-auto">
              <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-5 flex items-center gap-4">
                <div className="p-3 bg-zinc-800 rounded-lg">
                  <Layers className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-zinc-400 text-sm font-medium">
                    Total Requests
                  </p>
                  <p className="text-2xl font-bold text-white mt-1">24</p>
                </div>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-5 flex items-center gap-4">
                <div className="p-3 bg-zinc-800 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-zinc-400 text-sm font-medium">Completed</p>
                  <p className="text-2xl font-bold text-emerald-400 mt-1">18</p>
                </div>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-5 flex items-center gap-4">
                <div className="p-3 bg-zinc-800 rounded-lg">
                  <Activity className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <p className="text-zinc-400 text-sm font-medium">
                    In Progress
                  </p>
                  <p className="text-2xl font-bold text-cyan-400 mt-1">6</p>
                </div>
              </div>
            </div>
            {/* )} */}
          </div>
        </div>
      </main>
    </div>
  );
}
