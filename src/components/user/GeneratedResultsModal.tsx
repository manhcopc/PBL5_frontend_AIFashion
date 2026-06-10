import { ArrowLeft, Download, Star, Info } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function GeneratedResultsModal({
  isOpen,
  onClose,
  onReset,
  designs,
  referenceImages,
}: {
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
  designs: string[];
  referenceImages: string[];
}) {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const navigate = useNavigate();

  const handleRate = (id: string, rating: number) => {
    setRatings((prev) => ({ ...prev, [id]: rating }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-900/80 backdrop-blur-md animate-in fade-in duration-500">
      <div className="bg-zinc-50 w-full max-w-7xl max-h-[95vh] overflow-y-auto rounded-[2.5rem] shadow-2xl p-6 md:p-10 flex flex-col gap-10">
        {/* --- Header Section --- */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-zinc-200 pb-8">
          <div className="flex flex-col gap-1">
            <h2 className="text-4xl font-black text-zinc-900 tracking-tight">
              Design Comparison
            </h2>
            <p className="text-zinc-500 font-medium flex items-center gap-2">
              <Info className="w-4 h-4" />
              Compare AI results with your selected reference style.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => {
                onReset();
                onClose();
              }}
              className="flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-zinc-100 text-zinc-700 rounded-2xl transition-all border border-zinc-200 font-bold shadow-sm active:scale-95"
            >
              <ArrowLeft className="w-5 h-5" />
              New Concept
            </button>
            <button
              onClick={() => navigate("/design-studio")}
              className="flex items-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl transition-all font-bold shadow-lg shadow-indigo-200 active:scale-95"
            >
              Studio Home
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* --- CỘT TRÁI: REFERENCE STYLE (1/3 width) --- */}
          <aside className="lg:w-1/3 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-zinc-400 uppercase tracking-widest">
                Reference Style
              </h3>
              <span className="px-3 py-1 bg-zinc-200 text-zinc-600 text-[10px] font-black rounded-full">
                SOURCE
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {referenceImages.map((refUrl, idx) => (
                <div
                  key={`ref-${idx}`}
                  className="relative group rounded-3xl overflow-hidden border-4 border-white shadow-md"
                >
                  <img
                    src={refUrl}
                    alt="Reference"
                    className="w-full aspect-video object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                    <p className="text-white text-xs font-bold">
                      Inspiration:{" "}
                      {idx === 0 ? "Main Trend" : "Secondary Context"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* --- CỘT PHẢI: AI GENERATED (2/3 width) --- */}
          <main className="lg:w-2/3 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-indigo-600 uppercase tracking-widest">
                AI Generated Results
              </h3>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-600 text-[10px] font-black rounded-full animate-pulse">
                LIVE GEN
              </span>
            </div>

            {!designs || designs.length === 0 ? (
              <div className="flex-1 flex items-center justify-center p-20 bg-zinc-100 border-2 border-dashed border-zinc-300 rounded-[2rem]">
                <p className="text-zinc-400 font-bold">Rendering images...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {designs.map((imageUrl, index) => {
                  const generatedId = `design-${index}`;
                  return (
                    <div
                      key={generatedId}
                      className="bg-white border border-zinc-200 rounded-[2rem] overflow-hidden group shadow-sm hover:shadow-2xl transition-all duration-500"
                    >
                      <div className="relative aspect-[4/5] bg-zinc-100 overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={`AI Gen ${index}`}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-indigo-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <a
                            href={imageUrl}
                            download
                            className="p-4 bg-white text-indigo-600 rounded-full shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-500"
                          >
                            <Download className="w-6 h-6" />
                          </a>
                        </div>
                      </div>
                      <div className="p-6 flex items-center justify-between bg-white">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              onClick={() => handleRate(generatedId, star)}
                              className={`w-5 h-5 cursor-pointer transition-all ${
                                star <= (ratings[generatedId] || 0)
                                  ? "fill-amber-400 text-amber-400 scale-110"
                                  : "text-zinc-200"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] font-black text-zinc-300">
                          VERIFIED AI
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
