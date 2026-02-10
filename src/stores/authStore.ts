import { create } from "zustand";
import { User } from "../types";
import { db } from "../lib/database";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: (username: string, _password: string) => {
    const user: User = { username };
    db.saveUser(user);
    set({ user, isAuthenticated: true, isLoading: false });
    return true;
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
}));
