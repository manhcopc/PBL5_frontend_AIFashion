import { useEffect, useState } from 'react';
import { trendApi } from '../features/trend/api';

interface UseCategoriesState {
  categories: string[];
  isLoading: boolean;
  error: string | null;
}

/**
 * useCategories Hook
 * Fetches available garment categories
 */
export function useCategories() {
  const [state, setState] = useState<UseCategoriesState>({
    categories: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));
        const categories = await trendApi.getCategories();
        setState({
          categories,
          isLoading: false,
          error: null,
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch categories';
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
      }
    };

    fetchCategories();
  }, []);

  return state;
}
