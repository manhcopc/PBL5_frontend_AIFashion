import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/login_page";
import Workspace from "./pages/Workspace/Workspace";
import DesignStudio from "./pages/DesignStudio/DesignStudio";
import CreateDesign from "./pages/Design/CreateDesign";
import { AdminDashboard } from "./pages/Admin/AdminDashboard";
import { UserManagement } from "./pages/Admin/UserManagement";
import { AdminLayout } from "./components/layout/AdminLayout";
import { useAuthStore } from "./features/auth/state/use-auth-store";
import { UserProvider } from "./store/UserContext";
import UserLayout from "./components/layout/UserLayout";

function App() {
  useEffect(() => {
    // Initialize auth state from localStorage on app load
    useAuthStore.getState().initializeAuth();
  }, []);

  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<UserLayout />}>
            <Route path="/workspace" element={<Workspace />} />
            <Route path="/design-studio" element={<DesignStudio />} />
            <Route path="/create-design" element={<CreateDesign />} />
          </Route>
          <Route
            path="/admin"
            element={
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminLayout>
                <UserManagement />
              </AdminLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}
export default App;
