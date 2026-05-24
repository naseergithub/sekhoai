import { cn } from "@/lib/utils";

type CardProps = {
  children: React.ReactNode;
  hoverable?: boolean;
  padding?: string;
  className?: string;
};

export default function Card({
  children,
  hoverable = false,
  padding = "p-6 lg:p-8",
  className,
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card shadow-card",
        padding,
        hoverable &&
          "transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover",
        className,
      )}
    >
      {children}
    </div>
  );
}
