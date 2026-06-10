import {
  ArrowLeft,
  Zap,
  Sparkles,
  CheckCircle,
  Loader2,
  Clock,
  RotateCcw,
} from "lucide-react";
// ✅ 1. Import useLocation thay cho useParams
import { Link, useLocation } from "react-router-dom";
import { useGenerationFlow } from "../../hooks/useGenerationFlow";
import {
  // mockTrends,
  audiencesList,
  weathersList,
  seasonsList,
} from "../../constants/trends";
import { useUserStore } from "../../store/UserContext";
// import { transformToProxyUrl } from "../../utils/util";
import { useEffect, useState } from "react";
import { GeneratedResultsModal } from "@/components/user/GeneratedResultsModal";
import { getJobStatusLabel } from "@/utils/jobStatus";

type RouteDesignImage = string | { imageUrl?: string; url?: string };

interface CreateDesignLocationState {
  requestId?: string;
  projectId?: string;
  promptText?: string;
  generatedImages?: RouteDesignImage[];
  generatedResultImages?: string[];
  openGeneratedResults?: boolean;
}

export default function CreateDesign() {
  const { credits } = useUserStore();
  const [showResults, setShowResults] = useState(false); // Thêm state quản lý modal
  const location = useLocation();
  const routeState = location.state as CreateDesignLocationState | null;
  const requestId = routeState?.requestId ?? "";
  const projectId = routeState?.projectId;
  const [targetStylePrompt, setTargetStylePrompt] = useState(
    routeState?.promptText ?? ""
  );
  const initialImages = routeState?.generatedImages ?? [];
  const generatedResultImages = routeState?.generatedResultImages ?? [];
  const shouldOpenGeneratedResults = routeState?.openGeneratedResults === true;
  const {
    season,
    setSeason,
    audience,
    setAudience,
    weather,
    setWeather,
    selectedTrend,
    setSelectedTrend,
    isGenerating,
    jobStatus,
    jobStartedAt,
    loadingMessage,
    isSuccess,
    isValid,
    hasEnoughCredits,
    startGeneration,
    retryGeneration,

    designs,
    analysisError,
  } = useGenerationFlow(
    requestId,
    {
      target_style_prompt: targetStylePrompt.trim(),
      num_images: 4,
      seed: 42,
    },
    projectId
  ); // Truyền projectId để global job watcher điều hướng kết quả

  // ✅ 3. Nếu không có projectId trong state thì đẩy về trang studio
  // if (!projectId) {
  //   return <Navigate to="/design-studio" replace />;
  // }

  // ✅ 4. Logic hiển thị ResultsGrid:
  // - Nếu vừa tạo thành công ở trang này (isSuccess) -> dùng `designs` từ hook
  // - Hoặc nếu Modal truyền sang đã có sẵn ảnh (initialImages.length > 0) -> dùng ảnh từ Modal
  const displayDesigns =
    isSuccess && designs.length > 0 ? designs : initialImages;
  const modalDesigns =
    isSuccess && designs.length > 0 ? designs : generatedResultImages;
  const path1 = "/src/assets/product/hinh1.jpeg";
  const path2 = "/src/assets/product/hinh2.jpg";
  const path3 = "/src/assets/product/hinh3.jpeg";
  const path4 = "/src/assets/product/hinh4.jpeg";
  const mockTrends = [path1, path2, path3, path4];

  useEffect(() => {
    if (
      (isSuccess && designs.length > 0) ||
      (shouldOpenGeneratedResults && generatedResultImages.length > 0)
    ) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowResults(true);
    }
  }, [
    designs.length,
    generatedResultImages.length,
    isSuccess,
    shouldOpenGeneratedResults,
  ]);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col font-sans">
      <GeneratedResultsModal
        isOpen={showResults && modalDesigns.length > 0}
        onClose={() => setShowResults(false)}
        onReset={() => {
          setShowResults(false);
          // Reset lại toàn bộ state trong hook để bắt đầu lại từ đầu
          setSelectedTrend(null);
          setSeason("");
          setAudience("");
          setWeather("");
        }}
        referenceImages={mockTrends} // Truyền ảnh phong cách tham chiếu vào Modal
        designs={modalDesigns}
      />

      {/* Header */}
      <header className="border-b border-zinc-200 bg-white/70 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link
            to="/design-studio"
            className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back to Design</span>
          </Link>
          <div className="flex items-center gap-2 px-4 py-2 bg-zinc-100 border border-zinc-200 rounded-full shadow-sm">
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="text-sm font-bold text-zinc-700">
              {credits} Credits
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10 flex flex-col lg:flex-row gap-12">
        {/* Main Content Area */}
        <div className="flex-1 max-w-3xl flex flex-col gap-10">
          <div>
            <h1 className="text-4xl font-extrabold text-zinc-900 mb-3 tracking-tight">
              Create New Design
            </h1>
            <p className="text-zinc-500 text-lg leading-relaxed">
              Configure your design parameters based on real-time fashion
              trends.
            </p>
          </div>

          {(isGenerating || analysisError) && (
            <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div
                  className={`rounded-2xl p-3 ${
                    analysisError
                      ? "bg-rose-50 text-rose-600"
                      : "bg-indigo-50 text-indigo-600"
                  }`}
                >
                  {analysisError ? (
                    <RotateCcw className="h-6 w-6" />
                  ) : (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-extrabold text-zinc-900">
                        {analysisError
                          ? "Image generation failed"
                          : "Generating AI images"}
                      </h2>
                      <p className="mt-1 text-sm text-zinc-500">
                        {analysisError ||
                          loadingMessage ||
                          "Your image generation job is running in the background."}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${
                        analysisError
                          ? "bg-rose-50 text-rose-700"
                          : "bg-indigo-50 text-indigo-700"
                      }`}
                    >
                      {analysisError ? "Failed" : getJobStatusLabel(jobStatus)}
                    </span>
                  </div>

                  {jobStartedAt && !analysisError && (
                    <p className="mt-4 flex items-center gap-1.5 text-xs font-medium text-zinc-500">
                      <Clock className="h-3.5 w-3.5" />
                      Started{" "}
                      {new Date(jobStartedAt).toLocaleTimeString("vi-VN")}
                    </p>
                  )}

                  {!analysisError && (
                    <div className="mt-5 grid grid-cols-2 gap-4">
                      {[0, 1, 2, 3].map((slot) => (
                        <div
                          key={slot}
                          className="aspect-[4/5] animate-pulse rounded-2xl border border-zinc-200 bg-zinc-100"
                        />
                      ))}
                    </div>
                  )}

                  {analysisError && (
                    <button
                      onClick={retryGeneration}
                      className="mt-4 inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-rose-700"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Retry
                    </button>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* ✅ KHU VỰC HIỂN THỊ ẢNH KẾT QUẢ */}
          {displayDesigns.length > 0 && (
            <section className="p-8 bg-white border border-zinc-200 rounded-3xl shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-zinc-900">
                  1. Select Trend Source
                </h2>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                  Live Data
                </span>
              </div>

              <div className="flex gap-5 overflow-x-auto pb-4 hidden-scrollbar snap-x">
                {displayDesigns.map((item: RouteDesignImage, index: number) => {
                  const imageUrl =
                    typeof item === "string"
                      ? item
                      : item.imageUrl || item.url || "";
                  const generatedId = `design-${index}`;
                  const isSelected = selectedTrend === imageUrl;

                  return (
                    <div
                      key={generatedId}
                      onClick={() => setSelectedTrend(imageUrl)}
                      className={`relative min-w-[240px] h-[320px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border-4 snap-start
                    ${
                      isSelected
                        ? "border-indigo-600 shadow-xl shadow-indigo-100 scale-[0.98]"
                        : "border-transparent hover:border-zinc-200"
                    }`}
                    >
                      <div className="w-full h-full bg-zinc-100">
                        <img
                          // src={transformToProxyUrl(imageUrl)}
                          src={imageUrl}
                          alt={`Thiết kế mẫu ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://placehold.co/400x600/f4f4f5/71717a?text=Image+Error";
                          }}
                        />
                        {isSelected && (
                          <div className="absolute top-3 right-3 bg-indigo-600 text-white p-1.5 rounded-full shadow-lg">
                            <CheckCircle className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar Configuration Panel */}
        <div className="w-full lg:w-[400px] flex flex-col">
          <div className="bg-white border border-zinc-200 rounded-3xl p-8 sticky top-28 flex flex-col gap-8 shadow-sm">
            <section>
              <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">
                2. Style prompt
              </h2>
              <textarea
                value={targetStylePrompt}
                onChange={(e) => setTargetStylePrompt(e.target.value)}
                rows={4}
                placeholder="Describe the style you want, e.g. minimalist office wear with soft pastel colors..."
                className="w-full resize-none bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium placeholder:text-zinc-400"
              />
              <p className="mt-2 text-xs font-medium text-zinc-400">
                This prompt will be sent as target_style_prompt.
              </p>
            </section>

            <section>
              <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">
                3. Target season
              </h2>
              <div className="relative">
                <select
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl px-4 py-3.5 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer font-medium"
                >
                  <option value="" disabled>
                    Select season...
                  </option>
                  {seasonsList.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </section>

            <section>
              <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">
                4. Target audience
              </h2>
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl px-4 py-3.5 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer font-medium"
              >
                <option value="" disabled>
                  Select audience.....
                </option>
                {audiencesList.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </section>

            <section>
              <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">
                5. Target weather
              </h2>
              <select
                value={weather}
                onChange={(e) => setWeather(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl px-4 py-3.5 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer font-medium"
              >
                <option value="" disabled>
                  Select weather...
                </option>
                {weathersList.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </section>

            <div className="pt-6 border-t border-zinc-100 mt-auto">
              <button
                disabled={!isValid || !hasEnoughCredits || isGenerating}
                onClick={startGeneration}
                className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg ${
                  isValid && hasEnoughCredits
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 active:scale-[0.98]"
                    : "bg-zinc-100 text-zinc-400 cursor-not-allowed shadow-none"
                }`}
              >
                <Sparkles className="w-5 h-5" />
                Generate Design (⚡ 10)
              </button>

              {!hasEnoughCredits && (
                <p className="text-sm text-center text-rose-600 mt-4 font-medium">
                  Not enough credits.{" "}
                  <a
                    href="#"
                    className="underline font-bold hover:text-rose-700"
                  >
                    Upgrade Plan
                  </a>
                </p>
              )}
              {hasEnoughCredits && !isValid && (
                <p className="text-sm text-center text-zinc-400 mt-4 font-medium">
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
