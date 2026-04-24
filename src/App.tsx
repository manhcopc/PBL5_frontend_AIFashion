import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/login_page";
import Workspace from "./pages/Workspace/Workspace";
import DesignStudio from "./pages/DesignStudio/DesignStudio";
import CreateDesign from "./pages/Design/CreateDesign";
import { UserProvider } from "./store/UserContext";
import UserLayout from "./components/layout/UserLayout";

function App() {
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
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}
export default App;
