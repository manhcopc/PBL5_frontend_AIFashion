import { useState } from "react";
import { Download, Star, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ResultsGrid({
  designs, // Lúc này designs là mảng các string (đường link)
  onReset,
}: {
  designs: string[]; // ✅ Khai báo nhận mảng chuỗi
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
        <h2 className="text-2xl font-bold text-white">Generated Designs</h2>

        <div className="flex gap-3">
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
      </div>

      {!designs || designs.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900 border border-zinc-800 rounded-xl">
          <p className="text-zinc-500">Không tìm thấy hình ảnh nào.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* ✅ Lấy thêm index để tạo id và title */}
          {designs.map((imageUrl, index) => {
            const generatedId = `design-${index}`;
            const generatedTitle = `Thiết kế mẫu ${index + 1}`;

            return (
              <div
                key={generatedId}
                className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden group"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-zinc-800">
                  <img
                    src={imageUrl} // Truyền trực tiếp imageUrl vào đây
                    alt={generatedTitle}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://placehold.co/400x600/18181b/a1a1aa?text=Loi+Hinh+Anh";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                    <a
                      href={imageUrl}
                      download={`thiet-ke-${index + 1}.png`} // Gợi ý tên file khi tải
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download HD
                    </a>
                  </div>
                </div>

                <div className="p-5 flex flex-col gap-3">
                  <h3 className="text-lg font-semibold text-zinc-100 line-clamp-1">
                    {generatedTitle}
                  </h3>

                  <div className="flex items-center gap-1 mt-auto">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const currentRating = ratings[generatedId] || 0;
                      return (
                        <button
                          key={star}
                          onClick={() => handleRate(generatedId, star)}
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
            );
          })}
        </div>
      )}
    </div>
  );
}
