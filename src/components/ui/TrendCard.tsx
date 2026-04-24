// import React from 'react';

interface TrendCardProps {
  id: string;
  title: string;
  imageUrl: string;
  percentage: string;
  isSelected: boolean;
  onClick: (id: string) => void;
}

export function TrendCard({ id, title, imageUrl, percentage, isSelected, onClick }: TrendCardProps) {
  return (
    <div 
      onClick={() => onClick(id)}
      className={`relative min-w-[240px] h-[320px] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 border-2 ${
        isSelected ? 'border-purple-500 shadow-lg shadow-purple-500/20' : 'border-transparent hover:border-zinc-700'
      }`}
    >
      <img 
        src={imageUrl} 
        alt={title} 
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4">
        <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
        <span className="inline-flex w-fit items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          {percentage} Trending
        </span>
      </div>
    </div>
  );
}
