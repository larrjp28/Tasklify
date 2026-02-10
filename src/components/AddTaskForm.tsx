import { useState, useEffect } from "react";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { useTaskStore, useToastStore } from "../stores/taskStore";
import { TaskPriority } from "../types";
import { format } from "date-fns";
import { db } from "../lib/database";

const priorityOptions: { value: TaskPriority; label: string; color: string }[] = [
  { value: "low", label: "Low", color: "bg-blue-100 text-blue-700" },
  { value: "medium", label: "Medium", color: "bg-tasklify-gold/30 text-yellow-800" },
  { value: "high", label: "High", color: "bg-orange-100 text-orange-700" },
  { value: "urgent", label: "Urgent", color: "bg-red-100 text-red-700" },
];

export default function AddTaskForm() {
  const { addTask, setShowAddForm } = useTaskStore();
  const { addToast } = useToastStore();
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState(format(new Date(), "yyyy-MM-dd"));
  const [details, setDetails] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [categories] = useState<string[]>(db.getCategories());
  const [showCatDropdown, setShowCatDropdown] = useState(false);
  const [error, setError] = useState("");
  const [activeCatIndex, setActiveCatIndex] = useState(-1);
  const trapRef = useFocusTrap();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowAddForm(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [setShowAddForm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!category.trim()) {
      setError("Category is required");
      return;
    }

    addTask({
      title: title.trim(),
      details: details.trim(),
      deadline,
      category: category.trim(),
      status: "ongoing",
      priority,
    });

    addToast("Task created successfully", "success");
    setShowAddForm(false);
  };

  const filteredCats = categories.filter(
    (c) => c.toLowerCase().includes(category.toLowerCase()) && c !== category,
  );

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && setShowAddForm(false)}
    >
      <div ref={trapRef} className="bg-white rounded-2xl border-4 border-tasklify-purple shadow-2xl w-full max-w-md overflow-hidden animate-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-tasklify-pink-card px-6 py-4 flex items-center justify-between sticky top-0">
          <h2 className="text-tasklify-purple-dark font-bold text-lg">📝 Add New Task</h2>
          <button
            onClick={() => setShowAddForm(false)}
            className="text-tasklify-purple-dark/70 hover:text-tasklify-purple text-2xl font-bold leading-none transition-colors"
          >
            ×
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
              placeholder="Enter task title"
              className="w-full px-4 py-2.5 rounded-lg border-2 border-tasklify-purple-light bg-tasklify-pink-card/20 focus:border-tasklify-purple focus:outline-none text-sm transition-colors"
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
              placeholder="e.g. BSCS 1B, DSA, Personal"
              className="w-full px-4 py-2.5 rounded-lg border-2 border-tasklify-purple-light bg-tasklify-pink-card/20 focus:border-tasklify-purple focus:outline-none text-sm transition-colors"
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

          {/* Deadline */}
          <div>
            <label className="block text-tasklify-purple-dark font-bold text-sm mb-1">
              Deadline:
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              min={format(new Date(), "yyyy-MM-dd")}
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
            ✨ Add Task
          </button>
        </form>
      </div>
    </div>
  );
}
