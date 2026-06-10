import { useState } from "react";
import { AlertCircle, Search, X } from "lucide-react";
import { useCreditLogs } from "@/hooks/useCreditLogs";
import { LogTable } from "@/components/admin/LogTable";
import type { CreditLogType } from "@/features/admin/types/admin.types";

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

  const [searchInput, setSearchInput] = useState(filters.search || "");
  const [typeFilter, setTypeFilterLocal] = useState<CreditLogType | undefined>(
    filters.type
  );

  const handleSearch = (value: string) => {
    setSearchInput(value);
    setSearch(value);
  };

  const handleTypeFilterChange = (type: CreditLogType | undefined) => {
    setTypeFilterLocal(type);
    setTypeFilter(type);
  };

  const handleReset = () => {
    setSearchInput("");
    setTypeFilterLocal(undefined);
    resetFilters();
  };

  const creditTypeOptions: CreditLogType[] = [
    "Top-up",
    "Design Generation",
    "Refund",
  ];

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      {/* Header Section */}
      <div className="border-b border-zinc-200 bg-white px-8 py-6">
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">Credit Logs</h1>
        <p className="text-zinc-500">
          Track all credit transactions and system activity
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        {/* Summary Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white border border-emerald-100 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-700">
                  Total Credits Issued
                </p>
                <p className="text-3xl font-bold text-emerald-600 mt-2">
                  {totalCreditsIssued.toLocaleString("en-US")}
                </p>
              </div>
              <div className="text-5xl opacity-20 text-emerald-500">+</div>
            </div>
          </div>

          <div className="bg-white border border-red-100 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700">
                  Total Credits Used Today
                </p>
                <p className="text-3xl font-bold text-red-600 mt-2">
                  {totalCreditsUsedToday.toLocaleString("en-US")}
                </p>
              </div>
              <div className="text-5xl opacity-20 text-red-500">−</div>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Filters Section */}
        <div className="mb-6 p-6 bg-white border border-zinc-200 rounded-lg shadow-sm">
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search by User Email"
                value={searchInput}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-zinc-200 rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-colors"
              />
            </div>

            {/* Filter Row */}
            <div className="flex flex-col md:flex-row gap-4 md:items-end">
              {/* Type Filter Dropdown */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Filter by Type
                </label>
                <select
                  value={typeFilter || ""}
                  onChange={(e) =>
                    handleTypeFilterChange(
                      e.target.value
                        ? (e.target.value as CreditLogType)
                        : undefined
                    )
                  }
                  className="w-full px-4 py-2 bg-white border border-zinc-200 rounded-lg text-zinc-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-colors"
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
                className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-zinc-50 text-zinc-700 border border-zinc-200 rounded-lg transition-colors md:mb-0"
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
