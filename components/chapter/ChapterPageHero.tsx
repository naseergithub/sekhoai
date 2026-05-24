import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  ChevronLeft,
  Clock,
  Code2,
  FileText,
  Layers,
  Sparkles,
} from "lucide-react";
import { cn, toUrduNumeral } from "@/lib/utils";

type ChapterPageHeroProps = {
  chapterOrder: number;
  title: string;
  description: string | null;
  courseTitle: string;
  courseSlug: string;
  topicCount: number;
  subtopicCount: number;
  readingTime: string;
  firstTopicSlug: string | null;
};

export default function ChapterPageHero({
  chapterOrder,
  title,
  description,
  courseTitle,
  courseSlug,
  topicCount,
  subtopicCount,
  readingTime,
  firstTopicSlug,
}: ChapterPageHeroProps) {
  const startHref = firstTopicSlug ? `/topic/${firstTopicSlug}` : null;

  const stats = [
    { icon: FileText, value: toUrduNumeral(topicCount), label: "موضوعات" },
    { icon: Layers, value: toUrduNumeral(subtopicCount), label: "سبق" },
    { icon: Clock, value: readingTime, label: "تخمینی وقت" },
  ];

  const highlights = [
    { icon: BookOpen, text: "اردو میں" },
    { icon: Code2, text: "Python کوڈ" },
    { icon: Sparkles, text: "مفت" },
  ];

  return (
    <section
      className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-bl from-blue-50 via-white to-violet-50 dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900"
      aria-labelledby="chapter-hero-title"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-30 dark:opacity-15"
        style={{
          backgroundImage:
            "radial-gradient(circle, #CBD5E1 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -end-20 -top-20 h-64 w-64 rounded-full bg-blue-300/25 blur-3xl dark:bg-blue-900/35"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-16 -start-16 h-48 w-48 rounded-full bg-violet-300/20 blur-3xl dark:bg-violet-900/25"
        aria-hidden
      />

      <div className="container-public relative z-10 py-10 lg:py-12">
        <nav
          aria-label="بریڈکرمب"
          className="mb-6 flex flex-wrap items-center gap-2 font-sans text-small text-slate-500 dark:text-slate-400"
        >
          <Link
            href="/"
            className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
          >
            گھر
          </Link>
          <ChevronLeft className="h-4 w-4 rotate-180 opacity-60" aria-hidden />
          <Link
            href="/courses"
            className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
          >
            کورسز
          </Link>
          <ChevronLeft className="h-4 w-4 rotate-180 opacity-60" aria-hidden />
          <Link
            href={`/courses/${courseSlug}`}
            className="line-clamp-1 max-w-[10rem] transition-colors hover:text-blue-600 dark:hover:text-blue-400 sm:max-w-xs"
          >
            {courseTitle}
          </Link>
          <ChevronLeft className="h-4 w-4 rotate-180 opacity-60" aria-hidden />
          <span className="line-clamp-1 font-medium text-slate-800 dark:text-slate-200">
            {title}
          </span>
        </nav>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0 flex-1 text-center lg:text-right">
            <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50 px-3 py-1.5 font-sans text-caption font-semibold text-blue-800 dark:border-blue-800 dark:bg-blue-950/80 dark:text-blue-200">
                <Layers className="h-3.5 w-3.5" aria-hidden />
                باب {toUrduNumeral(chapterOrder)}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50 px-3 py-1.5 font-sans text-caption font-semibold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                <Sparkles className="h-3.5 w-3.5" aria-hidden />
                مفت
              </span>
            </div>

            <h1 id="chapter-hero-title" className="section-title-urdu mt-5">
              {title}
            </h1>

            {description && (
              <p className="body-urdu-comfort mx-auto mt-4 max-w-2xl text-base lg:me-0 lg:ms-0">
                {description}
              </p>
            )}

            <div className="mt-5 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              {highlights.map(({ icon: Icon, text }) => (
                <span
                  key={text}
                  className="inline-flex items-center gap-2 font-sans text-small text-slate-600 dark:text-slate-400"
                >
                  <Icon
                    className="h-4 w-4 text-blue-600 dark:text-blue-400"
                    aria-hidden
                  />
                  {text}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-5 lg:justify-start lg:gap-0">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={cn(
                    "flex min-w-[4.5rem] items-center gap-2.5 px-4",
                    index < stats.length - 1 &&
                      "lg:border-s lg:border-slate-200 lg:ps-6 dark:lg:border-slate-700",
                  )}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-800 dark:ring-slate-700">
                    <stat.icon
                      className="h-4 w-4 text-blue-600 dark:text-blue-400"
                      aria-hidden
                    />
                  </span>
                  <div className="text-right">
                    <p className="font-sans text-xl font-bold tabular-nums text-blue-600 dark:text-blue-400">
                      {stat.value}
                    </p>
                    <p className="font-sans text-caption text-slate-500 dark:text-slate-400">
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {startHref && (
            <div className="flex shrink-0 flex-col items-center gap-3 sm:flex-row lg:flex-col lg:items-stretch">
              <Link
                href={startHref}
                className="inline-flex min-w-[14rem] items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 font-sans text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-700 hover:shadow-xl"
              >
                <span>پہلا موضوع شروع کریں</span>
                <ArrowLeft className="h-5 w-5 shrink-0" aria-hidden />
              </Link>
              <Link
                href={`/courses/${courseSlug}`}
                className="inline-flex min-w-[14rem] items-center justify-center rounded-xl border-2 border-slate-200 bg-white px-6 py-3.5 font-sans text-small font-semibold text-slate-700 transition-all hover:border-blue-300 hover:bg-blue-50/50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
              >
                کورس کا جائزہ
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
