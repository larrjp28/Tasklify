import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const { login, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      login(username.trim(), "");
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-tasklify-bg-light flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-tasklify-purple/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-tasklify-pink/20 rounded-full blur-3xl" />
      </div>

      <div className="bg-white rounded-2xl border-4 border-tasklify-purple shadow-2xl w-full max-w-sm overflow-hidden relative z-10">
        {/* Header */}
        <div className="bg-tasklify-purple px-6 py-8 text-center">
          <h1 className="text-tasklify-gold font-bold text-4xl tracking-wider">
            tasklify
          </h1>
          <p className="text-tasklify-pink-card text-sm mt-2 opacity-90">
            manage your tasks, simply.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-tasklify-purple-dark font-bold text-sm mb-1.5">
              Username:
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full px-4 py-3 rounded-lg border-2 border-tasklify-purple-light bg-tasklify-pink-card/20 focus:border-tasklify-purple focus:outline-none text-sm transition-colors"
              required
              autoFocus
            />
          </div>

          <p className="text-tasklify-purple/60 text-xs text-center -mt-1">
            Just enter your name to get started — no password needed.
          </p>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-tasklify-purple font-bold text-white text-lg hover:bg-tasklify-purple-dark transition-colors duration-200 shadow-md mt-2"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
