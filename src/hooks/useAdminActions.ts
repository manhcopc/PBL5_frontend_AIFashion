import { useCallback } from "react";
import { useAdminStore } from "@/store/useAdminStore";
import { adminService } from "@/services/adminService";
import { fetchListUsers, deleteUser } from "@/features/user/api/user.service";
import { mapAdminStats } from "@/features/admin/types/admin.maps";

export const useAdminActions = () => {
  const {
    users,
    setUsers,
    setLoading,
    setError,
    setStats,
    setPagination,
    setFilters,
    pagination,
    filters,
    updateUserCredits,
    updateUserPlan,
    removeUser,
    clearError,
  } = useAdminStore();

  /**
   * Fetch users with current filters and pagination
   */
  const fetchUsers = useCallback(
    async (page?: number) => {
      setLoading(true);
      clearError();
      try {
        const currentPage = page || pagination.page;
        // const filterParams = {
        //   email: filters.email || undefined,
        //   plan: filters.plan !== "All" ? filters.plan : undefined,
        // };

        const data = await fetchListUsers();
        // currentPage,
        // pagination.limit,
        // filterParams
        console.log("[useAdminAction] Fetched users:", data);
        setUsers(data);
        setPagination({
          page: currentPage,
          limit: pagination.limit,
          total: data.total,
        });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch users";
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [
      // pagination.page,
      // pagination.limit,
      // filters,
      setUsers,
      setLoading,
      setError,
      setPagination,
      clearError,
    ]
  );

  /**
   * Fetch dashboard statistics
   */
  const fetchStats = useCallback(async () => {
    try {
      // const stats = await adminService.getStats();
      // console.log("[useAdminAction] Fetched stats:", stats);
      // setStats(stats);
      const res = await adminService.getStats();

      const mappedStats = mapAdminStats(res);

      setStats(mappedStats);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch stats";
      setError(message);
    }
  }, [setStats, setError]);

  /**
   * Search/filter users by email
   */
  const searchUsers = useCallback(
    (email: string) => {
      setFilters({ email });
    },
    [setFilters]
  );

  /**
   * Filter users by plan
   */
  const filterByPlan = useCallback(
    (plan: "All" | "Free" | "Pro" | "Enterprise") => {
      setFilters({ plan });
    },
    [setFilters]
  );

  /**
   * Top-up user credits with validation
   */
  const topUpUserCredits = useCallback(
    async (userId: string, amount: number) => {
      if (amount <= 0) {
        setError("Credits amount must be positive");
        return false;
      }

      setLoading(true);
      clearError();
      try {
        const result = await adminService.topUpCredits({ userId, amount });
        if (result.success) {
          updateUserCredits(userId, result.newBalance);
          return true;
        }
        return false;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to top-up credits";
        setError(message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [updateUserCredits, setLoading, setError, clearError]
  );

  /**
   * Change user plan
   */
  const changeUserPlan = useCallback(
    async (userId: string, newPlan: "Free" | "Pro" | "Enterprise") => {
      setLoading(true);
      clearError();
      try {
        const result = await adminService.changePlan({ userId, newPlan });
        if (result.success) {
          updateUserPlan(userId, newPlan);
          return true;
        }
        return false;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to change plan";
        setError(message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [updateUserPlan, setLoading, setError, clearError]
  );

  /**
   * Delete a user
   */
  const deleteUserAccount = useCallback(
    async (userId: string) => {
      setLoading(true);
      clearError();
      try {
        const result = await deleteUser(userId);
        if (result.success) {
          removeUser(userId);
          return true;
        }
        return false;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to delete user";
        setError(message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [removeUser, setLoading, setError, clearError]
  );

  /**
   * Paginate to next page
   */
  const nextPage = useCallback(() => {
    if (pagination.page * pagination.limit < pagination.total) {
      void fetchUsers(pagination.page + 1);
    }
  }, [pagination, fetchUsers]);

  /**
   * Paginate to previous page
   */
  const prevPage = useCallback(() => {
    if (pagination.page > 1) {
      void fetchUsers(pagination.page - 1);
    }
  }, [pagination, fetchUsers]);

  return {
    users,
    stats: useAdminStore((state) => state.stats),
    loading: useAdminStore((state) => state.loading),
    error: useAdminStore((state) => state.error),
    pagination,
    filters,
    fetchUsers,
    fetchStats,
    searchUsers,
    filterByPlan,
    topUpUserCredits,
    changeUserPlan,
    deleteUserAccount,
    nextPage,
    prevPage,
    clearError,
  };
};
