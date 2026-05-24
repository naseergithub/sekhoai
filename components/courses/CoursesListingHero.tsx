import Link from "next/link";
import { BookOpen, ChevronLeft, FileText, Layers, Sparkles } from "lucide-react";
import { toUrduNumeral } from "@/lib/utils";

type CoursesListingHeroProps = {
  courseCount: number;
  chapterCount: number;
  topicCount: number;
};

export default function CoursesListingHero({
  courseCount,
  chapterCount,
  topicCount,
}: CoursesListingHeroProps) {
  const stats = [
    { icon: BookOpen, value: toUrduNumeral(courseCount), label: "کورسز" },
    { icon: Layers, value: toUrduNumeral(chapterCount), label: "ابواب" },
    { icon: FileText, value: toUrduNumeral(topicCount), label: "موضوعات" },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-bl from-blue-50 via-white to-violet-50 py-14 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 lg:py-20">
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
        className="pointer-events-none absolute -end-24 -top-24 h-72 w-72 rounded-full bg-blue-300/30 blur-3xl dark:bg-blue-900/40"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-16 -start-16 h-56 w-56 rounded-full bg-violet-300/25 blur-3xl dark:bg-violet-900/30"
        aria-hidden
      />

      <div className="container-public relative z-10">
        <nav
          aria-label="بریڈکرمب"
          className="mb-8 flex items-center justify-center gap-2 font-sans text-small text-slate-500 dark:text-slate-400 lg:justify-start"
        >
          <Link
            href="/"
            className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
          >
            گھر
          </Link>
          <ChevronLeft className="h-4 w-4 rotate-180 opacity-60" aria-hidden />
          <span className="font-medium text-slate-800 dark:text-slate-200">
            تمام کورسز
          </span>
        </nav>

        <div className="text-center lg:text-right">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50 px-4 py-2 font-sans text-small font-medium text-blue-800 dark:border-blue-800 dark:bg-blue-950/80 dark:text-blue-200">
            <Sparkles className="h-4 w-4 shrink-0" aria-hidden />
            مفت · اردو · عملی مشق
          </span>

          <h1 className="section-title-urdu mt-6">تمام AI کورسز</h1>
          <p className="body-urdu-comfort mx-auto mt-4 max-w-2xl text-base lg:me-0 lg:ms-0">
            اپنی سطح اور دلچسپی کے مطابق کورس منتخب کریں — ہر سبق میں اردو
            وضاحت، Python کوڈ، اور حقیقی مثالیں شامل ہیں۔
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 lg:justify-start lg:gap-0">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`flex min-w-[5.5rem] items-center gap-3 px-6 ${
                  index < stats.length - 1
                    ? "lg:border-s lg:border-slate-200 lg:ps-8 dark:lg:border-slate-700"
                    : ""
                }`}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-800 dark:ring-slate-700">
                  <stat.icon
                    className="h-5 w-5 text-blue-600 dark:text-blue-400"
                    aria-hidden
                  />
                </span>
                <div className="text-right">
                  <p className="font-sans text-2xl font-bold tabular-nums text-blue-600 dark:text-blue-400">
                    {stat.value}
                  </p>
                  <p className="font-sans text-small text-slate-500 dark:text-slate-400">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
