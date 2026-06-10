import { useState } from "react";
import { Download, Star, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ResultsGrid({
  designs,
  onReset,
}: {
  designs: string[];
  onReset: () => void;
}) {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const navigate = useNavigate();

  const handleRate = (id: string, rating: number) => {
    setRatings((prev) => ({ ...prev, [id]: rating }));
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-900">Generated Designs</h2>

        <div className="flex gap-3">
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-zinc-50 text-zinc-700 rounded-xl transition-all border border-zinc-200 font-medium shadow-sm active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            Create Another
          </button>
          <button
            onClick={() => navigate("/design-studio")}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-zinc-50 text-zinc-700 rounded-xl transition-all border border-zinc-200 font-medium shadow-sm active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Studio
          </button>
        </div>
      </div>

      {!designs || designs.length === 0 ? (
        <div className="text-center py-20 bg-white border border-zinc-200 border-dashed rounded-2xl shadow-sm">
          <p className="text-zinc-400 font-medium">
            Không tìm thấy hình ảnh nào.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {designs.map((imageUrl, index) => {
            const generatedId = `design-${index}`;
            const generatedTitle = `Thiết kế mẫu ${index + 1}`;

            return (
              <div
                key={generatedId}
                className="bg-white border border-zinc-200 rounded-2xl overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-zinc-100">
                  <img
                    src={imageUrl}
                    alt={generatedTitle}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://placehold.co/400x600/f4f4f5/a1a1aa?text=Image+Error";
                    }}
                  />

                  <div className="absolute inset-0 bg-zinc-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 backdrop-blur-[2px]">
                    <a
                      href={imageUrl}
                      download={`thiet-ke-${index + 1}.png`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 bg-white hover:bg-zinc-50 text-zinc-900 rounded-xl font-bold transition-all shadow-lg transform translate-y-4 group-hover:translate-y-0 duration-300"
                    >
                      <Download className="w-4 h-4" />
                      Download HD
                    </a>
                  </div>
                </div>

                <div className="p-5 flex flex-col gap-4">
                  <h3 className="text-lg font-bold text-zinc-900 line-clamp-1">
                    {generatedTitle}
                  </h3>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const currentRating = ratings[generatedId] || 0;
                        const isFilled = star <= currentRating;
                        return (
                          <button
                            key={star}
                            onClick={() => handleRate(generatedId, star)}
                            className="focus:outline-none transition-transform active:scale-125"
                          >
                            <Star
                              className={`w-5 h-5 transition-colors ${
                                isFilled
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-zinc-200 hover:text-amber-200"
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>

                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                      AI Model v3
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
