"use client";

import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/useInView";

type AnimateOnScrollProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  animation?: "fade-up" | "fade-in" | "slide-in-right";
};

const animationClasses = {
  "fade-up": "animate-fade-up",
  "fade-in": "animate-fade-in",
  "slide-in-right": "animate-slide-in-right",
} as const;

export default function AnimateOnScroll({
  children,
  className,
  delay = 0,
  animation = "fade-up",
}: AnimateOnScrollProps) {
  const { ref, inView } = useInView({ threshold: 0.08 });

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn(
        "opacity-0",
        inView && animationClasses[animation],
        inView && "[animation-fill-mode:forwards]",
        className,
      )}
      style={
        inView && delay > 0 ? { animationDelay: `${delay}ms` } : undefined
      }
    >
      {children}
    </div>
  );
}
