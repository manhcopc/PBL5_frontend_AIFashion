import { useEffect, useState, useCallback } from "react";
import { Menu, X, AlertCircle } from "lucide-react";
import { useAdminActions } from "@/hooks/useAdminActions";
import { StatsGrid } from "@/components/admin/StatsGrid";

export const AdminDashboard = () => {
  const { stats, loading, error, fetchStats, fetchUsers } = useAdminActions();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleInitialLoad = useCallback(() => {
    void fetchStats();
    void fetchUsers();
  }, [fetchStats, fetchUsers]);

  useEffect(() => {
    handleInitialLoad();
  }, [handleInitialLoad]);

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-zinc-200 px-6 py-4 flex items-center justify-between md:hidden">
        <h1 className="text-lg font-semibold text-zinc-900">Admin Dashboard</h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
        >
          {sidebarOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      <div className="border-b border-zinc-200 bg-white px-8 py-6">
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">
          Dashboard Analytics
        </h1>
        <p className="text-zinc-500">
          Overview of your system metrics and performance
        </p>
      </div>

      <div className="flex-1 overflow-auto p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-red-800">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        <StatsGrid stats={stats} isLoading={loading} />

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-900 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <button className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors text-sm">
                Export User Report
              </button>
              <button className="w-full px-4 py-3 bg-white hover:bg-zinc-50 text-zinc-700 border border-zinc-200 rounded-lg font-medium transition-colors text-sm">
                View Detailed Logs
              </button>
              <button className="w-full px-4 py-3 bg-white hover:bg-zinc-50 text-zinc-700 border border-zinc-200 rounded-lg font-medium transition-colors text-sm">
                System Health Check
              </button>
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-900 mb-4">
              System Status
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">API Response Time</span>
                <span className="text-emerald-600 font-semibold">45ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Database Status</span>
                <span className="text-emerald-600 font-semibold">Healthy</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Server Uptime</span>
                <span className="text-emerald-600 font-semibold">99.8%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Cache Hit Rate</span>
                <span className="text-emerald-600 font-semibold">87%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
