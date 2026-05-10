import { useEffect, useState } from 'react';
import { styleApi } from '../features/style/api';
import { transformStylesToUI, StyleUIFormat } from '../features/style/mappers/styleMapper';
import { StylePresetResponse } from '../features/style/style.types';

interface UseStylesState {
  styles: StyleUIFormat[];
  rawStyles: StylePresetResponse[];
  isLoading: boolean;
  error: string | null;
}

/**
 * useStyles Hook
 * Fetches style presets and transforms to UI format
 */
export function useStyles() {
  const [state, setState] = useState<UseStylesState>({
    styles: [],
    rawStyles: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchStyles = async () => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));
        const rawStyles = await styleApi.getStylePresets();
        const transformedStyles = transformStylesToUI(rawStyles);

        setState({
          styles: transformedStyles,
          rawStyles,
          isLoading: false,
          error: null,
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch styles';
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
      }
    };

    fetchStyles();
  }, []);

  const searchStyles = async (keyword: string) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const rawStyles = await styleApi.searchStyles(keyword);
      const transformedStyles = transformStylesToUI(rawStyles);

      setState({
        styles: transformedStyles,
        rawStyles,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search styles';
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  };

  return {
    ...state,
    searchStyles,
  };
}
