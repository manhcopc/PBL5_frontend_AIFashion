import { useState, useCallback, useEffect } from 'react';
import { adminService } from '@/services/adminService';
import type { CreditLog, CreditLogFilters, CreditLogType } from '@/features/admin/types/admin.types';

interface UseCreditLogsState {
  logs: CreditLog[];
  total: number;
  totalCreditsIssued: number;
  totalCreditsUsedToday: number;
  loading: boolean;
  error: string | null;
}

export function useCreditLogs() {
  const [state, setState] = useState<UseCreditLogsState>({
    logs: [],
    total: 0,
    totalCreditsIssued: 0,
    totalCreditsUsedToday: 0,
    loading: false,
    error: null,
  });

  const [filters, setFilters] = useState<CreditLogFilters>({
    page: 1,
    limit: 20,
    search: '',
    type: undefined,
  });

  /**
   * Fetch credit logs based on current filters
   */
  const fetchLogs = useCallback(async (customFilters?: CreditLogFilters) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const filtersToUse = customFilters || filters;
      const response = await adminService.getCreditLogs(filtersToUse);
      setState((prev) => ({
        ...prev,
        logs: response.logs,
        total: response.total,
        totalCreditsIssued: response.totalCreditsIssued,
        totalCreditsUsedToday: response.totalCreditsUsedToday,
        loading: false,
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch credit logs';
      setState((prev) => ({ ...prev, error: errorMessage, loading: false }));
    }
  }, [filters]);

  /**
   * Update search filter and reset to page 1
   */
  const setSearch = useCallback((search: string) => {
    setFilters((prev) => ({
      ...prev,
      search,
      page: 1,
    }));
  }, []);

  /**
   * Update type filter and reset to page 1
   */
  const setTypeFilter = useCallback((type: CreditLogType | undefined) => {
    setFilters((prev) => ({
      ...prev,
      type,
      page: 1,
    }));
  }, []);

  /**
   * Change current page
   */
  const setPage = useCallback((page: number) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  }, []);

  /**
   * Reset all filters
   */
  const resetFilters = useCallback(() => {
    setFilters({
      page: 1,
      limit: 20,
      search: '',
      type: undefined,
    });
  }, []);

  /**
   * Calculate pagination info
   */
  const paginationInfo = {
    currentPage: filters.page || 1,
    pageSize: filters.limit || 20,
    totalItems: state.total,
    totalPages: Math.ceil(state.total / (filters.limit || 20)),
  };

  // Fetch logs when filters change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchLogs();
  }, [filters, fetchLogs]);

  return {
    // State
    logs: state.logs,
    total: state.total,
    totalCreditsIssued: state.totalCreditsIssued,
    totalCreditsUsedToday: state.totalCreditsUsedToday,
    loading: state.loading,
    error: state.error,

    // Filter controls
    filters,
    setSearch,
    setTypeFilter,
    setPage,
    resetFilters,

    // Pagination info
    paginationInfo,

    // Refetch function
    refetch: fetchLogs,
  };
}
