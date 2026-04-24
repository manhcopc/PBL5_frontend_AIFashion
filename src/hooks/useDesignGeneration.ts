import { useState, useCallback } from 'react';

export type GenerationState = 'IDLE' | 'LOADING' | 'SUCCESS';

export function useDesignGeneration() {
  const [status, setStatus] = useState<GenerationState>('IDLE');

  const generateDesigns = useCallback(() => {
    setStatus('LOADING');
    setTimeout(() => {
      setStatus('SUCCESS');
    }, 3000); // 3-second delay
  }, []);

  const resetStudio = useCallback(() => {
    setStatus('IDLE');
  }, []);

  return { status, generateDesigns, resetStudio };
}
