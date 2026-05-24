import Link from "next/link";
import {
  BookOpen,
  Calendar,
  ChevronLeft,
  Clock,
  FileText,
  Layers,
  Sparkles,
} from "lucide-react";
import SubtopicShareButton from "@/components/subtopic/SubtopicShareButton";
import { toUrduNumeral } from "@/lib/utils";

type SubtopicPageHeroProps = {
  title: string;
  topicTitle: string;
  topicSlug: string;
  chapterTitle: string;
  chapterSlug: string;
  courseTitle: string;
  courseSlug: string;
  aiGenerated: boolean;
  readingTimeLabel: string;
  publishedDate: string;
  pageUrl: string;
  lessonIndex: number;
  lessonTotal: number;
};

export default function SubtopicPageHero({
  title,
  topicTitle,
  topicSlug,
  chapterTitle,
  chapterSlug,
  courseTitle,
  courseSlug,
  aiGenerated,
  readingTimeLabel,
  publishedDate,
  pageUrl,
  lessonIndex,
  lessonTotal,
}: SubtopicPageHeroProps) {
  const progressPct =
    lessonTotal > 0 ? ((lessonIndex + 1) / lessonTotal) * 100 : 0;

  return (
    <section
      className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-bl from-slate-900 via-blue-950 to-violet-950 text-white dark:border-slate-800"
      aria-labelledby="subtopic-hero-title"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -end-32 -top-32 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 -start-24 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl"
        aria-hidden
      />

      <div className="container-public relative z-10 py-10 lg:py-12">
        <nav
          aria-label="بریڈکرمب"
          className="mb-6 flex flex-wrap items-center gap-2 font-sans text-small text-blue-200/90"
        >
          <Link href="/" className="transition-colors hover:text-white">
            گھر
          </Link>
          <ChevronLeft className="h-4 w-4 rotate-180 opacity-50" aria-hidden />
          <Link
            href={`/courses/${courseSlug}`}
            className="line-clamp-1 max-w-[8rem] transition-colors hover:text-white sm:max-w-none"
          >
            {courseTitle}
          </Link>
          <ChevronLeft className="h-4 w-4 rotate-180 opacity-50" aria-hidden />
          <Link
            href={`/chapter/${chapterSlug}`}
            className="line-clamp-1 max-w-[8rem] transition-colors hover:text-white sm:max-w-none"
          >
            {chapterTitle}
          </Link>
          <ChevronLeft className="h-4 w-4 rotate-180 opacity-50" aria-hidden />
          <Link
            href={`/topic/${topicSlug}`}
            className="line-clamp-1 max-w-[8rem] transition-colors hover:text-white sm:max-w-none"
          >
            {topicTitle}
          </Link>
          <ChevronLeft className="h-4 w-4 rotate-180 opacity-50" aria-hidden />
          <span className="line-clamp-1 font-medium text-white">{title}</span>
        </nav>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 font-sans text-caption font-medium text-blue-100 ring-1 ring-white/15">
                <BookOpen className="h-3.5 w-3.5" aria-hidden />
                سبق {toUrduNumeral(lessonIndex + 1)} / {toUrduNumeral(lessonTotal)}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1.5 font-sans text-caption font-semibold text-emerald-200 ring-1 ring-emerald-400/30">
                <Sparkles className="h-3.5 w-3.5" aria-hidden />
                مفت پڑھیں
              </span>
              {aiGenerated && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/25 px-3 py-1.5 font-sans text-caption font-medium text-violet-100 ring-1 ring-violet-400/30">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden />
                  AI تیار شدہ
                </span>
              )}
            </div>

            <h1
              id="subtopic-hero-title"
              className="mt-5 text-3xl font-bold leading-[1.85] text-white lg:text-4xl"
            >
              {title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-4 font-sans text-small text-blue-100/90">
              <span className="inline-flex items-center gap-2">
                <Clock className="h-4 w-4 opacity-80" aria-hidden />
                {readingTimeLabel}
              </span>
              <span className="h-1 w-1 rounded-full bg-blue-400/50" aria-hidden />
              <span className="inline-flex items-center gap-2">
                <Calendar className="h-4 w-4 opacity-80" aria-hidden />
                {publishedDate}
              </span>
              <span className="h-1 w-1 rounded-full bg-blue-400/50" aria-hidden />
              <Link
                href={`/topic/${topicSlug}`}
                className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
              >
                <FileText className="h-4 w-4 opacity-80" aria-hidden />
                {topicTitle}
              </Link>
            </div>

            {lessonTotal > 1 && (
              <div className="mt-6 max-w-md">
                <div className="mb-2 flex justify-between font-sans text-caption text-blue-200/80">
                  <span>موضوع کی پیش رفت</span>
                  <span>
                    {toUrduNumeral(lessonIndex + 1)} / {toUrduNumeral(lessonTotal)}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-l from-blue-400 to-violet-400 transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-3 lg:flex-col lg:items-stretch">
            <SubtopicShareButton
              title={title}
              pageUrl={pageUrl}
              variant="dark"
            />
            <Link
              href={`/topic/${topicSlug}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 font-sans text-small font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <Layers className="h-4 w-4" aria-hidden />
              تمام سبق
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
