// import React from 'react';

interface TrendCardProps {
  id: string;
  imageUrl: string;
  isSelected: boolean;
  onClick: (id: string) => void;
}

export function TrendCard({
  id,
  imageUrl,
  isSelected,
  onClick,
}: TrendCardProps) {
  return (
    <div
      onClick={() => {
        onClick(id);
        console.log(`TrendCard clicked in trendcard: ${imageUrl}`);
      }}
      className={`relative min-w-[240px] h-[320px] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 border-2 ${
        isSelected
          ? "border-purple-500 shadow-lg shadow-purple-500/20"
          : "border-transparent hover:border-zinc-700"
      }`}
    >
      <img
        src={imageUrl}
        alt="Trend Image"
        className="w-full h-full object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            "https://placehold.co/400x600/18181b/a1a1aa?text=Loi+Hinh+Anh";
          console.error(`Failed to load image for trend ${imageUrl}:`, e);
        }}
      />
    </div>
  );
}
