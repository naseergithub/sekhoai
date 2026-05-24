import Link from "next/link";
import { ArrowLeft, Clock, FileText } from "lucide-react";
import { estimateReadingTime, toUrduNumeral } from "@/lib/utils";

type CourseChapterCardProps = {
  title: string;
  description?: string | null;
  slug: string;
  topicCount: number;
  order: number;
};

export default function CourseChapterCard({
  title,
  description,
  slug,
  topicCount,
  order,
}: CourseChapterCardProps) {
  return (
    <Link href={`/chapter/${slug}`} className="block">
      <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:border-blue-300 hover:shadow-md dark:border-slate-700 dark:bg-card dark:hover:border-blue-700">
        <div className="flex">
          <div className="flex w-16 shrink-0 items-center justify-center bg-gradient-to-b from-blue-600 to-violet-600">
            <span className="font-sans text-2xl font-bold text-white">
              {toUrduNumeral(order)}
            </span>
          </div>

          <div className="min-w-0 flex-1 p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-lg font-bold leading-relaxed text-slate-900 transition-colors group-hover:text-blue-600 dark:text-text-primary dark:group-hover:text-blue-400">
                {title}
              </h3>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-slate-100 px-3 py-1 font-sans text-caption text-slate-500 dark:bg-slate-800 dark:text-text-muted">
                <FileText className="h-3 w-3" aria-hidden />
                {toUrduNumeral(topicCount)} موضوعات
              </span>
            </div>

            {description && (
              <p className="mt-2 line-clamp-2 text-small leading-relaxed text-slate-500 dark:text-text-muted">
                {description}
              </p>
            )}

            <div className="mt-4 flex items-center justify-between">
              <span className="flex items-center gap-1 font-sans text-small font-semibold text-blue-600 transition-all group-hover:gap-2 dark:text-blue-400">
                پڑھنا شروع کریں
                <ArrowLeft className="h-4 w-4" aria-hidden />
              </span>
              <span className="flex items-center gap-2 font-sans text-caption text-slate-400 dark:text-text-muted">
                <Clock className="h-3.5 w-3.5" aria-hidden />
                تقریباً {estimateReadingTime(topicCount)}
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
