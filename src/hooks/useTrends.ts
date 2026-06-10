import { useEffect, useState } from "react";
import { trendApi } from "../features/trend/api";
import {
  transformTrendsToUI,
  type TrendUIFormat,
} from "../features/trend/mappers/trendMapper";
import type { TrendInsightResponse } from "../features/trend/trend.types";

interface UseTrendsState {
  trends: TrendUIFormat[];
  rawTrends: TrendInsightResponse[];
  isLoading: boolean;
  error: string | null;
}

/**
 * useTrends Hook
 * Fetches trends data and transforms to UI format
 * Handles loading and error states
 */
export function useTrends() {
  const [state, setState] = useState<UseTrendsState>({
    trends: [],
    rawTrends: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));
        const rawTrends = await trendApi.getTrends();
        const transformedTrends = transformTrendsToUI(rawTrends);

        setState({
          trends: transformedTrends,
          rawTrends,
          isLoading: false,
          error: null,
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch trends";
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
      }
    };

    fetchTrends();
  }, []);

  // const searchTrends = async (keyword: string) => {
  //   try {
  //     setState((prev) => ({ ...prev, isLoading: true, error: null }));
  //     const rawTrends = await trendApi.searchTrends(keyword);
  //     const transformedTrends = transformTrendsToUI(rawTrends);

  //     setState({
  //       trends: transformedTrends,
  //       rawTrends,
  //       isLoading: false,
  //       error: null,
  //     });
  //   } catch (err) {
  //     const errorMessage = err instanceof Error ? err.message : 'Failed to search trends';
  //     setState((prev) => ({
  //       ...prev,
  //       isLoading: false,
  //       error: errorMessage,
  //     }));
  //   }
  // };

  return {
    ...state,
    // searchTrends,
  };
}
