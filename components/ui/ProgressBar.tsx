import { cn } from "@/lib/utils";

type ProgressBarProps = {
  value: number;
  max?: number;
  className?: string;
  label?: string;
};

export default function ProgressBar({
  value,
  max = 100,
  className,
  label,
}: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <p className="mb-2 font-sans text-small text-text-muted">{label}</p>
      )}
      <div
        className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        <div
          className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
