import { useEffect, useState } from "react";
import { useTaskStore, useFilteredTasks, useTasksByCategory, useToastStore } from "../stores/taskStore";
import TaskCard from "../components/TaskCard";
import AddTaskForm from "../components/AddTaskForm";
import EditTaskForm from "../components/EditTaskForm";
import ConfirmDialog from "../components/ConfirmDialog";
import { FilterType, SortBy } from "../types";

const sortOptions: { value: SortBy; label: string }[] = [
  { value: "deadline", label: "📅 Deadline" },
  { value: "created", label: "🕐 Created" },
  { value: "alpha", label: "🔤 A–Z" },
  { value: "priority", label: "🔥 Priority" },
];

const tabs: { value: FilterType; label: string; icon: string }[] = [
  { value: "all", label: "All Tasks", icon: "📋" },
  { value: "ongoing", label: "Ongoing", icon: "⏳" },
  { value: "finished", label: "Finished", icon: "✅" },
  { value: "missed", label: "Missed", icon: "❌" },
];

export default function TaskListPage() {
  const {
    loadTasks,
    filter,
    setFilter,
    showAddForm,
    setShowAddForm,
    editingTask,
    confirmDelete,
    deleteTask,
    setConfirmDelete,
    tasks,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
  } = useTaskStore();
  const { addToast } = useToastStore();
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const filteredTasks = useFilteredTasks();
  const tasksByCategory = useTasksByCategory();
  const categories = Object.keys(tasksByCategory);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setSearchQuery(localSearch), 200);
    return () => clearTimeout(timer);
  }, [localSearch, setSearchQuery]);

  const handleConfirmDelete = () => {
    if (confirmDelete) {
      deleteTask(confirmDelete.id);
      addToast("Task deleted", "error");
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-tasklify-purple-dark tracking-wide">
          My Tasks
        </h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-tasklify-gold hover:bg-tasklify-gold-dark text-tasklify-purple-dark font-bold px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 hover:scale-105"
        >
          <span className="text-xl leading-none">+</span>
          <span>Add Task</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-4 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
              filter === tab.value
                ? "bg-tasklify-purple text-white shadow-md scale-[1.02]"
                : "bg-white text-tasklify-purple-dark border-2 border-tasklify-purple-light hover:border-tasklify-purple hover:scale-[1.01]"
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search + Sort bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-tasklify-purple text-sm">
            🔍
          </span>
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search tasks by title, details, or category..."
            className="w-full pl-9 pr-10 py-2.5 rounded-xl border-2 border-tasklify-purple-light bg-white focus:border-tasklify-purple focus:outline-none text-sm transition-colors shadow-sm"
            aria-label="Search tasks"
          />
          {localSearch && (
            <button
              onClick={() => { setLocalSearch(""); setSearchQuery(""); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="flex gap-2 items-center">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="px-3 py-2.5 rounded-xl border-2 border-tasklify-purple-light bg-white focus:border-tasklify-purple focus:outline-none text-sm shadow-sm font-medium"
            aria-label="Sort by"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="w-10 h-10 rounded-xl border-2 border-tasklify-purple-light bg-white hover:bg-tasklify-purple-light/30 text-sm font-bold transition-colors shadow-sm flex items-center justify-center"
            title={sortOrder === "asc" ? "Ascending" : "Descending"}
            aria-label={`Sort order: ${sortOrder === "asc" ? "ascending" : "descending"}`}
          >
            {sortOrder === "asc" ? "↑" : "↓"}
          </button>
        </div>
      </div>

      {/* Task stats */}
      <div className="bg-white rounded-xl px-4 py-3 mb-6 shadow-sm border-2 border-tasklify-purple-light">
        <p className="text-tasklify-purple-dark text-sm font-medium">
          Showing <span className="font-bold text-tasklify-purple">{filteredTasks.length}</span> task{filteredTasks.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Task Content */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center shadow-sm border-2 border-tasklify-purple-light">
          <div className="text-5xl mb-4">{localSearch ? "🔍" : tasks.length === 0 ? "🚀" : "📭"}</div>
          <p className="text-tasklify-purple-dark text-lg font-medium">
            {localSearch ? "No matching tasks" : tasks.length === 0 ? "Welcome to tasklify!" : "No tasks in this category"}
          </p>
          <p className="text-tasklify-purple-dark/60 text-sm mt-2">
            {localSearch
              ? "Try a different search term"
              : tasks.length === 0
                ? 'Click "Add Task" to create your first task!'
                : "All clear here — check other tabs or add a new task."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category}>
              {/* Category Header */}
              <div className="bg-tasklify-purple rounded-t-xl px-5 py-3 border-b-[3px] border-tasklify-gold flex items-center justify-between shadow-sm">
                <h2 className="text-white font-bold text-sm tracking-wider uppercase">
                  {category}
                </h2>
                <span className="text-tasklify-gold text-xs font-semibold">
                  {tasksByCategory[category].length} task
                  {tasksByCategory[category].length !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Category Tasks Grid */}
              <div className="bg-white rounded-b-xl p-4 shadow-sm border-2 border-tasklify-purple-light border-t-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tasksByCategory[category].map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showAddForm && <AddTaskForm />}
      {editingTask && <EditTaskForm task={editingTask} />}
      {confirmDelete && (
        <ConfirmDialog
          title="Delete Task"
          message={`Are you sure you want to delete "${confirmDelete.title}"? This action cannot be undone.`}
          confirmLabel="Delete"
          cancelLabel="Cancel"
          variant="danger"
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}
