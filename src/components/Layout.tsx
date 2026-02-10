import { useState, useEffect, useCallback } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { useTaskStore } from "../stores/taskStore";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";

export default function Layout() {
  const { isAuthenticated } = useAuthStore();
  const loadTasks = useTaskStore((state) => state.loadTasks);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Re-check missed tasks when app regains focus (e.g. after midnight)
  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState === "visible") loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [handleVisibilityChange]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-tasklify-bg-light">
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <main className="flex-1 p-6 overflow-auto min-w-0">
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden mb-4 p-2 rounded-lg bg-tasklify-purple text-white hover:bg-tasklify-purple-dark transition-all duration-300 hover:scale-105"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        <Outlet />
      </main>
    </div>
  );
}
