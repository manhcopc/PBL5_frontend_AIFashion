import { useEffect, useState, useCallback } from "react";
import { Search, Filter } from "lucide-react";
import { useAdminActions } from "@/hooks/useAdminActions";
import { UserTable } from "@/components/admin/UserTable";
import { ManageUserModal } from "@/components/admin/ManageUserModal";
import type { AdminUser } from "@/features/admin/types/admin.types";

export const UserManagement = () => {
  const {
    users,
    loading,
    error,
    pagination,
    filters,
    fetchUsers,
    searchUsers,
    filterByPlan,
    topUpUserCredits,
    // changeUserPlan,
    deleteUserAccount,
    nextPage,
    prevPage,
  } = useAdminActions();

  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<{
    userId: string;
    userName: string;
  } | null>(null);

  const handleInitialFetch = useCallback(() => {
    void fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    handleInitialFetch();
  }, [handleInitialFetch]);

  useEffect(() => {
    void fetchUsers();
  }, [filters, fetchUsers]);

  const handleSearch = (value: string) => {
    setSearchInput(value);
    searchUsers(value);
  };

  const handleManageClick = (user: AdminUser) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (userId: string, userName: string) => {
    setDeleteConfirm({ userId, userName });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    const success = await deleteUserAccount(deleteConfirm.userId);
    if (success) {
      setDeleteConfirm(null);
    }
  };

  const handleTopUp = async (amount: number) => {
    if (!selectedUser) return false;
    const userId = selectedUser._id || selectedUser.id;
    if (!userId) return false;
    return topUpUserCredits(userId, amount);
  };

  // const handlePlanChange = async (newPlan: "Free" | "Pro" | "Enterprise") => {
  //   if (!selectedUser) return false;
  //   return changeUserPlan(selectedUser._id, newPlan);
  // };

  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b border-zinc-800 px-8 py-6">
        <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
        <p className="text-zinc-400">Manage users, credits, and plans</p>
      </div>

      <div className="flex-1 overflow-auto p-8">
        <div className="space-y-6">
          {error && (
            <div className="p-4 bg-red-900/20 border border-red-700/50 rounded-lg flex items-center gap-3">
              <div>
                <p className="font-medium text-red-300">Error</p>
                <p className="text-sm text-red-200">{error}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="text"
                placeholder="Search by email..."
                value={searchInput}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 transition-all"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-zinc-400" />
              <select
                value={filters.plan}
                onChange={(e) =>
                  filterByPlan(
                    e.target.value as "All" | "Free" | "Pro" | "Enterprise"
                  )
                }
                className="flex-1 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 transition-all"
              >
                <option value="All">All Plans</option>
                <option value="Free">Free</option>
                <option value="Pro">Pro</option>
                <option value="Enterprise">Enterprise</option>
              </select>
            </div>
          </div>

          <UserTable
            users={users}
            isLoading={loading}
            onManage={handleManageClick}
            onDelete={handleDeleteClick}
          />

          {pagination.total > 0 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-400">
                Showing{" "}
                {users.length > 0
                  ? (pagination.page - 1) * pagination.limit + 1
                  : 0}
                -
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={prevPage}
                  disabled={pagination.page === 1 || loading}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-900 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm font-medium"
                >
                  Previous
                </button>
                <button
                  onClick={nextPage}
                  disabled={
                    pagination.page * pagination.limit >= pagination.total ||
                    loading
                  }
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-900 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm font-medium"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedUser && (
        <ManageUserModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedUser(null);
          }}
          userName={selectedUser.username}
          currentCredits={
            selectedUser.available_credits ?? selectedUser.creditsRemaining ?? 0
          }
          // currentPlan={selectedUser.plan}
          onTopUp={handleTopUp}
          // onPlanChange={handlePlanChange}
          isLoading={loading}
          error={error}
        />
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-sm">
            <h2 className="text-xl font-bold text-white mb-2">Delete User?</h2>
            <p className="text-zinc-400 mb-6">
              Are you sure you want to delete{" "}
              <strong>{deleteConfirm.userName}</strong>? This action cannot be
              undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
