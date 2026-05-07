import { BarChart3, Users, CreditCard, RotateCcw, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

interface AdminSidebarProps {
  isOpen?: boolean; // Vẫn giữ để điều khiển mobile drawer nếu cần
  onClose?: () => void;
}

export const AdminSidebar = ({ isOpen, onClose }: AdminSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: "Analytics", icon: BarChart3, href: "/admin" },
    { label: "User Management", icon: Users, href: "/admin/users" },
    { label: "Credit Logs", icon: CreditCard, href: "/admin/credit-logs" },
    { label: "System Settings", icon: RotateCcw, href: "/admin/settings" },
  ];

  // Kiểm tra active dựa trên URL thực tế (nguồn sự thật duy nhất)
  const isActive = (href: string) => {
    if (href === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(href);
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen z-40 bg-black border-r border-zinc-900 flex flex-col justify-between transition-transform duration-300 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:relative md:translate-x-0 md:w-64 shrink-0`}
    >
      <div>
        {/* Logo Header */}
        <div className="h-20 flex items-center px-6 gap-3 border-b border-zinc-900">
          <span className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg p-1.5 text-white">
            <BarChart3 className="w-5 h-5" />
          </span>
          <h1 className="text-xl font-bold tracking-tight text-white whitespace-nowrap">
            AdminAI
          </h1>
        </div>

        {/* Navigation - Luôn hiển thị chữ như mẫu bạn gửi */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => onClose?.()}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="whitespace-nowrap">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Logout */}
      <div className="p-4 border-t border-zinc-900">
        <button
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
          onClick={() => navigate("/login")}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
