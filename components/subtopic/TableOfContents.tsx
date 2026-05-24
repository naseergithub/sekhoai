"use client";

import { useEffect, useState } from "react";
import { ListTree } from "lucide-react";
import { cn } from "@/lib/utils";

export type TocSection = {
  id: string;
  label: string;
};

type TableOfContentsProps = {
  sections: TocSection[];
  className?: string;
};

export default function TableOfContents({
  sections,
  className,
}: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string | null>(
    sections[0]?.id ?? null,
  );

  useEffect(() => {
    if (sections.length === 0) return;

    const observers: IntersectionObserver[] = [];

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveId(id);
          }
        },
        { rootMargin: "-15% 0px -55% 0px", threshold: 0 },
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [sections]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id);
    }
  };

  if (sections.length === 0) return null;

  const stickyTop = "calc(var(--header-height) + 1.5rem)";

  return (
    <nav
      aria-label="مضامین"
      className={cn(
        "scrollbar-thin w-64 shrink-0",
        className,
      )}
    >
      <div
        className="sticky max-h-[calc(100vh-var(--header-height)-2rem)] overflow-y-auto rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-700/80 dark:bg-slate-900/80"
        style={{ top: stickyTop }}
      >
        <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-700">
          <ListTree
            className="h-4 w-4 text-blue-600 dark:text-blue-400"
            aria-hidden
          />
          <p className="font-sans text-caption font-semibold text-slate-700 dark:text-slate-200">
            اس سبق میں
          </p>
        </div>
        <ul className="space-y-0.5">
          {sections.map(({ id, label }) => (
            <li key={id}>
              <button
                type="button"
                onClick={() => scrollTo(id)}
                className={cn(
                  "w-full rounded-lg px-3 py-2.5 text-right font-sans text-small leading-relaxed transition-all duration-200",
                  activeId === id
                    ? "bg-blue-600 font-semibold text-white shadow-md shadow-blue-500/20"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100",
                )}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-4 border-t border-slate-100 pt-3 text-center font-sans text-caption text-slate-400 dark:border-slate-700">
          سیکشن پر کلک کریں
        </p>
      </div>
    </nav>
  );
}
