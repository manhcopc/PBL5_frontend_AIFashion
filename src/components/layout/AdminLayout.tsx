import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { useAuthStore } from "@/features/auth/state/use-auth-store";

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const user = useAuthStore((state) => state.user);
  // const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isHydrated, setIsHydrated] = useState(false);

  // Wait for Zustand to hydrate from localStorage
  useEffect(() => {
    // Mark as hydrated after first render to ensure localStorage is read
    const timer = setTimeout(() => {
      setIsHydrated(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Show loading while hydrating
  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-white">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (user?.role !== "Admin") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-zinc-400 mb-4">
            You do not have permission to access the admin panel.
          </p>
          <p className="text-xs text-zinc-500">
            User: {user?.email || "Not logged in"} | Role: {user?.role || "N/A"}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
