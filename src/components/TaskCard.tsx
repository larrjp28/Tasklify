import { useState, useRef, useEffect } from "react";
import { Task, TaskStatus, TaskPriority } from "../types";
import { format } from "date-fns";
import { useTaskStore, useToastStore } from "../stores/taskStore";
import { parseLocalDate } from "../lib/database";

interface TaskCardProps {
  task: Task;
}

const statusConfig: Record<TaskStatus, { label: string; icon: string }> = {
  ongoing: { label: "Ongoing", icon: "⏳" },
  finished: { label: "Finished", icon: "✅" },
  missed: { label: "Missed", icon: "❌" },
};

const statusBadgeColors: Record<TaskStatus, string> = {
  ongoing: "bg-tasklify-gold text-tasklify-purple-dark",
  finished: "bg-tasklify-green text-white",
  missed: "bg-tasklify-pink-dark text-white",
};

const cardBgColors: Record<TaskStatus, string> = {
  ongoing: "bg-tasklify-pink-card",
  finished: "bg-tasklify-green/20 border-tasklify-green",
  missed: "bg-tasklify-pink-dark/10 border-tasklify-pink-dark/50",
};

const priorityIndicator: Record<TaskPriority, { label: string; color: string }> = {
  low: { label: "Low", color: "text-blue-500" },
  medium: { label: "Med", color: "text-yellow-600" },
  high: { label: "High", color: "text-orange-500" },
  urgent: { label: "URG", color: "text-red-600" },
};

export default function TaskCard({ task }: TaskCardProps) {
  const { updateTask, setEditingTask, setConfirmDelete } = useTaskStore();
  const { addToast } = useToastStore();
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close status dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowStatusMenu(false);
      }
    };
    if (showStatusMenu) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showStatusMenu]);

  const changeStatus = (newStatus: TaskStatus) => {
    updateTask(task.id, { status: newStatus });
    addToast(`Task marked as ${newStatus}`, "info");
    setShowStatusMenu(false);
  };

  const prio = priorityIndicator[task.priority];

  // Deadline proximity for ongoing tasks
  const deadlineDate = parseLocalDate(task.deadline);
  const msUntil = deadlineDate.getTime() - Date.now();
  const daysUntil = Math.ceil(msUntil / (1000 * 60 * 60 * 24));
  const isDueToday = task.status === "ongoing" && daysUntil >= 0 && daysUntil <= 1;
  const isDueSoon = task.status === "ongoing" && daysUntil > 1 && daysUntil <= 3;

  return (
    <div
      className={`${cardBgColors[task.status]} border-2 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-200 relative group hover:-translate-y-0.5`}
    >
      {/* Top-right action buttons */}
      <div className="absolute top-2 right-2 flex gap-1">
        <button
          onClick={() => setEditingTask(task)}
          className="w-6 h-6 rounded-full bg-tasklify-purple/40 text-white flex items-center justify-center text-xs hover:bg-tasklify-purple transition-colors"
          title="Edit task"
          aria-label={`Edit ${task.title}`}
        >
          ✎
        </button>
        <button
          onClick={() => setConfirmDelete(task)}
          className="w-6 h-6 rounded-full bg-tasklify-pink-dark/40 text-white flex items-center justify-center text-sm font-bold hover:bg-red-600 transition-colors"
          title="Delete task"
          aria-label={`Delete ${task.title}`}
        >
          ×
        </button>
      </div>

      {/* Priority indicator */}
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-[10px] font-black ${prio.color} uppercase tracking-wider`}>
          ● {prio.label}
        </span>
      </div>

      {/* Task title */}
      <h3 className="font-bold text-tasklify-purple-dark text-sm mb-1 pr-14 leading-snug">
        {task.title}
      </h3>

      {/* Task details */}
      {task.details && (
        <p className="text-tasklify-text text-xs mb-3 line-clamp-2 opacity-70 leading-relaxed">
          {task.details}
        </p>
      )}

      {/* Footer: deadline + status */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-tasklify-purple/10">
        <span className={`text-[11px] font-medium ${
          isDueToday ? "text-red-600 font-bold animate-pulse" :
          isDueSoon ? "text-orange-500 font-bold" :
          "text-tasklify-purple opacity-70"
        }`}>
          📅 {format(parseLocalDate(task.deadline), "MMM d, yyyy")}
          {isDueToday && " ⚠️"}
          {isDueSoon && " ⏰"}
        </span>

        {/* Status dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${statusBadgeColors[task.status]} cursor-pointer hover:opacity-80 transition-opacity shadow-sm`}
          >
            {statusConfig[task.status].icon} {task.status}
          </button>

          {showStatusMenu && (
            <div className="absolute bottom-full right-0 mb-1 bg-white border-2 border-tasklify-purple-light rounded-lg shadow-xl z-20 w-36 overflow-hidden">
              {(Object.keys(statusConfig) as TaskStatus[]).map((s) => (
                <button
                  key={s}
                  onClick={() => changeStatus(s)}
                  className={`w-full text-left px-3 py-2 text-xs font-semibold hover:bg-tasklify-purple-light/20 transition-colors flex items-center gap-2 ${
                    task.status === s ? "bg-tasklify-purple-light/30" : ""
                  }`}
                >
                  <span>{statusConfig[s].icon}</span>
                  {statusConfig[s].label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
