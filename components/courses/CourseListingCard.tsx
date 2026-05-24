"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  GraduationCap,
  Layers,
  Sparkles,
} from "lucide-react";
import { cn, toUrduNumeral } from "@/lib/utils";

export type CourseListingItem = {
  id: string;
  title: string;
  description: string;
  slug: string;
  chapterCount: number;
  gradient: string;
  level: string;
};

type CourseListingCardProps = {
  course: CourseListingItem;
};

const levelStyles: Record<string, string> = {
  ابتدائی:
    "bg-emerald-500/25 text-emerald-50 ring-emerald-400/30",
  درمیانہ:
    "bg-amber-500/25 text-amber-50 ring-amber-400/30",
  اعلی: "bg-rose-500/25 text-rose-50 ring-rose-400/30",
};

export default function CourseListingCard({
  course,
}: CourseListingCardProps) {
  const levelClass =
    levelStyles[course.level] ?? "bg-white/20 text-white ring-white/20";

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-2xl dark:focus-visible:ring-offset-slate-950"
    >
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200/80 hover:shadow-xl hover:shadow-blue-500/10 dark:border-slate-700/80 dark:bg-card dark:hover:border-blue-800/50">
        <div
          className={cn(
            "relative h-44 overflow-hidden bg-gradient-to-bl",
            course.gradient,
          )}
        >
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 80%, white 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent"
            aria-hidden
          />

          <div className="relative flex items-start justify-between gap-2 p-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 font-sans text-caption font-medium text-white ring-1 ring-white/25 backdrop-blur-sm">
              <Layers className="h-3.5 w-3.5" aria-hidden />
              {toUrduNumeral(course.chapterCount)} ابواب
            </span>
            <span
              className={cn(
                "rounded-full px-3 py-1 font-sans text-caption font-medium ring-1 backdrop-blur-sm",
                levelClass,
              )}
            >
              {course.level}
            </span>
          </div>

          <div className="relative flex flex-1 items-center justify-center pb-6">
            <div className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-2xl bg-white/20 shadow-lg ring-1 ring-white/30 backdrop-blur-md transition-transform duration-300 group-hover:scale-105">
              <GraduationCap className="h-9 w-9 text-white" aria-hidden />
            </div>
          </div>

          <span className="absolute bottom-3 start-4 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 font-sans text-caption font-semibold text-emerald-700 shadow-sm dark:bg-slate-900/90 dark:text-emerald-400">
            <Sparkles className="h-3 w-3" aria-hidden />
            مفت
          </span>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <h3 className="line-clamp-2 text-xl font-bold leading-[1.75] text-slate-900 transition-colors group-hover:text-blue-600 dark:text-text-primary dark:group-hover:text-blue-400">
            {course.title}
          </h3>
          <p className="mt-3 line-clamp-3 flex-1 text-small leading-[1.9] text-slate-500 dark:text-text-muted">
            {course.description}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3 font-sans text-caption text-slate-400 dark:text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5" aria-hidden />
              اردو میں
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600" />
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              اپنی رفتار سے
            </span>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-5 dark:border-slate-700/80">
            <span className="inline-flex items-center gap-2 font-sans text-small font-semibold text-blue-600 transition-all group-hover:gap-3 dark:text-blue-400">
              کورس شروع کریں
              <ArrowLeft
                className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
                aria-hidden
              />
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 transition-colors group-hover:bg-blue-100 dark:bg-blue-950/80 dark:group-hover:bg-blue-900/60">
              <GraduationCap
                className="h-4 w-4 text-blue-600 dark:text-blue-400"
                aria-hidden
              />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
