import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useCreditLogs } from '@/hooks/useCreditLogs';
import { LogTable } from '@/components/admin/LogTable';
import type { CreditLogType } from '@/features/admin/types/admin.types';

export const CreditLogs = () => {
  const {
    logs,
    totalCreditsIssued,
    totalCreditsUsedToday,
    loading,
    error,
    filters,
    setSearch,
    setTypeFilter,
    setPage,
    resetFilters,
    paginationInfo,
  } = useCreditLogs();

  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [typeFilter, setTypeFilterLocal] = useState<CreditLogType | undefined>(filters.type);

  const handleSearch = (value: string) => {
    setSearchInput(value);
    setSearch(value);
  };

  const handleTypeFilterChange = (type: CreditLogType | undefined) => {
    setTypeFilterLocal(type);
    setTypeFilter(type);
  };

  const handleReset = () => {
    setSearchInput('');
    setTypeFilterLocal(undefined);
    resetFilters();
  };

  const creditTypeOptions: CreditLogType[] = ['Top-up', 'Design Generation', 'Refund'];

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      {/* Header Section */}
      <div className="border-b border-zinc-800 px-8 py-6">
        <h1 className="text-3xl font-bold text-white mb-2">Credit Logs</h1>
        <p className="text-zinc-400">Track all credit transactions and system activity</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        {/* Summary Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-gradient-to-br from-emerald-900/20 to-emerald-900/5 border border-emerald-800/50 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-300/80">Total Credits Issued</p>
                <p className="text-3xl font-bold text-emerald-400 mt-2">
                  {totalCreditsIssued.toLocaleString('en-US')}
                </p>
              </div>
              <div className="text-5xl opacity-10 text-emerald-400">+</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-900/20 to-red-900/5 border border-red-800/50 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-300/80">Total Credits Used Today</p>
                <p className="text-3xl font-bold text-red-400 mt-2">
                  {totalCreditsUsedToday.toLocaleString('en-US')}
                </p>
              </div>
              <div className="text-5xl opacity-10 text-red-400">−</div>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-700/50 rounded-lg">
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {/* Filters Section */}
        <div className="mb-6 p-6 bg-zinc-900 border border-zinc-800 rounded-lg">
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search by User Email"
                value={searchInput}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-purple-600/50 focus:ring-1 focus:ring-purple-600/30 transition-colors"
              />
            </div>

            {/* Filter Row */}
            <div className="flex flex-col md:flex-row gap-4 md:items-end">
              {/* Type Filter Dropdown */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Filter by Type
                </label>
                <select
                  value={typeFilter || ''}
                  onChange={(e) => handleTypeFilterChange(e.target.value ? (e.target.value as CreditLogType) : undefined)}
                  className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-purple-600/50 focus:ring-1 focus:ring-purple-600/30 transition-colors"
                >
                  <option value="">All Types</option>
                  {creditTypeOptions.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reset Button */}
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors md:mb-0"
              >
                <X className="w-4 h-4" />
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <LogTable
          logs={logs}
          loading={loading}
          currentPage={paginationInfo.currentPage}
          totalPages={paginationInfo.totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};
