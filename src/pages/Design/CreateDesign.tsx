import { ArrowLeft, Zap, Loader2, Sparkles } from "lucide-react";
// ✅ 1. Import useLocation thay cho useParams
import { Link, Navigate, useLocation } from "react-router-dom";
import { useGenerationFlow } from "../../hooks/useGenerationFlow";
import { TrendCard } from "../../components/user/TrendCard";
import {
  mockTrends,
  audiencesList,
  weathersList,
  seasonsList,
} from "../../constants/trends";
import { useUserStore } from "../../store/UserContext";
import { transformToProxyUrl } from "../../utils/util";
// import { ResultsGrid } from "../../components/design/ResultsGrid";

export default function CreateDesign() {
  const { credits } = useUserStore();

  // ✅ 2. Sử dụng useLocation để lấy state được truyền từ Modal
  const location = useLocation();
  const projectId = location.state?.projectId;
  // const promptText = location.state?.promptText;
  const initialImages = location.state?.generatedImages || [];
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
    loadingMessage,
    isSuccess,
    isValid,
    hasEnoughCredits,
    startGeneration,
    designs,
  } = useGenerationFlow(projectId); // Truyền projectId vào thay cho requestId

  // ✅ 3. Nếu không có projectId trong state thì đẩy về trang studio
  if (!projectId) {
    return <Navigate to="/design-studio" replace />;
  }

  // ✅ 4. Logic hiển thị ResultsGrid:
  // - Nếu vừa tạo thành công ở trang này (isSuccess) -> dùng `designs` từ hook
  // - Hoặc nếu Modal truyền sang đã có sẵn ảnh (initialImages.length > 0) -> dùng ảnh từ Modal
  const displayDesigns =
    isSuccess && designs.length > 0 ? designs : initialImages;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col">
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

          {/* ✅ KHU VỰC HIỂN THỊ ẢNH KẾT QUẢ (Chỉ hiện khi có ảnh) */}

          {displayDesigns.length > 0 && (
            <section className="p-6 bg-zinc-900/50 border border-purple-500/30 rounded-2xl">
              <h2 className="text-2xl font-semibold text-purple-400 mb-5 flex items-center gap-2">
                <Sparkles className="w-6 h-6" />
                Kết quả thiết kế
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {displayDesigns.map((item, index) => {
                  // Đảm bảo lấy đúng link ảnh dù item là string hay object
                  const imageUrl =
                    typeof item === "string" ? item : item.imageUrl || item.url;
                  const generatedId = `design-${index}`;
                  console.log(`Displaying design ${index + 1}:`, imageUrl);

                  return (
                    <div
                      key={generatedId}
                      className="bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden group flex flex-col"
                    >
                      <div className="relative aspect-[3/4] overflow-hidden bg-zinc-800">
                        <img
                          src={transformToProxyUrl(imageUrl)}
                          alt={`Thiết kế mẫu ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://placehold.co/400x600/18181b/a1a1aa?text=Loi+Hinh+Anh";
                          }}
                        />

                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                          {/* <a
                            href={imageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition-colors"
                          >
                            Mở ảnh lớn
                          </a> */}
                        </div>
                      </div>

                      <div className="p-4 bg-zinc-950">
                        <p className="text-sm font-medium text-zinc-300 truncate">
                          Mẫu thiết kế {index + 1}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Khu vực chọn Trend ban đầu */}
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
                2. Target season
              </h2>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 text-white rounded-xl px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all cursor-pointer"
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
            </section>
            <section>
              <h2 className="text-lg font-semibold text-zinc-100 mb-4">
                3. Target audience
              </h2>
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 text-white rounded-xl px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all cursor-pointer"
              >
                <option value="" disabled>
                  Select audience...
                </option>
                {audiencesList.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-zinc-100 mb-4">
                4. Target weather
              </h2>
              <select
                value={weather}
                onChange={(e) => setWeather(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 text-white rounded-xl px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all cursor-pointer"
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
