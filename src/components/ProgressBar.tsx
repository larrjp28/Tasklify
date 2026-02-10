interface ProgressBarProps {
  progress: number; // 0–100
  label?: string;
}

export default function ProgressBar({ progress, label }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, progress));

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between mb-2">
          <span className="text-sm font-bold text-tasklify-purple-dark">
            {label}
          </span>
          <span className="text-sm font-bold text-tasklify-purple">
            {clamped}%
          </span>
        </div>
      )}
      <div
        className="w-full bg-tasklify-purple-light/40 rounded-full h-5 overflow-hidden border-2 border-tasklify-purple shadow-inner"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ? `${label} ${clamped}%` : `${clamped}%`}
      >
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${clamped}%`,
            background:
              "linear-gradient(90deg, #82E0AA 0%, #F2C94C 60%, #F2C94C 100%)",
          }}
        />
      </div>
    </div>
  );
}
