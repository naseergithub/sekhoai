import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type TopicNavItem = { title: string; slug: string };

type TopicPrevNextNavProps = {
  prevTopic: TopicNavItem | null;
  nextTopic: TopicNavItem | null;
};

export default function TopicPrevNextNav({
  prevTopic,
  nextTopic,
}: TopicPrevNextNavProps) {
  if (!prevTopic && !nextTopic) return null;

  return (
    <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
      {prevTopic ? (
        <Link
          href={`/topic/${prevTopic.slug}`}
          className="group flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:border-blue-200 hover:shadow-md dark:border-slate-700/80 dark:bg-card dark:hover:border-blue-800/50"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 transition-colors group-hover:bg-blue-50 dark:bg-slate-800 dark:group-hover:bg-blue-950/60">
            <ChevronRight
              className="h-5 w-5 text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400"
              aria-hidden
            />
          </span>
          <div className="min-w-0 text-right">
            <p className="font-sans text-caption text-slate-400">پچھلا موضوع</p>
            <p className="line-clamp-2 font-bold leading-[1.7] text-slate-800 transition-colors group-hover:text-blue-600 dark:text-slate-200 dark:group-hover:text-blue-400">
              {prevTopic.title}
            </p>
          </div>
        </Link>
      ) : (
        <div className="hidden sm:block" aria-hidden />
      )}

      {nextTopic ? (
        <Link
          href={`/topic/${nextTopic.slug}`}
          className="group flex items-center justify-between gap-3 rounded-2xl border border-blue-200/60 bg-gradient-to-l from-blue-600 to-violet-600 p-5 text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg"
        >
          <div className="min-w-0 text-right">
            <p className="font-sans text-caption text-blue-100">اگلا موضوع</p>
            <p className="line-clamp-2 font-bold leading-[1.7]">
              {nextTopic.title}
            </p>
          </div>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20">
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </span>
        </Link>
      ) : (
        <div className="hidden sm:block" aria-hidden />
      )}
    </div>
  );
}
