import Link from "next/link";
import { ArrowLeft, BookOpen, Clock, FileText } from "lucide-react";
import { estimateReadingTime, toUrduNumeral } from "@/lib/utils";

type SubtopicPreview = { title: string; slug: string };

type ChapterTopicCardProps = {
  title: string;
  slug: string;
  order: number;
  subtopicCount: number;
  subtopics: SubtopicPreview[];
};

export default function ChapterTopicCard({
  title,
  slug,
  order,
  subtopicCount,
  subtopics,
}: ChapterTopicCardProps) {
  const preview = subtopics.slice(0, 3);
  const remaining = subtopics.length - preview.length;
  const readingTime = estimateReadingTime(Math.max(subtopicCount, 1));

  return (
    <Link
      href={`/topic/${slug}`}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-2xl dark:focus-visible:ring-offset-slate-950"
    >
      <article className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200/80 hover:shadow-lg hover:shadow-blue-500/10 dark:border-slate-700/80 dark:bg-card dark:hover:border-blue-800/50">
        <div className="flex">
          <div className="relative flex w-16 shrink-0 flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-blue-600 to-violet-600">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "12px 12px",
              }}
              aria-hidden
            />
            <span className="relative font-sans text-2xl font-bold text-white">
              {toUrduNumeral(order)}
            </span>
          </div>

          <div className="min-w-0 flex-1 p-5 lg:p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-bold leading-[1.75] text-slate-900 transition-colors group-hover:text-blue-600 dark:text-text-primary dark:group-hover:text-blue-400">
                  {title}
                </h3>
                <div className="mt-2 flex flex-wrap items-center gap-3 font-sans text-caption text-slate-500 dark:text-text-muted">
                  <span className="inline-flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5" aria-hidden />
                    {toUrduNumeral(subtopicCount)} سبق
                  </span>
                  <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" aria-hidden />
                    {readingTime}
                  </span>
                </div>
              </div>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-50 transition-colors group-hover:bg-blue-50 dark:bg-slate-800 dark:group-hover:bg-blue-950/60">
                <ArrowLeft
                  className="h-4 w-4 text-slate-400 transition-all group-hover:-translate-x-0.5 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                  aria-hidden
                />
              </span>
            </div>

            {preview.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {preview.map((st) => (
                  <span
                    key={st.slug}
                    className="inline-flex max-w-[10rem] items-center gap-1 truncate rounded-full bg-slate-100 px-3 py-1 text-caption text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                  >
                    <BookOpen className="h-3 w-3 shrink-0 opacity-60" aria-hidden />
                    <span className="truncate">{st.title}</span>
                  </span>
                ))}
                {remaining > 0 && (
                  <span className="rounded-full bg-blue-50 px-3 py-1 font-sans text-caption font-medium text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                    +{toUrduNumeral(remaining)} مزید
                  </span>
                )}
              </div>
            )}

            <p className="mt-4 flex items-center gap-2 font-sans text-small font-semibold text-blue-600 transition-all group-hover:gap-3 dark:text-blue-400">
              موضوع پڑھیں
              <ArrowLeft className="h-4 w-4" aria-hidden />
            </p>
          </div>
        </div>
      </article>
    </Link>
  );
}
