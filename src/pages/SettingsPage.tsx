import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { useToastStore } from "../stores/taskStore";
import { db } from "../lib/database";
import { User as UserIcon, KeyRound, Shield, ShieldOff, Save, Eye, EyeOff, Trash2, Users } from "lucide-react";

export default function SettingsPage() {
  const { user, updateUser, logout } = useAuthStore();
  const { addToast } = useToastStore();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [pin, setPin] = useState(user?.pin || "");
  const [pinEnabled, setPinEnabled] = useState(!!user?.pin);
  const [showPin, setShowPin] = useState(false);
  const [confirmPin, setConfirmPin] = useState("");
  const [showConfirmPin, setShowConfirmPin] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ displayName: displayName.trim() || undefined });
    addToast("Profile updated", "success");
  };

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!pinEnabled) {
      updateUser({ pin: undefined });
      setPin("");
      setConfirmPin("");
      addToast("PIN lock disabled", "info");
      return;
    }

    if (!/^\d{4}$/.test(pin)) {
      addToast("PIN must be exactly 4 digits", "error");
      return;
    }

    if (pin !== confirmPin) {
      addToast("PINs don't match", "error");
      return;
    }

    updateUser({ pin });
    addToast("PIN saved! You'll need it next time you log in.", "success");
  };

  return (
    <div className="max-w-lg mx-auto animate-fade-in">
      <h1 className="text-tasklify-purple-dark font-bold text-2xl mb-6">Settings</h1>

      {/* Profile Section */}
      <div className="bg-white rounded-2xl border-[3px] border-tasklify-purple p-5 shadow-lg mb-6">
        <h2 className="font-bold text-tasklify-purple-dark text-lg mb-4 flex items-center gap-2">
          <UserIcon size={20} strokeWidth={2.5} />
          <span>Profile</span>
        </h2>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          {/* Username (read-only) */}
          <div>
            <label className="block text-tasklify-purple-dark font-bold text-sm mb-1">
              Username
            </label>
            <input
              type="text"
              value={user?.username || ""}
              disabled
              className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 bg-gray-50 text-gray-400 text-sm cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 mt-1">Username cannot be changed</p>
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-tasklify-purple-dark font-bold text-sm mb-1">
              Display Name
            </label>
            <div className="relative">
              <UserIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-tasklify-purple" />
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="How should we greet you?"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border-2 border-tasklify-purple-light bg-tasklify-pink-card/20 focus:border-tasklify-purple focus:outline-none text-sm transition-all duration-300"
              />
            </div>
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-tasklify-purple text-white font-semibold text-sm hover:bg-tasklify-purple-dark transition-all duration-300 hover:scale-[1.02] shadow-md"
          >
            <Save size={16} />
            Save Profile
          </button>
        </form>
      </div>

      {/* Security Section */}
      <div className="bg-white rounded-2xl border-[3px] border-tasklify-purple p-5 shadow-lg">
        <h2 className="font-bold text-tasklify-purple-dark text-lg mb-4 flex items-center gap-2">
          <KeyRound size={20} strokeWidth={2.5} />
          <span>Security</span>
        </h2>

        <form onSubmit={handleSavePin} className="space-y-4">
          {/* Toggle PIN */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-tasklify-pink-card/30 border border-tasklify-purple-light">
            <div className="flex items-center gap-3">
              {pinEnabled ? (
                <Shield size={20} className="text-tasklify-green" />
              ) : (
                <ShieldOff size={20} className="text-gray-400" />
              )}
              <div>
                <p className="text-sm font-bold text-tasklify-purple-dark">
                  4-Digit PIN Lock
                </p>
                <p className="text-xs text-gray-500">
                  {pinEnabled ? "Require PIN when logging in" : "No PIN protection"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setPinEnabled(!pinEnabled);
                if (pinEnabled) {
                  setPin("");
                  setConfirmPin("");
                }
              }}
              className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                pinEnabled ? "bg-tasklify-purple" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${
                  pinEnabled ? "left-[26px]" : "left-0.5"
                }`}
              />
            </button>
          </div>

          {/* PIN inputs (shown when enabled) */}
          {pinEnabled && (
            <div className="space-y-3 animate-in">
              <div>
                <label className="block text-tasklify-purple-dark font-bold text-sm mb-1">
                  Enter PIN
                </label>
                <div className="relative">
                  <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-tasklify-purple" />
                  <input
                    type={showPin ? "text" : "password"}
                    value={pin}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                      setPin(val);
                    }}
                    placeholder="••••"
                    className="w-full pl-10 pr-12 py-2.5 rounded-lg border-2 border-tasklify-purple-light bg-tasklify-pink-card/20 focus:border-tasklify-purple focus:outline-none text-sm tracking-[0.5em] text-center font-mono transition-all duration-300"
                    maxLength={4}
                    inputMode="numeric"
                    autoComplete="off"
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

              <div>
                <label className="block text-tasklify-purple-dark font-bold text-sm mb-1">
                  Confirm PIN
                </label>
                <div className="relative">
                  <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-tasklify-purple" />
                  <input
                    type={showConfirmPin ? "text" : "password"}
                    value={confirmPin}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                      setConfirmPin(val);
                    }}
                    placeholder="••••"
                    className="w-full pl-10 pr-12 py-2.5 rounded-lg border-2 border-tasklify-purple-light bg-tasklify-pink-card/20 focus:border-tasklify-purple focus:outline-none text-sm tracking-[0.5em] text-center font-mono transition-all duration-300"
                    maxLength={4}
                    inputMode="numeric"
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPin(!showConfirmPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-tasklify-purple/60 hover:text-tasklify-purple transition-colors"
                  >
                    {showConfirmPin ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {pin.length === 4 && confirmPin.length === 4 && pin !== confirmPin && (
                <p className="text-xs text-tasklify-pink-dark font-medium">PINs don't match</p>
              )}
            </div>
          )}

          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-tasklify-purple text-white font-semibold text-sm hover:bg-tasklify-purple-dark transition-all duration-300 hover:scale-[1.02] shadow-md"
          >
            <Save size={16} />
            {pinEnabled ? "Save PIN" : "Remove PIN"}
          </button>
        </form>
      </div>

      {/* Account Management Section */}
      <div className="bg-white rounded-2xl border-[3px] border-tasklify-purple p-5 shadow-lg mt-6">
        <h2 className="font-bold text-tasklify-purple-dark text-lg mb-4 flex items-center gap-2">
          <Users size={20} strokeWidth={2.5} />
          <span>Accounts</span>
        </h2>

        <div className="space-y-2 mb-4">
          {db.getUserProfiles().map((account) => {
            const isCurrent = account.username.toLowerCase() === user?.username.toLowerCase();
            return (
              <div
                key={account.username}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-300 ${
                  isCurrent
                    ? "border-tasklify-purple bg-tasklify-purple/5"
                    : "border-tasklify-purple-light/50"
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-tasklify-purple flex items-center justify-center text-white font-bold text-xs shrink-0">
                  {(account.displayName || account.username)[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-tasklify-purple-dark text-sm truncate">
                    {account.displayName || account.username}
                    {isCurrent && (
                      <span className="ml-2 text-[10px] px-1.5 py-0.5 bg-tasklify-green/20 text-green-700 rounded font-bold">
                        YOU
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-400 truncate">@{account.username}</p>
                </div>
                {account.pin && <KeyRound size={12} className="text-tasklify-purple/40 shrink-0" />}
              </div>
            );
          })}
        </div>

        <p className="text-xs text-gray-400 mb-4">
          {db.getUserProfiles().length}/5 accounts used
        </p>

        {/* Delete current account */}
        <button
          type="button"
          onClick={() => {
            if (confirm(`Permanently delete your account "${user?.username}" and all your tasks? This cannot be undone.`)) {
              const username = user?.username;
              logout();
              if (username) db.deleteUserProfile(username);
              addToast("Account deleted", "info");
              navigate("/login");
            }
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 border-red-200 text-tasklify-pink-dark text-sm font-semibold hover:bg-red-50 hover:border-red-300 transition-all duration-300"
        >
          <Trash2 size={16} />
          Delete My Account
        </button>
      </div>
    </div>
  );
}
