import { Loader2 } from 'lucide-react';

export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-md bg-black/80 animate-in fade-in duration-300">
      <Loader2 className="w-16 h-16 text-purple-600 animate-spin mb-6" />
      <p className="text-xl font-medium text-white/90 animate-pulse text-center px-4">
        AI is analyzing trends and generating designs...
      </p>
    </div>
  );
}
