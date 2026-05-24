import { ListChecks } from "lucide-react";
import { toUrduNumeral } from "@/lib/utils";

type LessonProgressCardProps = {
  currentIndex: number;
  total: number;
  topicTitle: string;
};

export default function LessonProgressCard({
  currentIndex,
  total,
  topicTitle,
}: LessonProgressCardProps) {
  if (total <= 1) return null;

  return (
    <div className="mb-8 flex items-start gap-4 rounded-2xl border border-blue-200/60 bg-gradient-to-l from-blue-50 to-violet-50 p-5 dark:border-blue-900/50 dark:from-blue-950/30 dark:to-violet-950/30">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/25">
        <ListChecks className="h-5 w-5" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-sans text-caption font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
          آپ یہاں ہیں
        </p>
        <p className="mt-1 font-bold leading-[1.75] text-slate-900 dark:text-text-primary">
          {topicTitle} — سبق {toUrduNumeral(currentIndex + 1)} از{" "}
          {toUrduNumeral(total)}
        </p>
        <p className="mt-2 text-small leading-relaxed text-slate-600 dark:text-text-muted">
          نیچے سکرول کریں یا دائیں مضامین سے سیکشن منتخب کریں۔ آخر میں اگلا سبق
          خود بخود ملے گا۔
        </p>
      </div>
    </div>
  );
}
