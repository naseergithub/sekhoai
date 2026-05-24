import Link from "next/link";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Trophy,
} from "lucide-react";
import type { SubtopicNavItem } from "@/lib/db/queries";
import { cn, toUrduNumeral } from "@/lib/utils";

type SubtopicLessonNavProps = {
  prev: SubtopicNavItem | null;
  next: SubtopicNavItem | null;
  siblingIndex: number;
  siblingTotal: number;
  topicSlug: string;
  variant?: "compact" | "full";
  className?: string;
};

function NavChip({
  href,
  direction,
  label,
  title,
  variant,
}: {
  href: string;
  direction: "prev" | "next";
  label: string;
  title: string;
  variant: "default" | "primary" | "success";
}) {
  const isPrev = direction === "prev";

  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex max-w-[16rem] items-center gap-1.5 rounded-lg border px-2.5 py-1.5 transition-all sm:max-w-[18rem]",
        variant === "primary" &&
          "border-transparent bg-blue-600 text-white hover:bg-blue-700",
        variant === "success" &&
          "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200",
        variant === "default" &&
          "border-slate-200/80 bg-slate-50 hover:border-blue-200 hover:bg-white dark:border-slate-700 dark:bg-slate-800/80 dark:hover:border-blue-800",
      )}
    >
      {isPrev && (
        <ChevronRight
          className={cn(
            "h-3.5 w-3.5 shrink-0",
            variant === "primary" ? "text-blue-200" : "text-slate-400",
          )}
          aria-hidden
        />
      )}
      <span className="min-w-0 text-right">
        <span
          className={cn(
            "block truncate font-sans text-[0.65rem] leading-tight",
            variant === "primary"
              ? "text-blue-100"
              : variant === "success"
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-slate-400",
          )}
        >
          {label}
        </span>
        <span
          className={cn(
            "block truncate font-sans text-small font-semibold leading-tight",
            variant === "primary" && "text-white",
            variant === "success" && "text-emerald-900 dark:text-emerald-100",
            variant === "default" &&
              "text-slate-800 dark:text-slate-200",
          )}
        >
          {title}
        </span>
      </span>
      {!isPrev && (
        <ChevronLeft
          className={cn(
            "h-3.5 w-3.5 shrink-0",
            variant === "primary"
              ? "text-blue-200"
              : variant === "success"
                ? "text-emerald-500"
                : "text-slate-400",
          )}
          aria-hidden
        />
      )}
    </Link>
  );
}

export default function SubtopicLessonNav({
  prev,
  next,
  siblingIndex,
  siblingTotal,
  topicSlug,
  variant = "full",
  className,
}: SubtopicLessonNavProps) {
  if (!prev && !next) return null;

  const isLastInTopic = !next && siblingTotal > 0;

  const nextLink = next ? (
    <NavChip
      href={`/subtopic/${next.slug}`}
      direction="next"
      label={next.context ? `اگلا · ${next.context}` : "اگلا سبق"}
      title={next.title}
      variant="primary"
    />
  ) : isLastInTopic ? (
    <Link
      href={`/topic/${topicSlug}`}
      className="inline-flex max-w-[16rem] items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 transition-all hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/50 sm:max-w-[18rem]"
    >
      <span className="min-w-0 text-right">
        <span className="flex items-center justify-end gap-1 font-sans text-[0.65rem] font-medium text-emerald-600 dark:text-emerald-400">
          <Trophy className="h-3 w-3 shrink-0" aria-hidden />
          مکمل
        </span>
        <span className="block truncate font-sans text-small font-semibold text-emerald-900 dark:text-emerald-100">
          تمام سبق
        </span>
      </span>
      <ArrowLeft
        className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400"
        aria-hidden
      />
    </Link>
  ) : null;

  return (
    <nav
      aria-label="سبق نیویگیشن"
      className={cn(
        "flex w-full flex-wrap items-center justify-between gap-x-3 gap-y-2 rounded-xl border border-slate-200/80 bg-slate-50/50 px-3 py-2 dark:border-slate-700/80 dark:bg-slate-900/30",
        variant === "full" && "mt-10",
        className,
      )}
    >
      <div className="shrink-0">
        {prev ? (
          <NavChip
            href={`/subtopic/${prev.slug}`}
            direction="prev"
            label={prev.context ? `پچھلا · ${prev.context}` : "پچھلا سبق"}
            title={prev.title}
            variant="default"
          />
        ) : null}
      </div>

      {siblingTotal > 1 && (
        <span className="hidden shrink-0 font-sans text-[0.65rem] tabular-nums text-slate-400 sm:block">
          {toUrduNumeral(siblingIndex + 1)}/{toUrduNumeral(siblingTotal)}
        </span>
      )}

      <div className="shrink-0">{nextLink}</div>
    </nav>
  );
}
