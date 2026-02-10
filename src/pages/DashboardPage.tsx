import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTaskStore, useTaskStats } from "../stores/taskStore";
import ProgressBar from "../components/ProgressBar";
import { format, isAfter, isBefore, addDays, startOfDay } from "date-fns";
import { parseLocalDate } from "../lib/database";
import { CheckCircle2, XCircle, Bell, Calendar } from "lucide-react";

export default function DashboardPage() {
  const { tasks, loadTasks } = useTaskStore();
  const { finished, missed, ongoing, progress } = useTaskStats();
  const navigate = useNavigate();

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const finishedTasks = tasks.filter((t) => t.status === "finished");
  const missedTasks = tasks.filter((t) => t.status === "missed");
  const ongoingTasks = tasks.filter((t) => t.status === "ongoing");

  // Reminders: ongoing tasks due within the next 7 days
  const today = startOfDay(new Date());
  const weekFromNow = addDays(today, 7);
  const upcomingTasks = ongoingTasks.filter((t) => {
    const deadline = startOfDay(parseLocalDate(t.deadline));
    return !isBefore(deadline, today) && !isAfter(deadline, weekFromNow);
  });

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <h1 className="text-3xl font-bold text-tasklify-purple-dark mb-8 text-center tracking-wide">
        Dashboard
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Finished Tasks */}
        <div
          onClick={() => navigate("/tasks")}
          className="bg-white rounded-2xl border-[3px] border-tasklify-purple p-5 shadow-lg cursor-pointer hover:shadow-xl hover:scale-[1.01] transition-all duration-300"
        >
          <h2 className="font-bold text-tasklify-purple-dark text-lg mb-3 border-b-2 border-tasklify-purple-light pb-2 flex items-center gap-2">
            <CheckCircle2 size={20} className="text-tasklify-green" strokeWidth={2.5} />
            <span>Finished Tasks</span>
            <span className="ml-auto text-sm bg-tasklify-green/20 text-tasklify-green px-2 py-0.5 rounded-full">{finished}</span>
          </h2>
          <div className="space-y-2 max-h-52 overflow-auto pr-1">
            {finishedTasks.length === 0 ? (
              <p className="text-sm text-gray-400 italic py-4 text-center">
                No finished tasks yet
              </p>
            ) : (
              finishedTasks.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  className="bg-tasklify-green/20 rounded-lg px-3 py-2.5 border border-tasklify-green/40"
                >
                  <p className="text-sm font-semibold text-tasklify-purple-dark">
                    {task.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {task.category}
                  </p>
                </div>
              ))
            )}
            {finishedTasks.length > 5 && (
              <p className="text-xs text-tasklify-purple text-center font-semibold pt-1">
                +{finishedTasks.length - 5} more →
              </p>
            )}
          </div>
        </div>

        {/* Missed Tasks */}
        <div
          onClick={() => navigate("/tasks")}
          className="bg-white rounded-2xl border-[3px] border-tasklify-purple p-5 shadow-lg cursor-pointer hover:shadow-xl hover:scale-[1.01] transition-all duration-300"
        >
          <h2 className="font-bold text-tasklify-purple-dark text-lg mb-3 border-b-2 border-tasklify-purple-light pb-2 flex items-center gap-2">
            <XCircle size={20} className="text-tasklify-pink-dark" strokeWidth={2.5} />
            <span>Missed Tasks</span>
            <span className="ml-auto text-sm bg-tasklify-pink-dark/15 text-tasklify-pink-dark px-2 py-0.5 rounded-full">{missed}</span>
          </h2>
          <div className="space-y-2 max-h-52 overflow-auto pr-1">
            {missedTasks.length === 0 ? (
              <p className="text-sm text-gray-400 italic py-4 text-center">
                No missed tasks 🎉
              </p>
            ) : (
              missedTasks.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  className="bg-tasklify-pink-dark/15 rounded-lg px-3 py-2.5 border border-tasklify-pink-dark/30"
                >
                  <p className="text-sm font-semibold text-tasklify-purple-dark">
                    {task.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {task.category}
                  </p>
                </div>
              ))
            )}
            {missedTasks.length > 5 && (
              <p className="text-xs text-tasklify-purple text-center font-semibold pt-1">
                +{missedTasks.length - 5} more →
              </p>
            )}
          </div>
        </div>

        {/* Reminders */}
        <div
          onClick={() => navigate("/tasks")}
          className="bg-white rounded-2xl border-[3px] border-tasklify-purple p-5 shadow-lg cursor-pointer hover:shadow-xl hover:scale-[1.01] transition-all duration-300"
        >
          <h2 className="font-bold text-tasklify-purple-dark text-lg mb-3 border-b-2 border-tasklify-purple-light pb-2 flex items-center gap-2">
            <Bell size={20} className="text-tasklify-gold" strokeWidth={2.5} />
            <span>Reminders</span>
            <span className="ml-auto text-sm bg-tasklify-gold/20 text-tasklify-gold px-2 py-0.5 rounded-full">{upcomingTasks.length}</span>
          </h2>
          <div className="space-y-2 max-h-52 overflow-auto pr-1">
            {upcomingTasks.length === 0 ? (
              <p className="text-sm text-gray-400 italic py-4 text-center">
                No upcoming deadlines
              </p>
            ) : (
              upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-tasklify-gold/15 rounded-lg px-3 py-2.5 border border-tasklify-gold/30"
                >
                  <p className="text-sm font-semibold text-tasklify-purple-dark">
                    {task.title}
                  </p>
                  <p className="text-xs text-tasklify-pink-dark font-medium mt-0.5 flex items-center gap-1">
                    <Calendar size={12} />
                    Due: {format(parseLocalDate(task.deadline), "MMM d, yyyy")}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="bg-white rounded-2xl border-[3px] border-tasklify-purple p-6 shadow-lg">
        <ProgressBar progress={progress} label="Progress:" />
        <div className="flex justify-between mt-4 text-sm">
          <span className="text-tasklify-green font-semibold">
            ✓ {finished} Finished
          </span>
          <span className="text-tasklify-gold font-semibold">
            ● {ongoing} Ongoing
          </span>
          <span className="text-tasklify-pink-dark font-semibold">
            ✗ {missed} Missed
          </span>
        </div>
      </div>
    </div>
  );
}
