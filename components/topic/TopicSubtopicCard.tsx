import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Lock,
  Sparkles,
} from "lucide-react";
import { toUrduNumeral } from "@/lib/utils";

type TopicSubtopicCardProps = {
  title: string;
  slug: string;
  order: number;
  published: boolean;
  aiGenerated: boolean;
};

export default function TopicSubtopicCard({
  title,
  slug,
  order,
  published,
  aiGenerated,
}: TopicSubtopicCardProps) {
  const inner = (
    <article
      className={`group flex overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 dark:border-slate-700/80 dark:bg-card ${
        published
          ? "hover:-translate-y-0.5 hover:border-blue-200/80 hover:shadow-lg hover:shadow-blue-500/10 dark:hover:border-blue-800/50"
          : "opacity-75"
      }`}
    >
      <div
        className={`relative flex w-14 shrink-0 items-center justify-center ${
          published
            ? "bg-gradient-to-b from-blue-600 to-violet-600"
            : "bg-slate-200 dark:bg-slate-800"
        }`}
      >
        {published && (
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "10px 10px",
            }}
            aria-hidden
          />
        )}
        <span
          className={`relative font-sans text-lg font-bold ${
            published ? "text-white" : "text-slate-400"
          }`}
        >
          {toUrduNumeral(order)}
        </span>
      </div>

      <div className="flex min-w-0 flex-1 items-center gap-4 p-5">
        <div className="min-w-0 flex-1">
          <h3
            className={`font-bold leading-[1.75] transition-colors ${
              published
                ? "text-slate-900 group-hover:text-blue-600 dark:text-text-primary dark:group-hover:text-blue-400"
                : "text-slate-500"
            }`}
          >
            {title}
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {aiGenerated && published && (
              <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2.5 py-0.5 font-sans text-caption font-medium text-violet-700 dark:bg-violet-950/60 dark:text-violet-300">
                <Sparkles className="h-3 w-3" aria-hidden />
                AI تیار شدہ
              </span>
            )}
            {!published && (
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 font-sans text-caption font-medium text-amber-700 dark:bg-amber-950/60 dark:text-amber-400">
                جلد آ رہا ہے
              </span>
            )}
            {published && (
              <>
                <span className="inline-flex items-center gap-1 font-sans text-caption text-slate-500 dark:text-text-muted">
                  <Clock className="h-3.5 w-3.5" aria-hidden />
                  ~{toUrduNumeral(5)} منٹ
                </span>
                <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                <span className="inline-flex items-center gap-1 font-sans text-caption text-slate-500 dark:text-text-muted">
                  <BookOpen className="h-3.5 w-3.5" aria-hidden />
                  اردو + کوڈ
                </span>
              </>
            )}
          </div>
        </div>

        <div className="shrink-0">
          {published ? (
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 transition-colors group-hover:bg-blue-100 dark:bg-blue-950/60">
              <ArrowLeft
                className="h-4 w-4 text-blue-600 transition-transform group-hover:-translate-x-0.5 dark:text-blue-400"
                aria-hidden
              />
            </span>
          ) : (
            <Lock className="h-5 w-5 text-slate-300" aria-hidden />
          )}
        </div>
      </div>
    </article>
  );

  if (published) {
    return (
      <Link
        href={`/subtopic/${slug}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-2xl dark:focus-visible:ring-offset-slate-950"
      >
        {inner}
      </Link>
    );
  }

  return <div className="cursor-not-allowed">{inner}</div>;
}
