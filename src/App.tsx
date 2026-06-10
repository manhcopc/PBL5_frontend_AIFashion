import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/state/use-auth-store";

import Login from "@/pages/auth/login_page";
import { UnauthorizedPage } from "@/pages/auth/unauthorized_page";
import { RootPage } from "@/pages/RootPage";

import Workspace from "@/pages/Workspace/Workspace";
import DesignStudio from "@/pages/DesignStudio/DesignStudio";
import CreateDesign from "@/pages/Design/CreateDesign";
import Billing from "@/pages/Billing/Billing";
import UserSettings from "@/pages/Settings/UserSettings";
import ProjectDetail from "@/pages/Workspace/ProjectDetail";
import { AdminDashboard } from "@/pages/Admin/AdminDashboard";
import { UserManagement } from "@/pages/Admin/UserManagement";
import { CreditLogs } from "@/pages/Admin/CreditLogs";
import { SubscriptionPlans } from "@/pages/Admin/SubscriptionPlans";

import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { AdminLayout } from "@/components/layout/AdminLayout";
import UserLayout from "@/components/layout/UserLayout";
import { UserProvider } from "@/store/UserContext";
import { Settings as AdminSettings } from "./pages/Admin/Settings";

function App() {
  const validateAndRestoreAuth = useAuthStore(
    (state) => state.validateAndRestoreAuth
  );

  useEffect(() => {
    /**
     * On app initialization:
     * 1. Check if token exists in localStorage
     * 2. Validate token (not expired)
     * 3. Restore user from token
     * 4. Set authentication state
     */
    void validateAndRestoreAuth();
  }, [validateAndRestoreAuth]);

  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          {/* Root route - redirects based on auth status */}
          <Route path="/" element={<RootPage />} />

          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* User routes - protected, requires user role */}
          <Route
            element={
              <ProtectedRoute requiredRole={["user", "admin"]}>
                <UserLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/workspace" element={<Workspace />} />
            <Route path="/design-studio" element={<DesignStudio />} />
            <Route path="/create-design" element={<CreateDesign />} />
            <Route path="/billing" element={<Billing />} />{" "}
            <Route path="/settings" element={<UserSettings />} />
            <Route
              path="/workspace/:projectId"
              element={<ProjectDetail />}
            />{" "}
          </Route>

          {/* Admin routes - protected, requires admin role only */}
          <Route
            element={
              <ProtectedRoute requiredRole={["admin"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/credit-logs" element={<CreditLogs />} />
            <Route path="/admin/subscription-plans" element={<SubscriptionPlans />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>

          {/* Catch all - redirect to root */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
