import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { LayoutDashboard, ListChecks, LogOut, ChevronLeft, ChevronRight } from "lucide-react";

const navItems = [
  { label: "Dashboard", path: "/dashboard", Icon: LayoutDashboard },
  { label: "Tasks", path: "/tasks", Icon: ListChecks },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    onMobileClose?.();
    navigate("/login");
  };

  const handleNav = (path: string) => {
    navigate(path);
    onMobileClose?.();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onMobileClose}
        />
      )}
      <aside
        className={`${
          collapsed ? "w-16" : "w-60"
        } min-h-screen bg-tasklify-purple flex flex-col p-3 gap-2 shadow-xl border-r-2 border-tasklify-border-dark transition-all duration-300 ${
          mobileOpen
            ? "fixed inset-y-0 left-0 z-40 md:relative"
            : "hidden md:flex"
        }`}
      >
      {/* Toggle + brand */}
      <div className="flex items-center justify-between mb-1">
        {!collapsed && (
          <h1 className="text-tasklify-gold font-bold text-xl tracking-wider pl-1">
            tasklify
          </h1>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-8 h-8 rounded-lg bg-tasklify-purple-dark/60 text-white flex items-center justify-center hover:bg-tasklify-purple-dark transition-all duration-300 text-sm mx-auto"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* User greeting */}
      {!collapsed ? (
        <div className="mb-3 px-3 py-3 bg-tasklify-purple-dark rounded-xl">
          <p className="text-tasklify-pink-card text-xs font-medium">Username:</p>
          <p className="text-white font-bold text-lg truncate">
            {user?.username || "Guest"}
          </p>
        </div>
      ) : (
        <div className="mb-3 w-10 h-10 mx-auto bg-tasklify-purple-dark rounded-full flex items-center justify-center text-white font-bold text-sm" title={user?.username || "Guest"}>
          {(user?.username || "G")[0].toUpperCase()}
        </div>
      )}

      {/* Navigation */}
      <nav className="flex flex-col gap-1.5" aria-label="Main navigation">
        {navItems.map((item) => {
          const isActive = item.path === "/tasks" 
            ? location.pathname.startsWith("/tasks")
            : location.pathname === item.path;
          const Icon = item.Icon;

          return (
            <button
              key={item.path}
              onClick={() => handleNav(item.path)}
              aria-current={isActive ? "page" : undefined}
              title={collapsed ? item.label : undefined}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center ${
                collapsed ? "justify-center" : "gap-2.5"
              }
                ${
                  isActive
                    ? "bg-tasklify-gold text-tasklify-purple-dark shadow-md scale-[1.02]"
                    : "bg-tasklify-purple-dark text-white hover:bg-tasklify-purple-mid hover:scale-[1.01]"
                }`}
            >
              <Icon size={18} strokeWidth={2} />
              {!collapsed && item.label}
            </button>
          );
        })}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Logout */}
      <button
        onClick={handleLogout}
        title={collapsed ? "Logout" : undefined}
        className={`w-full px-3 py-2.5 rounded-lg text-sm font-semibold bg-tasklify-pink-dark text-white hover:bg-tasklify-pink transition-all duration-300 flex items-center ${
          collapsed ? "justify-center" : "gap-2"
        }`}
      >
        <LogOut size={18} strokeWidth={2} />
        {!collapsed && "Logout"}
      </button>
    </aside>
    </>
  );
}
