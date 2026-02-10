import { useToastStore } from "../stores/taskStore";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  const iconMap = {
    success: CheckCircle2,
    error: XCircle,
    info: Info,
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none" role="status" aria-live="polite">
      {toasts.map((toast) => {
        const colors = {
          success: "bg-tasklify-green text-tasklify-purple-dark border-tasklify-green",
          error: "bg-tasklify-pink-dark text-white border-tasklify-pink-dark",
          info: "bg-tasklify-purple text-white border-tasklify-purple",
        };
        const Icon = iconMap[toast.type];

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-5 py-3 rounded-xl border-2 shadow-xl animate-in text-sm font-semibold ${colors[toast.type]}`}
          >
            <Icon size={18} strokeWidth={2.5} />
            <span className="flex-1">{toast.text}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-2 opacity-60 hover:opacity-100 transition-all duration-300 hover:scale-110"
              aria-label="Dismiss"
            >
              <X size={18} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
