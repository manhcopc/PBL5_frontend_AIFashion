import { useState } from "react";

import { AdminSidebar } from "../admin/AdminSidebar";
import { Outlet } from "react-router-dom";
import { useAuthStore } from "@/features/auth/state/use-auth-store";

// interface AdminLayoutProps {
//   children: ReactNode;
// }

export const AdminLayout = () => {
  const { isLoading } = useAuthStore();
  // const { stats, loading, error, fetchStats, fetchUsers } = useAdminActions();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-white">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // NOTE: ProtectedRoute already validates auth and role
  // This component just renders the admin layout wrapper
  // return <>{children}</>;
  return (
    <>
      <div className="flex h-screen bg-black text-white overflow-hidden">
        <AdminSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <Outlet />
      </div>
    </>
  );
};
