export type TaskStatus = "ongoing" | "finished" | "missed";
export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type SortBy = "deadline" | "created" | "alpha" | "priority";
export type SortOrder = "asc" | "desc";

export interface Task {
  id: string;
  title: string;
  details: string;
  deadline: string;
  category: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  username: string;
  displayName?: string;
  pin?: string; // 4-digit PIN (optional)
}

export type FilterType = "all" | "finished" | "ongoing" | "missed";

export interface ToastMessage {
  id: string;
  text: string;
  type: "success" | "error" | "info";
}
