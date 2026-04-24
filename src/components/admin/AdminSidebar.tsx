import { BarChart3, Users, CreditCard, RotateCcw } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const AdminSidebar = ({ isOpen = true, onClose }: AdminSidebarProps) => {
  const location = useLocation();

  const navItems = [
    {
      label: "Analytics",
      icon: BarChart3,
      href: "/admin",
    },
    {
      label: "User Management",
      icon: Users,
      href: "/admin/users",
    },
    {
      label: "Credit Logs",
      icon: CreditCard,
      href: "/admin/credits",
    },
    {
      label: "System Settings",
      icon: RotateCcw,
      href: "/admin/settings",
    },
  ];

  const isActive = (href: string) => {
    return (
      location.pathname === href || location.pathname.startsWith(href + "/")
    );
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-full z-40 bg-black border-r border-zinc-800 transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      } md:static md:translate-x-0 md:w-64`}
    >
      {/* Header */}
      <div className="h-20 flex items-center px-6 border-b border-zinc-800">
        <h1
          className={`font-bold text-xl transition-all ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            Admin
          </span>
        </h1>
        {!isOpen && <BarChart3 className="w-6 h-6 text-purple-400" />}
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => onClose?.()}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${
                active
                  ? "bg-purple-600/20 text-purple-400 border border-purple-500/30"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className={`transition-all ${isOpen ? "block" : "hidden"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        className={`absolute bottom-6 left-0 right-0 px-4 ${
          isOpen ? "block" : "hidden"
        }`}
      >
        <div className="p-4 bg-purple-900/20 border border-purple-700/30 rounded-lg text-xs text-zinc-300">
          <p className="font-semibold text-purple-400 mb-1">Pro Tip</p>
          <p>Use filters to quickly find users by plan or email.</p>
        </div>
      </div>
    </aside>
  );
};
