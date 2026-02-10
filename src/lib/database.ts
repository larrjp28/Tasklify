import { Task, User } from "../types";

const TASKS_KEY_PREFIX = "tasklify_tasks";
const USER_KEY = "tasklify_user";

/** Get the current logged-in username for namespacing tasks per user */
const getCurrentUsername = (): string | null => {
  try {
    const data = localStorage.getItem(USER_KEY);
    if (data) {
      const user = JSON.parse(data);
      return user.username || null;
    }
  } catch {}
  return null;
};

/** Get the user-scoped tasks storage key */
const getTasksKey = (): string => {
  const username = getCurrentUsername();
  return username ? `${TASKS_KEY_PREFIX}_${username}` : TASKS_KEY_PREFIX;
};

/** Parse a date-only string safely in local timezone (fixes UTC off-by-one) */
export const parseLocalDate = (dateStr: string): Date => {
  if (!dateStr) return new Date(); // Fallback for empty strings
  if (dateStr.includes("T")) return new Date(dateStr);
  const date = new Date(dateStr + "T00:00:00");
  // Validate the date is not Invalid Date
  if (isNaN(date.getTime())) return new Date();
  return date;
};

export const db = {
  // ─── Tasks ───────────────────────────────────────────────
  getTasks: (): Task[] => {
    try {
      const data = localStorage.getItem(getTasksKey());
      if (!data) return [];
      const tasks: Task[] = JSON.parse(data);
      // Migrate old tasks missing 'priority' field
      return tasks.map((t) => ({
        ...t,
        priority: t.priority || "medium",
      }));
    } catch {
      console.error("Failed to parse tasks from localStorage");
      return [];
    }
  },

  saveTasks: (tasks: Task[]): boolean => {
    try {
      localStorage.setItem(getTasksKey(), JSON.stringify(tasks));
      return true;
    } catch (e) {
      console.error("Failed to save tasks:", e);
      return false;
    }
  },

  addTask: (task: Task): boolean => {
    const tasks = db.getTasks();
    tasks.push(task);
    return db.saveTasks(tasks);
  },

  updateTask: (id: string, updates: Partial<Task>): boolean => {
    const tasks = db.getTasks();
    const index = tasks.findIndex((t) => t.id === id);
    if (index !== -1) {
      tasks[index] = {
        ...tasks[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      return db.saveTasks(tasks);
    }
    return false;
  },

  deleteTask: (id: string): boolean => {
    const tasks = db.getTasks().filter((t) => t.id !== id);
    return db.saveTasks(tasks);
  },

  /** Migrate tasks from global key to user-scoped key on first login */
  migrateUserTasks: (): void => {
    const userKey = getTasksKey();
    if (userKey === TASKS_KEY_PREFIX) return;
    if (localStorage.getItem(userKey)) return;
    const globalData = localStorage.getItem(TASKS_KEY_PREFIX);
    if (globalData) {
      localStorage.setItem(userKey, globalData);
    }
  },

  /** Auto-detect tasks whose deadline has passed while still "ongoing" → mark as "missed" */
  autoDetectMissed: (): boolean => {
    const tasks = db.getTasks();
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    let changed = false;
    for (const task of tasks) {
      if (task.status === "ongoing") {
        const deadline = parseLocalDate(task.deadline);
        if (deadline < startOfToday) {
          task.status = "missed";
          task.updatedAt = new Date().toISOString();
          changed = true;
        }
      }
    }
    if (changed) {
      const saved = db.saveTasks(tasks);
      return saved; // Only return true if save succeeded
    }
    return false;
  },

  /** Get unique category names from existing tasks */
  getCategories: (): string[] => {
    const tasks = db.getTasks();
    return [...new Set(tasks.map((t) => t.category))].sort();
  },

  // ─── User ────────────────────────────────────────────────
  getUser: (): User | null => {
    try {
      const data = localStorage.getItem(USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      console.error("Failed to parse user from localStorage");
      return null;
    }
  },

  saveUser: (user: User): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  clearUser: (): void => {
    localStorage.removeItem(USER_KEY);
  },
};

// ─── Seed sample data on first launch ────────────────────────
export const seedSampleData = (): void => {
  const existingTasks = db.getTasks();
  if (existingTasks.length > 0) return;

  const now = new Date().toISOString();
  const sampleTasks: Task[] = [
    {
      id: crypto.randomUUID(),
      title: "Syntax review for quiz",
      details: "Review the syntax for the upcoming quiz on programming fundamentals.",
      deadline: "2026-02-15",
      category: "BSCS 1B",
      status: "ongoing",
      priority: "high",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: crypto.randomUUID(),
      title: "Binary tree assignment",
      details: "Complete the data structures assignment on binary trees.",
      deadline: "2026-02-12",
      category: "DSA",
      status: "ongoing",
      priority: "urgent",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: crypto.randomUUID(),
      title: "Project submission guidelines",
      details: "Follow the new guidelines for the ITEC 105 project submission.",
      deadline: "2026-02-20",
      category: "ITEC 105",
      status: "ongoing",
      priority: "medium",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: crypto.randomUUID(),
      title: "Submit lab report",
      details: "Lab report on network topologies due this week.",
      deadline: "2026-02-10",
      category: "BSCS 1B",
      status: "finished",
      priority: "medium",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: crypto.randomUUID(),
      title: "Quiz preparation",
      details: "Prepare for the midterm quiz covering chapters 1-5.",
      deadline: "2026-02-08",
      category: "DSA",
      status: "missed",
      priority: "high",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: crypto.randomUUID(),
      title: "Research paper draft",
      details: "Write the first draft of the research paper on AI in education.",
      deadline: "2026-02-18",
      category: "ITEC 105",
      status: "ongoing",
      priority: "low",
      createdAt: now,
      updatedAt: now,
    },
  ];

  db.saveTasks(sampleTasks);
};
