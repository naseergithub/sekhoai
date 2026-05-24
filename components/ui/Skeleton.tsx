import { cn } from "@/lib/utils";

type SkeletonProps = {
  className?: string;
};

export default function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded bg-slate-200 dark:bg-slate-700",
        className,
      )}
      aria-hidden
    />
  );
}
