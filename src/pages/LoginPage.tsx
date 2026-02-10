import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { db } from "../lib/database";
import { User as UserType } from "../types";
import { User, KeyRound, Eye, EyeOff, Plus, Trash2, ArrowLeft } from "lucide-react";

type View = "picker" | "new" | "pin";

export default function LoginPage() {
  const [view, setView] = useState<View>("picker");
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState("");
  const [selectedAccount, setSelectedAccount] = useState<UserType | null>(null);
  const [, forceRender] = useState(0);
  const { login, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const accounts = db.getUserProfiles();
  const canAdd = accounts.length < 5;

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleAccountClick = (account: UserType) => {
    setError("");
    setPin("");
    setShowPin(false);
    if (account.pin) {
      setSelectedAccount(account);
      setView("pin");
    } else {
      const result = login(account.username);
      if (result.success) navigate("/dashboard");
      else setError(result.error || "Login failed");
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccount) return;
    if (pin.length !== 4) {
      setError("Please enter your 4-digit PIN");
      return;
    }
    const result = login(selectedAccount.username, pin);
    if (result.success) navigate("/dashboard");
    else setError(result.error || "Login failed");
  };

  const handleNewAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    // Check if account already exists
    const existing = db.getUserByUsername(username.trim());
    if (existing) {
      handleAccountClick(existing);
      return;
    }

    const result = login(username.trim());
    if (result.success) navigate("/dashboard");
    else setError(result.error || "Login failed");
  };

  const handleDeleteAccount = (e: React.MouseEvent, account: UserType) => {
    e.stopPropagation();
    if (confirm(`Delete "${account.displayName || account.username}" and all their tasks?`)) {
      db.deleteUserProfile(account.username);
      setError("");
      forceRender((n) => n + 1);
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

        <div className="p-6">
          {/* ── Account Picker View ── */}
          {view === "picker" && (
            <div className="animate-fade-in">
              {accounts.length > 0 ? (
                <>
                  <p className="text-tasklify-purple-dark font-bold text-sm mb-3">
                    Choose an account:
                  </p>
                  <div className="space-y-2 mb-4 max-h-[240px] overflow-y-auto">
                    {accounts.map((account) => (
                      <button
                        key={account.username}
                        onClick={() => handleAccountClick(account)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-tasklify-purple-light hover:border-tasklify-purple bg-tasklify-pink-card/20 hover:bg-tasklify-pink-card/40 transition-all duration-300 group text-left"
                      >
                        <div className="w-10 h-10 rounded-full bg-tasklify-purple flex items-center justify-center text-white font-bold text-sm shrink-0">
                          {(account.displayName || account.username)[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-tasklify-purple-dark text-sm truncate">
                            {account.displayName || account.username}
                          </p>
                          {account.displayName && (
                            <p className="text-xs text-gray-400 truncate">@{account.username}</p>
                          )}
                        </div>
                        {account.pin && (
                          <KeyRound size={14} className="text-tasklify-purple/50 shrink-0" />
                        )}
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={(e) => handleDeleteAccount(e, account)}
                          onKeyDown={(e) => { if (e.key === "Enter") handleDeleteAccount(e as unknown as React.MouseEvent, account); }}
                          className="p-1.5 rounded-lg text-gray-300 hover:text-tasklify-pink-dark hover:bg-red-50 transition-all duration-300 opacity-0 group-hover:opacity-100 shrink-0"
                          title="Delete account"
                        >
                          <Trash2 size={14} />
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center mb-4">
                  <User size={32} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">No accounts yet</p>
                </div>
              )}

              {error && (
                <p className="text-tasklify-pink-dark text-xs font-semibold text-center mb-3">{error}</p>
              )}

              {canAdd ? (
                <button
                  onClick={() => { setView("new"); setError(""); setUsername(""); }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border-2 border-dashed border-tasklify-purple-light text-tasklify-purple font-semibold text-sm hover:border-tasklify-purple hover:bg-tasklify-purple/5 transition-all duration-300"
                >
                  <Plus size={18} />
                  Add Account
                </button>
              ) : (
                <p className="text-xs text-gray-400 text-center">
                  Account limit reached (5/5). Delete one to add new.
                </p>
              )}

              <p className="text-[10px] text-gray-300 text-center mt-3">
                {accounts.length}/5 accounts
              </p>
            </div>
          )}

          {/* ── New Account View ── */}
          {view === "new" && (
            <form onSubmit={handleNewAccount} className="space-y-4 animate-fade-in">
              <button
                type="button"
                onClick={() => { setView("picker"); setError(""); }}
                className="flex items-center gap-1.5 text-tasklify-purple text-sm font-semibold hover:text-tasklify-purple-dark transition-colors"
              >
                <ArrowLeft size={16} />
                Back to accounts
              </button>

              <div className="relative">
                <label className="block text-tasklify-purple-dark font-bold text-sm mb-1.5">
                  Username:
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-tasklify-purple" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); setError(""); }}
                    placeholder="Enter a new username"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-tasklify-purple-light bg-tasklify-pink-card/20 focus:border-tasklify-purple focus:outline-none text-sm transition-all duration-300"
                    required
                    autoFocus
                  />
                </div>
              </div>

              {error && (
                <p className="text-tasklify-pink-dark text-xs font-semibold text-center">{error}</p>
              )}

              <p className="text-tasklify-purple/60 text-xs text-center">
                Pick a unique name. You can set a PIN later in Settings.
              </p>

              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-tasklify-purple font-bold text-white text-lg hover:bg-tasklify-purple-dark transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02]"
              >
                Create Account
              </button>
            </form>
          )}

          {/* ── PIN Entry View ── */}
          {view === "pin" && selectedAccount && (
            <form onSubmit={handlePinSubmit} className="space-y-4 animate-fade-in">
              <button
                type="button"
                onClick={() => { setView("picker"); setError(""); setPin(""); }}
                className="flex items-center gap-1.5 text-tasklify-purple text-sm font-semibold hover:text-tasklify-purple-dark transition-colors"
              >
                <ArrowLeft size={16} />
                Back to accounts
              </button>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-tasklify-pink-card/30 border border-tasklify-purple-light">
                <div className="w-10 h-10 rounded-full bg-tasklify-purple flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {(selectedAccount.displayName || selectedAccount.username)[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-tasklify-purple-dark text-sm">
                    {selectedAccount.displayName || selectedAccount.username}
                  </p>
                  {selectedAccount.displayName && (
                    <p className="text-xs text-gray-400">@{selectedAccount.username}</p>
                  )}
                </div>
              </div>

              <div className="relative">
                <label className="block text-tasklify-purple-dark font-bold text-sm mb-1.5">
                  Enter PIN:
                </label>
                <div className="relative">
                  <KeyRound size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-tasklify-purple" />
                  <input
                    type={showPin ? "text" : "password"}
                    value={pin}
                    onChange={(e) => {
                      setPin(e.target.value.replace(/\D/g, "").slice(0, 4));
                      setError("");
                    }}
                    placeholder="••••"
                    className="w-full pl-10 pr-12 py-3 rounded-lg border-2 border-tasklify-purple-light bg-tasklify-pink-card/20 focus:border-tasklify-purple focus:outline-none text-sm tracking-[0.5em] text-center font-mono transition-all duration-300"
                    maxLength={4}
                    inputMode="numeric"
                    autoComplete="off"
                    autoFocus
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-tasklify-purple/60 hover:text-tasklify-purple transition-colors"
                  >
                    {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-tasklify-pink-dark text-xs font-semibold text-center">{error}</p>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-tasklify-purple font-bold text-white text-lg hover:bg-tasklify-purple-dark transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02]"
              >
                Unlock
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
