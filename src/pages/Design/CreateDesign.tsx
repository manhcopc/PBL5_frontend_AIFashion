import { ArrowLeft, Zap, Loader2, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useGenerationFlow } from "../../hooks/useGenerationFlow";
import { TrendCard } from "../../components/user/TrendCard";
import { StyleTag } from "../../components/user/StyleTag";
import {
  mockTrends,
  categoriesList,
  styleTagsList,
} from "../../constants/trends";
import { useUserStore } from "../../store/UserContext";
import { ResultsGrid } from "../../components/design/ResultsGrid";

export default function CreateDesign() {
  const navigate = useNavigate();
  const { credits } = useUserStore();
  const {
    selectedTrend,
    setSelectedTrend,
    category,
    setCategory,
    selectedStyles,
    toggleStyle,
    isGenerating,
    loadingMessage,
    isSuccess,
    isValid,
    hasEnoughCredits,
    startGeneration,
    resetFlow,
  } = useGenerationFlow();

  // If successful, we can optionally redirect to design studio with a success state
  if (isSuccess) {
    return (
      // <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
      //   <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
      //     <Sparkles className="w-10 h-10 text-emerald-400" />
      //   </div>
      //   <h1 className="text-3xl font-bold text-white mb-4">
      //     Design Generated Successfully!
      //   </h1>
      //   <p className="text-zinc-400 mb-8 max-w-md">
      //     Your AI design has been successfully created. 10 credits have been
      //     deducted from your account.
      //   </p>
      //   <div className="flex gap-4">
      //     <button
      //       onClick={resetFlow}
      //       className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-colors"
      //     >
      //       Create Another
      //     </button>
      //     <button
      //       onClick={() => navigate("/design-studio")}
      //       className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors"
      //     >
      //       View in Studio
      //     </button>
      //   </div>
      // </div>
      <>
        <ResultsGrid onReset={resetFlow} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col">
      {/* Loading Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-md bg-black/80 animate-in fade-in duration-300">
          <Loader2 className="w-16 h-16 text-purple-600 animate-spin mb-8" />
          <div className="h-8 flex items-center justify-center relative overflow-hidden w-full max-w-xl">
            <p
              key={loadingMessage}
              className="text-xl font-medium text-emerald-400 animate-in slide-in-from-bottom-4 fade-in duration-300 text-center px-4 absolute"
            >
              {loadingMessage}
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link
            to="/design-studio"
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Design </span>
          </Link>
          <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-full">
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-zinc-200">
              {credits} Credits
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10 flex flex-col lg:flex-row gap-12">
        {/* Main Content Area */}
        <div className="flex-1 max-w-3xl flex flex-col gap-10">
          <div>
            <h1 className="text-4xl font-bold text-white mb-3">
              Create New Design
            </h1>
            <p className="text-zinc-400 text-lg">
              Configure your design parameters based on real-time fashion
              trends.
            </p>
          </div>

          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-semibold text-zinc-100">
                1. Select Trend Source
              </h2>
              <span className="text-sm font-medium text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Live Data
              </span>
            </div>
            {/* Horizontal Scroll Area */}
            <div className="flex gap-5 overflow-x-auto pb-6 hidden-scrollbar snap-x">
              {mockTrends.map((trend) => (
                <div key={trend.id} className="snap-start">
                  <TrendCard
                    {...trend}
                    isSelected={selectedTrend === trend.id}
                    onClick={setSelectedTrend}
                  />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Configuration Panel */}
        <div className="w-full lg:w-[400px] flex flex-col">
          <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-6 sticky top-28 flex flex-col gap-8">
            <section>
              <h2 className="text-lg font-semibold text-zinc-100 mb-4">
                2. Garment Category
              </h2>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 text-white rounded-xl px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all cursor-pointer"
              >
                <option value="" disabled>
                  Select category...
                </option>
                {categoriesList.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-100 mb-4 flex justify-between items-center">
                3. Style Elements
                <span className="text-xs font-normal text-zinc-500">
                  Multi-select
                </span>
              </h2>
              <div className="flex flex-wrap gap-2">
                {styleTagsList.map((style) => (
                  <StyleTag
                    key={style}
                    label={style}
                    isSelected={selectedStyles.includes(style)}
                    onClick={toggleStyle}
                  />
                ))}
              </div>
            </section>

            <div className="pt-6 border-t border-zinc-800/80 mt-auto">
              <button
                disabled={!isValid || !hasEnoughCredits || isGenerating}
                onClick={startGeneration}
                className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                  isValid && hasEnoughCredits
                    ? "bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/25 active:scale-[0.98]"
                    : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                }`}
              >
                <Sparkles className="w-5 h-5" />
                Generate Design (⚡ 10 Credits)
              </button>

              {!hasEnoughCredits && (
                <p className="text-sm text-center text-rose-400 mt-4">
                  Not enough credits.{" "}
                  <a
                    href="#"
                    className="underline font-medium hover:text-rose-300"
                  >
                    Upgrade Plan
                  </a>
                </p>
              )}
              {hasEnoughCredits && !isValid && (
                <p className="text-sm text-center text-zinc-500 mt-4">
                  Complete all steps to generate
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
