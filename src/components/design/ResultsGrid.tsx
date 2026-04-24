import { useState } from "react";
import { Download, Star, ArrowLeft } from "lucide-react";
import { mockResults } from "../../constants/mockResults";
import { useNavigate } from "react-router-dom";

export function ResultsGrid({ onReset }: { onReset: () => void }) {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const navigate = useNavigate();
  const handleRate = (id: string, rating: number) => {
    setRatings((prev) => ({ ...prev, [id]: rating }));
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Generated Designs</h2>

        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors border border-zinc-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Create Another
        </button>
        <button
          onClick={() => navigate("/design-studio")}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors border border-zinc-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Studio
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockResults.map((result) => (
          <div
            key={result.id}
            className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden group"
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              <img
                src={result.imageUrl}
                alt={result.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <button className="flex items-center justify-center gap-2 w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors">
                  <Download className="w-4 h-4" />
                  Download HD
                </button>
              </div>
            </div>

            <div className="p-5 flex flex-col gap-3">
              <h3 className="text-lg font-semibold text-zinc-100">
                {result.title}
              </h3>

              <div className="flex items-center gap-1 mt-auto">
                {[1, 2, 3, 4, 5].map((star) => {
                  const currentRating = ratings[result.id] || 0;
                  return (
                    <button
                      key={star}
                      onClick={() => handleRate(result.id, star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-5 h-5 transition-colors ${
                          star <= currentRating
                            ? "fill-purple-500 text-purple-500"
                            : "text-zinc-600 hover:text-purple-400"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
