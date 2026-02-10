import { useState, useEffect } from "react";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { useTaskStore, useToastStore } from "../stores/taskStore";
import { Task, TaskPriority, TaskStatus } from "../types";
import { db } from "../lib/database";
import { Pencil, X, Calendar, AlignLeft, FolderOpen, Zap, Clock, Circle, CheckCircle2, XCircle } from "lucide-react";

interface EditTaskFormProps {
  task: Task;
}

const priorityOptions: { value: TaskPriority; label: string; color: string }[] = [
  { value: "low", label: "Low", color: "bg-blue-100 text-blue-700" },
  { value: "medium", label: "Medium", color: "bg-tasklify-gold/30 text-yellow-800" },
  { value: "high", label: "High", color: "bg-orange-100 text-orange-700" },
  { value: "urgent", label: "Urgent", color: "bg-red-100 text-red-700" },
];

const statusOptions: { value: TaskStatus; label: string; icon: typeof Clock }[] = [
  { value: "ongoing", label: "Ongoing", icon: Clock },
  { value: "finished", label: "Finished", icon: CheckCircle2 },
  { value: "missed", label: "Missed", icon: XCircle },
];

export default function EditTaskForm({ task }: EditTaskFormProps) {
  const { updateTask, setEditingTask } = useTaskStore();
  const { addToast } = useToastStore();
  const [title, setTitle] = useState(task.title);
  const [deadline, setDeadline] = useState(task.deadline);
  const [details, setDetails] = useState(task.details);
  const [category, setCategory] = useState(task.category);
  const [priority, setPriority] = useState<TaskPriority>(task.priority);
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [categories] = useState<string[]>(db.getCategories());
  const [showCatDropdown, setShowCatDropdown] = useState(false);
  const [error, setError] = useState("");
  const [activeCatIndex, setActiveCatIndex] = useState(-1);
  const trapRef = useFocusTrap();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setEditingTask(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [setEditingTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError("Title is required"); return; }
    if (!category.trim()) { setError("Category is required"); return; }

    updateTask(task.id, {
      title: title.trim(),
      details: details.trim(),
      deadline,
      category: category.trim(),
      priority,
      status,
    });

    addToast("Task updated successfully", "success");
    setEditingTask(null);
  };

  const filteredCats = categories.filter(
    (c) => c.toLowerCase().includes(category.toLowerCase()) && c !== category,
  );

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && setEditingTask(null)}
    >
      <div ref={trapRef} className="bg-white rounded-2xl border-4 border-tasklify-purple shadow-2xl w-full max-w-md overflow-hidden animate-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-tasklify-purple px-6 py-4 flex items-center justify-between sticky top-0">
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <Pencil size={20} strokeWidth={2.5} />
            <span>Edit Task</span>
          </h2>
          <button
            onClick={() => setEditingTask(null)}
            className="text-white/70 hover:text-tasklify-gold transition-all duration-300 hover:scale-110"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mx-6 mt-4 px-4 py-2 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-medium">
            {error}
          </div>
        )}

        {/* Form body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-tasklify-purple-dark font-bold text-sm mb-1">
              Title:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setError(""); }}
              className="w-full px-4 py-2.5 rounded-lg border-2 border-tasklify-purple-light bg-tasklify-pink-card/20 focus:border-tasklify-purple focus:outline-none text-sm transition-colors"
              required
              autoFocus
            />
          </div>

          {/* Category with suggestions */}
          <div className="relative">
            <label className="block text-tasklify-purple-dark font-bold text-sm mb-1">
              Category:
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setShowCatDropdown(true);
                setActiveCatIndex(-1);
                setError("");
              }}
              onFocus={() => setShowCatDropdown(true)}
              onBlur={() => setTimeout(() => setShowCatDropdown(false), 150)}
              onKeyDown={(e) => {
                if (!showCatDropdown || filteredCats.length === 0) return;
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setActiveCatIndex((i) => (i + 1) % filteredCats.length);
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setActiveCatIndex((i) => (i <= 0 ? filteredCats.length - 1 : i - 1));
                } else if (e.key === "Enter" && activeCatIndex >= 0) {
                  e.preventDefault();
                  setCategory(filteredCats[activeCatIndex]);
                  setShowCatDropdown(false);
                  setActiveCatIndex(-1);
                }
              }}
              className="w-full px-4 py-2.5 rounded-lg border-2 border-tasklify-purple-light bg-tasklify-pink-card/20 focus:border-tasklify-purple focus:outline-none text-sm transition-colors"
              required
              role="combobox"
              aria-expanded={showCatDropdown && filteredCats.length > 0}
            />
            {showCatDropdown && filteredCats.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border-2 border-tasklify-purple-light rounded-lg mt-1 shadow-lg z-10 max-h-32 overflow-auto" role="listbox">
                {filteredCats.map((c, i) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setCategory(c);
                      setShowCatDropdown(false);
                      setActiveCatIndex(-1);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      i === activeCatIndex ? "bg-tasklify-purple-light/30 font-semibold" : "hover:bg-tasklify-purple-light/20"
                    }`}
                    role="option"
                    aria-selected={i === activeCatIndex}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Priority */}
          <div>
            <label className="block text-tasklify-purple-dark font-bold text-sm mb-1">
              Priority:
            </label>
            <div className="flex gap-2">
              {priorityOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPriority(opt.value)}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold border-2 transition-all ${
                    priority === opt.value
                      ? `${opt.color} border-current scale-105 shadow-md`
                      : "bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-tasklify-purple-dark font-bold text-sm mb-1">
              Status:
            </label>
            <div className="flex gap-2">
              {statusOptions.map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setStatus(opt.value)}
                    className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold border-2 transition-all duration-300 flex items-center justify-center gap-1.5 ${
                      status === opt.value
                        ? "bg-tasklify-purple text-white border-tasklify-purple scale-105 shadow-md"
                        : "bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100 hover:scale-105"
                    }`}
                  >
                    <Icon size={14} />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-tasklify-purple-dark font-bold text-sm mb-1">
              Deadline:
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2.5 rounded-lg border-2 border-tasklify-purple-light bg-tasklify-pink-card/20 focus:border-tasklify-purple focus:outline-none text-sm transition-colors"
            />
          </div>

          {/* Details */}
          <div>
            <label className="block text-tasklify-purple-dark font-bold text-sm mb-1">
              Details:
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Type something here..."
              rows={4}
              className="w-full px-4 py-2.5 rounded-lg border-2 border-tasklify-purple-light bg-tasklify-pink-card/20 focus:border-tasklify-purple focus:outline-none text-sm resize-none transition-colors"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-tasklify-purple font-bold text-white hover:bg-tasklify-purple-dark transition-colors duration-200 shadow-md text-sm"
          >
            💾 Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
