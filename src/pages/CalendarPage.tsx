import { useState, useMemo } from "react";
import { useTaskStore } from "../stores/taskStore";
import { parseLocalDate } from "../lib/database";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameMonth, isSameDay, isToday } from "date-fns";
import { ChevronLeft, ChevronRight, Circle, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Task } from "../types";

const statusIcons = {
  ongoing: { Icon: Clock, color: "text-tasklify-purple" },
  finished: { Icon: CheckCircle2, color: "text-tasklify-green" },
  missed: { Icon: XCircle, color: "text-tasklify-pink-dark" },
};

const priorityDots: Record<string, string> = {
  urgent: "bg-red-500",
  high: "bg-orange-500",
  medium: "bg-yellow-500",
  low: "bg-blue-400",
};

export default function CalendarPage() {
  const { tasks } = useTaskStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Build a map of date → tasks
  const tasksByDate = useMemo(() => {
    const map = new Map<string, Task[]>();
    tasks.forEach((task) => {
      const key = task.deadline; // "YYYY-MM-DD"
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(task);
    });
    return map;
  }, [tasks]);

  // Calendar grid days
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const days: Date[] = [];
    let day = calStart;
    while (day <= calEnd) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  }, [currentMonth]);

  const selectedTasks = useMemo(() => {
    if (!selectedDate) return [];
    const key = format(selectedDate, "yyyy-MM-dd");
    return tasksByDate.get(key) || [];
  }, [selectedDate, tasksByDate]);

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-tasklify-purple-dark font-bold text-2xl">Calendar</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar grid */}
        <div className="lg:col-span-2 bg-white rounded-2xl border-[3px] border-tasklify-purple p-5 shadow-lg">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-2 rounded-lg hover:bg-tasklify-pink-card transition-all duration-300 hover:scale-110"
            >
              <ChevronLeft size={20} className="text-tasklify-purple-dark" />
            </button>
            <h2 className="text-tasklify-purple-dark font-bold text-lg">
              {format(currentMonth, "MMMM yyyy")}
            </h2>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-2 rounded-lg hover:bg-tasklify-pink-card transition-all duration-300 hover:scale-110"
            >
              <ChevronRight size={20} className="text-tasklify-purple-dark" />
            </button>
          </div>

          {/* Week day headers */}
          <div className="grid grid-cols-7 mb-1">
            {weekDays.map((d) => (
              <div key={d} className="text-center text-xs font-bold text-tasklify-purple/60 py-2">
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, idx) => {
              const dateKey = format(day, "yyyy-MM-dd");
              const dayTasks = tasksByDate.get(dateKey) || [];
              const inMonth = isSameMonth(day, currentMonth);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const today = isToday(day);

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDate(day)}
                  className={`relative p-1.5 min-h-[60px] rounded-lg text-sm transition-all duration-200 border-2 flex flex-col items-center
                    ${!inMonth ? "text-gray-300 border-transparent" : "border-transparent"}
                    ${isSelected ? "!border-tasklify-purple bg-tasklify-purple/10 scale-[1.02]" : "hover:bg-tasklify-pink-card/40"}
                    ${today && !isSelected ? "bg-tasklify-gold/20 font-bold" : ""}
                  `}
                >
                  <span
                    className={`text-xs font-semibold ${
                      today ? "bg-tasklify-purple text-white w-6 h-6 rounded-full flex items-center justify-center" : ""
                    } ${!inMonth ? "text-gray-300" : "text-tasklify-purple-dark"}`}
                  >
                    {format(day, "d")}
                  </span>

                  {/* Task indicators */}
                  {dayTasks.length > 0 && inMonth && (
                    <div className="flex gap-0.5 mt-1 flex-wrap justify-center">
                      {dayTasks.slice(0, 4).map((t) => (
                        <div
                          key={t.id}
                          className={`w-2 h-2 rounded-full ${priorityDots[t.priority] || "bg-gray-400"} ${
                            t.status === "finished" ? "opacity-40" : ""
                          }`}
                          title={`${t.title} (${t.priority})`}
                        />
                      ))}
                      {dayTasks.length > 4 && (
                        <span className="text-[9px] text-tasklify-purple font-bold">+{dayTasks.length - 4}</span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex gap-4 mt-4 pt-3 border-t border-tasklify-purple-light/30 flex-wrap">
            {Object.entries(priorityDots).map(([p, color]) => (
              <div key={p} className="flex items-center gap-1.5 text-xs text-gray-500">
                <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
                <span className="capitalize">{p}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Selected date details */}
        <div className="bg-white rounded-2xl border-[3px] border-tasklify-purple p-5 shadow-lg">
          <h3 className="font-bold text-tasklify-purple-dark text-lg mb-3 border-b-2 border-tasklify-purple-light pb-2">
            {selectedDate ? format(selectedDate, "EEEE, MMM d, yyyy") : "Select a date"}
          </h3>

          {!selectedDate ? (
            <p className="text-gray-400 text-sm text-center mt-8">Click a day to see its tasks</p>
          ) : selectedTasks.length === 0 ? (
            <div className="text-center mt-8">
              <Circle size={32} className="text-gray-300 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">No tasks on this date</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {selectedTasks.map((task) => {
                const { Icon, color } = statusIcons[task.status];
                return (
                  <div
                    key={task.id}
                    className="p-3 rounded-xl border-2 border-tasklify-purple-light/50 hover:border-tasklify-purple transition-all duration-300"
                  >
                    <div className="flex items-start gap-2">
                      <Icon size={16} className={`${color} mt-0.5 shrink-0`} />
                      <div className="min-w-0 flex-1">
                        <p className={`font-semibold text-sm text-tasklify-purple-dark ${task.status === "finished" ? "line-through opacity-60" : ""}`}>
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-tasklify-pink-card text-tasklify-purple-dark font-medium">
                            {task.category}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold capitalize ${priorityDots[task.priority].replace("bg-", "text-")}`}>
                            {task.priority}
                          </span>
                        </div>
                        {task.details && (
                          <p className="text-xs text-gray-400 mt-1 line-clamp-2">{task.details}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
