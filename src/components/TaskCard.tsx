import { useState, useRef, useEffect } from "react";
import * as React from "react";
import { Task, TaskStatus, TaskPriority } from "../types";
import { format } from "date-fns";
import { useTaskStore, useToastStore } from "../stores/taskStore";
import { parseLocalDate } from "../lib/database";
import { Edit2, Trash2, Circle, CheckCircle2, XCircle, Calendar, AlertCircle, Clock } from "lucide-react";

interface TaskCardProps {
  task: Task;
}

const statusConfig: Record<TaskStatus, { label: string; Icon: any }> = {
  ongoing: { label: "Ongoing", Icon: Circle },
  finished: { label: "Finished", Icon: CheckCircle2 },
  missed: { label: "Missed", Icon: XCircle },
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

const priorityIndicator: Record<TaskPriority, { label: string; color: string; dotColor: string }> = {
  low: { label: "Low", color: "text-blue-600", dotColor: "bg-blue-500" },
  medium: { label: "Med", color: "text-yellow-600", dotColor: "bg-yellow-500" },
  high: { label: "High", color: "text-orange-600", dotColor: "bg-orange-500" },
  urgent: { label: "URG", color: "text-red-600", dotColor: "bg-red-500" },
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
      <div className="absolute top-2 right-2 flex gap-1.5">
        <button
          onClick={() => setEditingTask(task)}
          className="w-7 h-7 rounded-lg bg-tasklify-purple/40 text-white flex items-center justify-center hover:bg-tasklify-purple transition-all duration-300 hover:scale-110"
          title="Edit task"
          aria-label={`Edit ${task.title}`}
        >
          <Edit2 size={14} strokeWidth={2.5} />
        </button>
        <button
          onClick={() => setConfirmDelete(task)}
          className="w-7 h-7 rounded-lg bg-tasklify-pink-dark/40 text-white flex items-center justify-center hover:bg-red-600 transition-all duration-300 hover:scale-110"
          title="Delete task"
          aria-label={`Delete ${task.title}`}
        >
          <Trash2 size={14} strokeWidth={2.5} />
        </button>
      </div>

      {/* Priority indicator */}
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-2 h-2 rounded-full ${prio.dotColor} animate-pulse`} />
        <span className={`text-[10px] font-bold ${prio.color} uppercase tracking-wider`}>
          {prio.label}
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
        <div className="flex items-center gap-1.5">
          <Calendar size={12} className={isDueToday ? "text-red-600" : isDueSoon ? "text-orange-500" : "text-tasklify-purple/70"} />
          <span className={`text-[11px] font-medium ${
            isDueToday ? "text-red-600 font-bold" :
            isDueSoon ? "text-orange-500 font-semibold" :
            "text-tasklify-purple opacity-70"
          }`}>
            {format(parseLocalDate(task.deadline), "MMM d, yyyy")}
          </span>
          {isDueToday && <AlertCircle size={12} className="text-red-600 animate-pulse" />}
          {isDueSoon && <Clock size={12} className="text-orange-500" />}
        </div>

        {/* Status dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${statusBadgeColors[task.status]} cursor-pointer hover:opacity-80 transition-all duration-300 shadow-sm flex items-center gap-1`}
          >
            {React.createElement(statusConfig[task.status].Icon, { size: 12 })}
            <span>{task.status}</span>
          </button>

          {showStatusMenu && (
            <div className="absolute bottom-full right-0 mb-1 bg-white border-2 border-tasklify-purple-light rounded-lg shadow-xl z-20 w-36 overflow-hidden animate-in">
              {(Object.keys(statusConfig) as TaskStatus[]).map((s) => {
                const Icon = statusConfig[s].Icon;
                return (
                  <button
                    key={s}
                    onClick={() => changeStatus(s)}
                    className={`w-full text-left px-3 py-2 text-xs font-semibold hover:bg-tasklify-purple-light/20 transition-all duration-200 flex items-center gap-2 ${
                      task.status === s ? "bg-tasklify-purple-light/30" : ""
                    }`}
                  >
                    <Icon size={14} />
                    {statusConfig[s].label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
