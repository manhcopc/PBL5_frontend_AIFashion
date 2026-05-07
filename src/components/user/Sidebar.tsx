import {
  LayoutDashboard,
  FolderKanban,
  CreditCard,
  Settings,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const [activePath, setActivePath] = useState("/workspace");

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
    <aside className="w-64 bg-zinc-950 border-r border-zinc-900 h-screen flex flex-col justify-between hidden md:flex">
      <div>
        <div className="p-6 flex items-center gap-2">
          <span className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg p-1.5 text-white">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2v20 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </span>
          <h1 className="text-xl font-bold tracking-tight text-white">
            StyleAI
          </h1>
        </div>

        <nav className="px-4 space-y-1">
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                navigate(item.path);
                setActivePath(item.path);
              }} // Điều hướng tới đường dẫn
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activePath === item.path
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-zinc-900">
        <button
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
          onClick={() => navigate("/login")}
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};
