import { useState, useCallback } from 'react';
import { useUserStore } from '../store/UserContext';
import { simulateGenerationDelay } from '../services/api';

export function useGenerationFlow() {
  const { credits, consumeCredits } = useUserStore();
  
  const [selectedTrend, setSelectedTrend] = useState<string | null>(null);
  const [category, setCategory] = useState<string>('');
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const toggleStyle = (style: string) => {
    setSelectedStyles(prev => 
      prev.includes(style) 
        ? prev.filter(s => s !== style)
        : [...prev, style]
    );
  };

  const isValid = selectedTrend !== null && category !== '' && selectedStyles.length > 0;
  const hasEnoughCredits = credits >= 10;

  const startGeneration = useCallback(async () => {
    if (!isValid || !hasEnoughCredits) return;

    setIsGenerating(true);
    setLoadingMessage('Status: CRAWLING - Scraping fashion trends from social media...');

    // Message timers mapping to 0s, 1s, 2s
    const analyzeTimer = setTimeout(() => {
      setLoadingMessage('Status: ANALYZING_AI - Scoring styles with PhoBERT...');
    }, 1000);

    const generateTimer = setTimeout(() => {
      setLoadingMessage('Status: GENERATING - IP-Adapter & Stable Diffusion processing...');
    }, 2000);

    try {
      await simulateGenerationDelay(); // waits 3 seconds
      
      const success = consumeCredits(10);
      if (success) {
        setIsSuccess(true);
      }
    } finally {
      clearTimeout(analyzeTimer);
      clearTimeout(generateTimer);
      setIsGenerating(false);
    }
  }, [isValid, hasEnoughCredits, consumeCredits]);

  const resetFlow = () => {
    setSelectedTrend(null);
    setCategory('');
    setSelectedStyles([]);
    setIsSuccess(false);
  };

  return {
    selectedTrend,
    setSelectedTrend,
    category,
    setCategory,
    selectedStyles,
    toggleStyle,
    isGenerating,
    loadingMessage,
    isSuccess,
    isValid,
    hasEnoughCredits,
    startGeneration,
    resetFlow
  };
}
