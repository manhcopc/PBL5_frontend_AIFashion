import { useEffect, useState, useCallback } from "react";
import { Menu, X, AlertCircle } from "lucide-react";
import { useAdminActions } from "@/hooks/useAdminActions";
import { StatsGrid } from "@/components/admin/StatsGrid";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

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
    <div className="flex h-screen bg-black text-white overflow-hidden">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-auto">
        <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-md border-b border-zinc-800 px-6 py-4 flex items-center justify-between md:hidden">
          <h1 className="text-lg font-semibold">Admin Dashboard</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            {sidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        <div className="border-b border-zinc-800 px-8 py-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            Dashboard Analytics
          </h1>
          <p className="text-zinc-400">
            Overview of your system metrics and performance
          </p>
        </div>

        <div className="flex-1 overflow-auto p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-700/50 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <div>
                <p className="font-medium text-red-300">Error</p>
                <p className="text-sm text-red-200">{error}</p>
              </div>
            </div>
          )}

          <StatsGrid stats={stats} isLoading={loading} />

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <button className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors text-sm">
                  Export User Report
                </button>
                <button className="w-full px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-colors text-sm">
                  View Detailed Logs
                </button>
                <button className="w-full px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-colors text-sm">
                  System Health Check
                </button>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                System Status
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">API Response Time</span>
                  <span className="text-emerald-400 font-semibold">45ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Database Status</span>
                  <span className="text-emerald-400 font-semibold">
                    Healthy
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Server Uptime</span>
                  <span className="text-emerald-400 font-semibold">99.8%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Cache Hit Rate</span>
                  <span className="text-emerald-400 font-semibold">87%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
