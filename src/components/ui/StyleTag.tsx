// import React from 'react';

interface StyleTagProps {
  label: string;
  isSelected: boolean;
  onClick: (label: string) => void;
}

export function StyleTag({ label, isSelected, onClick }: StyleTagProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(label)}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
        isSelected
          ? 'bg-purple-600 border-purple-500 text-white shadow-md shadow-purple-500/20'
          : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-600'
      }`}
    >
      {label}
    </button>
  );
}
