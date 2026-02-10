import { create } from "zustand";
import { Task, TaskPriority, FilterType, SortBy, SortOrder, ToastMessage } from "../types";
import { db, seedSampleData, parseLocalDate } from "../lib/database";

// ─── Toast Store ─────────────────────────────────────────────
interface ToastState {
  toasts: ToastMessage[];
  addToast: (text: string, type?: ToastMessage["type"]) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (text, type = "success") => {
    const id = crypto.randomUUID();
    set((s) => ({ toasts: [...s.toasts, { id, text, type }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 3000);
  },
  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

// ─── Priority sort weight ────────────────────────────────────
const priorityWeight: Record<TaskPriority, number> = {
  urgent: 0,
  high: 1,
  medium: 2,
  low: 3,
};

// ─── Task Store ──────────────────────────────────────────────
interface TaskState {
  tasks: Task[];
  filter: FilterType;
  searchQuery: string;
  sortBy: SortBy;
  sortOrder: SortOrder;
  showAddForm: boolean;
  editingTask: Task | null;
  confirmDelete: Task | null;

  loadTasks: () => void;
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  setFilter: (filter: FilterType) => void;
  setSearchQuery: (q: string) => void;
  setSortBy: (s: SortBy) => void;
  setSortOrder: (o: SortOrder) => void;
  setShowAddForm: (show: boolean) => void;
  setEditingTask: (task: Task | null) => void;
  setConfirmDelete: (task: Task | null) => void;
}

const SEEDED_KEY = "tasklify_seeded_users";

const hasBeenSeeded = (username: string | null): boolean => {
  if (!username) return false;
  try {
    const data = localStorage.getItem(SEEDED_KEY);
    if (!data) return false;
    const seededUsers: string[] = JSON.parse(data);
    return seededUsers.includes(username);
  } catch {
    return false;
  }
};

const markAsSeeded = (username: string | null): void => {
  if (!username) return;
  try {
    const data = localStorage.getItem(SEEDED_KEY);
    const seededUsers: string[] = data ? JSON.parse(data) : [];
    if (!seededUsers.includes(username)) {
      seededUsers.push(username);
      localStorage.setItem(SEEDED_KEY, JSON.stringify(seededUsers));
    }
  } catch {}
};

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  filter: "all",
  searchQuery: "",
  sortBy: "deadline",
  sortOrder: "asc",
  showAddForm: false,
  editingTask: null,
  confirmDelete: null,

  loadTasks: () => {
    db.migrateUserTasks();
    const user = db.getUser();
    const username = user?.username || null;
    if (!hasBeenSeeded(username)) {
      seedSampleData();
      markAsSeeded(username);
    }
    db.autoDetectMissed();
    const tasks = db.getTasks();
    set({ tasks });
  },

  addTask: (taskData) => {
    const now = new Date().toISOString();
    const task: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    if (!db.addTask(task)) {
      useToastStore.getState().addToast("Storage full — could not save task", "error");
    }
    set({ tasks: db.getTasks() });
  },

  updateTask: (id, updates) => {
    if (!db.updateTask(id, updates)) {
      useToastStore.getState().addToast("Storage full — could not save changes", "error");
    }
    set({ tasks: db.getTasks() });
  },

  deleteTask: (id) => {
    db.deleteTask(id);
    set({ tasks: db.getTasks(), confirmDelete: null });
  },

  setFilter: (filter) => set({ filter }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSortOrder: (sortOrder) => set({ sortOrder }),
  setShowAddForm: (show) => set({ showAddForm: show }),
  setEditingTask: (task) => set({ editingTask: task }),
  setConfirmDelete: (task) => set({ confirmDelete: task }),
}));

// ─── Derived selectors (reactive — called in component render) ──
export const useFilteredTasks = (): Task[] => {
  const { tasks, filter, searchQuery, sortBy, sortOrder } = useTaskStore();
  let result = [...tasks];

  // Filter by status
  if (filter !== "all") {
    result = result.filter((t) => t.status === filter);
  }

  // Search
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    result = result.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.details.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q),
    );
  }

  // Sort
  result.sort((a, b) => {
    let cmp = 0;
    switch (sortBy) {
      case "deadline":
        cmp = parseLocalDate(a.deadline).getTime() - parseLocalDate(b.deadline).getTime();
        break;
      case "created":
        cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case "alpha":
        cmp = a.title.localeCompare(b.title);
        break;
      case "priority":
        cmp = priorityWeight[a.priority] - priorityWeight[b.priority];
        break;
    }
    return sortOrder === "asc" ? cmp : -cmp;
  });

  return result;
};

export const useTasksByCategory = (): Record<string, Task[]> => {
  const filtered = useFilteredTasks();
  return filtered.reduce(
    (acc, task) => {
      if (!acc[task.category]) acc[task.category] = [];
      acc[task.category].push(task);
      return acc;
    },
    {} as Record<string, Task[]>,
  );
};

export const useTaskStats = () => {
  const { tasks } = useTaskStore();
  const finished = tasks.filter((t) => t.status === "finished").length;
  const missed = tasks.filter((t) => t.status === "missed").length;
  const ongoing = tasks.filter((t) => t.status === "ongoing").length;
  const total = tasks.length;
  const progress = total === 0 ? 0 : Math.round((finished / total) * 100);
  return { finished, missed, ongoing, total, progress };
};
