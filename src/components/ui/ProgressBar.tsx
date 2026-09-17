interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  color?: "blue" | "green" | "amber" | "red" | "slate";
  size?: "sm" | "md" | "lg";
}

const colorMap = {
  blue: "bg-blue-500",
  green: "bg-emerald-500",
  amber: "bg-amber-500",
  red: "bg-rose-500",
  slate: "bg-slate-500",
};

const sizeMap = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-3.5",
};

export function ProgressBar({
  value,
  max = 100,
  label,
  showValue = true,
  color = "blue",
  size = "md",
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-medium text-slate-700">{label}</span>
          {showValue && (
            <span className="text-sm font-semibold text-slate-900">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div className={`w-full ${sizeMap[size]} bg-slate-100 rounded-full overflow-hidden`}>
        <div
          className={`${colorMap[color]} ${sizeMap[size]} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {!label && showValue && (
        <div className="text-right text-xs text-slate-500 mt-1">{Math.round(percentage)}%</div>
      )}
    </div>
  );
}
