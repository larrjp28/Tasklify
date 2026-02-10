import { useEffect, useRef } from "react";
import { useFocusTrap } from "../hooks/useFocusTrap";

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "danger" | "default";
}

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  variant = "default",
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const trapRef = useFocusTrap();

  // Focus Cancel on mount, Escape to close
  useEffect(() => {
    cancelRef.current?.focus();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onCancel]);

  const confirmColor =
    variant === "danger"
      ? "bg-tasklify-pink-dark hover:bg-red-600 text-white"
      : "bg-tasklify-purple hover:bg-tasklify-purple-dark text-white";

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[90] p-4"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-msg"
    >
      <div ref={trapRef} className="bg-white rounded-2xl border-4 border-tasklify-purple shadow-2xl w-full max-w-sm overflow-hidden animate-in">
        <div className="p-6 text-center">
          <h3
            id="confirm-title"
            className="text-lg font-bold text-tasklify-purple-dark mb-2"
          >
            {title}
          </h3>
          <p id="confirm-msg" className="text-sm text-gray-600 mb-6">
            {message}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              ref={cancelRef}
              onClick={onCancel}
              className="px-5 py-2.5 rounded-lg border-2 border-tasklify-purple-light text-tasklify-purple-dark font-semibold text-sm hover:bg-tasklify-purple-light/20 transition-colors"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors shadow-md ${confirmColor}`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
