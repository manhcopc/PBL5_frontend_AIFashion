import {
  LayoutDashboard,
  FolderKanban,
  CreditCard,
  Settings,
  LogOut,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/state/use-auth-store";

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);

  const navItems = [
    {
      icon: <FolderKanban className="w-5 h-5" />,
      label: "Workspace",
      path: "/workspace",
      active: true,
    },
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      label: "Design Studio",
      path: "/design-studio",
      active: false,
    },
    {
      icon: <CreditCard className="w-5 h-5" />,
      label: "Billing",
      path: "/billing",
      active: false,
    },
    {
      icon: <Settings className="w-5 h-5" />,
      label: "Settings",
      path: "/settings",
      active: false,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-zinc-200 h-screen flex flex-col justify-between hidden md:flex shadow-sm">
      <div>
        <div className="p-6 flex items-center gap-3">
          <img
            src="/logo.png"
            alt="TrendEngine logo"
            className="h-10 w-10 rounded-xl object-contain shadow-sm"
          />
          <h1 className="text-xl font-extrabold tracking-tight text-zinc-900">
            TrendEngine
          </h1>
        </div>

        <nav className="px-4 space-y-1.5 mt-2">
          {navItems.map((item, index) => {
            const isActive =
              item.path === "/workspace"
                ? location.pathname === "/workspace" ||
                  location.pathname.startsWith("/workspace/")
                : location.pathname.startsWith(item.path);
            return (
              <button
                key={index}
                onClick={() => {
                  navigate(item.path);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                    : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                }`}
              >
                <span
                  className={
                    isActive
                      ? "text-white"
                      : "text-zinc-400 group-hover:text-zinc-900"
                  }
                >
                  {item.icon}
                </span>
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-zinc-100">
        <button
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-zinc-500 hover:bg-rose-50 hover:text-rose-600 transition-all duration-200"
          onClick={() => {
            logout();
            navigate("/login", { replace: true });
          }}
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};
