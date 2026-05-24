"use client";

import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/useInView";

type AnimatedSectionProps = {
  children: React.ReactNode;
  className?: string;
  animation?: "fade-up" | "fade-in" | "slide-in-right";
};

export default function AnimatedSection({
  children,
  className,
  animation = "fade-up",
}: AnimatedSectionProps) {
  const { ref, inView } = useInView({ threshold: 0.08 });

  const animationClass = {
    "fade-up": "animate-fade-up",
    "fade-in": "animate-fade-in",
    "slide-in-right": "animate-slide-in-right",
  }[animation];

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={cn("opacity-0", inView && animationClass, className)}
    >
      {children}
    </section>
  );
}
