import Link from "next/link";
import { ArrowLeft, Trophy } from "lucide-react";

type ChapterNextBannerProps = {
  nextChapter: { title: string; slug: string } | null;
  courseSlug: string;
};

export default function ChapterNextBanner({
  nextChapter,
  courseSlug,
}: ChapterNextBannerProps) {
  return (
    <div className="relative mt-10 overflow-hidden rounded-2xl border border-blue-200/60 bg-gradient-to-l from-blue-50 via-white to-violet-50 p-6 dark:border-blue-900/50 dark:from-blue-950/30 dark:via-slate-900 dark:to-violet-950/30 lg:p-8">
      <div
        className="pointer-events-none absolute -end-8 -top-8 h-32 w-32 rounded-full bg-blue-400/10 blur-2xl"
        aria-hidden
      />

      <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-right">
        <div className="min-w-0">
          {nextChapter ? (
            <>
              <p className="font-sans text-small font-medium text-blue-600 dark:text-blue-400">
                اگلا باب
              </p>
              <p className="mt-1 text-xl font-bold leading-[1.75] text-slate-900 dark:text-text-primary">
                {nextChapter.title}
              </p>
              <p className="mt-2 text-small text-slate-500 dark:text-text-muted">
                اس باب کے موضوعات مکمل کرنے کے بعد جاری رکھیں
              </p>
            </>
          ) : (
            <>
              <p className="mb-2 inline-flex items-center justify-center gap-2 font-sans text-small font-semibold text-emerald-600 dark:text-emerald-400 sm:justify-start">
                <Trophy className="h-4 w-4" aria-hidden />
                کورس کے تمام ابواب
              </p>
              <p className="text-xl font-bold leading-[1.75] text-slate-900 dark:text-text-primary">
                آپ نے یہ باب مکمل کر لیا — شاباش!
              </p>
              <p className="mt-2 text-small text-slate-500 dark:text-text-muted">
                کورس کا جائزہ لیں یا دوبارہ پڑھیں
              </p>
            </>
          )}
        </div>

        {nextChapter ? (
          <Link
            href={`/chapter/${nextChapter.slug}`}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-sans text-small font-semibold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-700 hover:shadow-lg"
          >
            <span>اگلا باب شروع کریں</span>
            <ArrowLeft className="h-4 w-4" aria-hidden />
          </Link>
        ) : (
          <Link
            href={`/courses/${courseSlug}`}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 font-sans text-small font-semibold text-white shadow-md shadow-emerald-500/20 transition-all hover:bg-emerald-700"
          >
            <span>کورس پر واپس</span>
            <ArrowLeft className="h-4 w-4" aria-hidden />
          </Link>
        )}
      </div>
    </div>
  );
}
