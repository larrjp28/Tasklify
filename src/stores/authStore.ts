import { create } from "zustand";
import { User } from "../types";
import { db } from "../lib/database";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, pin?: string) => { success: boolean; error?: string };
  logout: () => void;
  checkAuth: () => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: (username: string, pin?: string) => {
    // Check if a user already exists with this username
    const existing = db.getUserByUsername(username);
    if (existing && existing.pin) {
      // User has a PIN set — validate it
      if (!pin) return { success: false, error: "PIN required" };
      if (pin !== existing.pin) return { success: false, error: "Incorrect PIN" };
    }
    // If new user, check account limit
    if (!existing && !db.canAddAccount()) {
      return { success: false, error: "Account limit reached (max 5). Delete an account first." };
    }
    const user: User = existing || { username };
    db.saveUser(user);
    set({ user, isAuthenticated: true, isLoading: false });
    return { success: true };
  },

  logout: () => {
    db.clearUser();
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: () => {
    const user = db.getUser();
    if (user) {
      set({ user, isAuthenticated: true, isLoading: false });
    } else {
      set({ isLoading: false });
    }
  },

  updateUser: (updates: Partial<User>) => {
    const current = get().user;
    if (!current) return;
    const updated = { ...current, ...updates };
    db.saveUser(updated);
    // Also update the user profile storage
    db.saveUserProfile(updated);
    set({ user: updated });
  },
}));
