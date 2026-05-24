import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  Clock,
  Code2,
  FileText,
  Globe,
  GraduationCap,
  Layers,
  Sparkles,
  Star,
} from "lucide-react";
import CourseChapterCard from "@/components/courses/CourseChapterCard";
import { cn, toUrduNumeral } from "@/lib/utils";

type ChapterItem = {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  order: number;
  topicCount: number;
};

type CourseDetailViewProps = {
  title: string;
  description: string;
  slug: string;
  chapters: ChapterItem[];
  chapterCount: number;
  topicCount: number;
  firstChapterSlug: string | null;
};

const learnItems = [
  "AI کے بنیادی اصول اردو میں",
  "Python پروگرامنگ عملی مثالوں سے",
  "حقیقی دنیا کے مسائل حل کرنا",
  "مشین لرننگ الگورتھم",
  "اپنے AI پروجیکٹ بنانا",
];

export default function CourseDetailView({
  title,
  description,
  slug,
  chapters,
  chapterCount,
  topicCount,
  firstChapterSlug,
}: CourseDetailViewProps) {
  const startHref = firstChapterSlug
    ? `/chapter/${firstChapterSlug}`
    : `/courses/${slug}`;

  return (
    <div className="-mx-4 w-[calc(100%+2rem)] sm:-mx-6 sm:w-[calc(100%+3rem)] lg:-mx-8 lg:w-[calc(100%+4rem)]">
      <CourseDetailHero
        title={title}
        description={description}
        chapterCount={chapterCount}
        topicCount={topicCount}
        startHref={startHref}
      />

      {/* Main content */}
      <section className="bg-slate-50 py-12 dark:bg-slate-950">
        <div className="container-public">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
            {/* Chapters — main column (RTL: appears on right first in DOM = right side) */}
            <div className="lg:col-span-2">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-text-primary">
                  ابواب کی فہرست
                </h2>
                <span className="rounded-full bg-blue-100 px-3 py-1 font-sans text-small text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  {toUrduNumeral(chapterCount)} ابواب
                </span>
              </div>

              {chapters.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-600 dark:bg-card">
                  <Layers
                    className="mx-auto mb-3 h-12 w-12 text-slate-300 dark:text-slate-600"
                    aria-hidden
                  />
                  <p className="text-slate-400 dark:text-text-muted">
                    ابھی کوئی باب دستیاب نہیں
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {chapters.map((chapter) => (
                    <CourseChapterCard
                      key={chapter.id}
                      title={chapter.title}
                      description={chapter.description}
                      slug={chapter.slug}
                      topicCount={chapter.topicCount}
                      order={chapter.order}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-6 lg:sticky lg:top-24">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-card">
                <h3 className="mb-4 font-bold text-slate-900 dark:text-text-primary">
                  آپ کیا سیکھیں گے؟
                </h3>
                <ul className="space-y-3">
                  {learnItems.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500"
                        aria-hidden
                      />
                      <span className="text-small leading-relaxed text-slate-600 dark:text-text-muted">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-card">
                <h3 className="mb-4 font-bold text-slate-900 dark:text-text-primary">
                  کورس کی معلومات
                </h3>
                <dl className="space-y-3">
                  <InfoRow
                    icon={Layers}
                    label="ابواب"
                    value={toUrduNumeral(chapterCount)}
                  />
                  <InfoRow
                    icon={FileText}
                    label="موضوعات"
                    value={toUrduNumeral(topicCount)}
                  />
                  <InfoRow icon={Clock} label="مدت" value="خود رفتار" />
                  <InfoRow icon={Star} label="سطح" value="ابتدائی تا اعلی" />
                  <InfoRow icon={Globe} label="زبان" value="اردو" />
                </dl>
              </div>

              <div className="rounded-2xl bg-gradient-to-bl from-blue-600 to-violet-700 p-6 text-center text-white">
                <Sparkles
                  className="mx-auto mb-3 h-8 w-8 text-blue-200"
                  aria-hidden
                />
                <p className="text-xl font-bold">آج ہی شروع کریں</p>
                <p className="mt-2 text-small text-blue-200">
                  مفت — کوئی اکاؤنٹ نہیں
                </p>
                <Link
                  href={startHref}
                  className="mt-4 block w-full rounded-xl bg-white py-3 font-sans font-bold text-blue-600 transition-colors hover:bg-blue-50"
                >
                  پہلا سبق شروع کریں
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}

function CourseDetailHero({
  title,
  description,
  chapterCount,
  topicCount,
  startHref,
}: {
  title: string;
  description: string;
  chapterCount: number;
  topicCount: number;
  startHref: string;
}) {
  const stats = [
    { icon: Layers, value: toUrduNumeral(chapterCount), label: "ابواب" },
    { icon: FileText, value: toUrduNumeral(topicCount), label: "موضوعات" },
    { icon: Sparkles, value: "مفت", label: "قیمت" },
  ];

  const highlights = [
    { icon: BookOpen, text: "اردو میں وضاحت" },
    { icon: Code2, text: "Python کوڈ" },
    { icon: Clock, text: "اپنی رفتار سے" },
  ];

  const includes = [
    `${toUrduNumeral(chapterCount)} مکمل ابواب`,
    `${toUrduNumeral(topicCount)} تعلیمی موضوعات`,
    "عملی مثالیں اور کوڈ",
    "مفت — کوئی اکاؤنٹ نہیں",
  ];

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-bl from-blue-50 via-white to-violet-50 py-12 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 lg:py-16"
      aria-labelledby="course-hero-title"
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
        className="pointer-events-none absolute -end-24 -top-24 h-80 w-80 rounded-full bg-blue-300/30 blur-3xl dark:bg-blue-900/40"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-20 -start-20 h-64 w-64 rounded-full bg-violet-300/25 blur-3xl dark:bg-violet-900/30"
        aria-hidden
      />

      <div className="container-public relative z-10">
        <nav
          aria-label="بریڈکرمب"
          className="mb-8 flex flex-wrap items-center justify-center gap-2 font-sans text-small text-slate-500 dark:text-slate-400 lg:justify-start"
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
          <span className="line-clamp-1 max-w-[12rem] font-medium text-slate-800 dark:text-slate-200 sm:max-w-xs">
            {title}
          </span>
        </nav>

        <div className="grid items-start gap-10 lg:grid-cols-[1fr_minmax(17rem,20rem)] lg:gap-12">
          <div className="text-center lg:text-right">
            <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50 px-3 py-1.5 font-sans text-caption font-medium text-blue-800 dark:border-blue-800 dark:bg-blue-950/80 dark:text-blue-200">
                <GraduationCap className="h-3.5 w-3.5" aria-hidden />
                ابتدائی سطح
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50 px-3 py-1.5 font-sans text-caption font-semibold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                <Sparkles className="h-3.5 w-3.5" aria-hidden />
                مفت کورس
              </span>
            </div>

            <h1 id="course-hero-title" className="section-title-urdu mt-6">
              {title}
            </h1>
            <p className="body-urdu-comfort mx-auto mt-4 max-w-2xl text-base lg:me-0 lg:ms-0">
              {description}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
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

            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 lg:justify-start lg:gap-0">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={cn(
                    "flex min-w-[5rem] items-center gap-3 px-5",
                    index < stats.length - 1 &&
                      "lg:border-s lg:border-slate-200 lg:ps-7 dark:lg:border-slate-700",
                  )}
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

            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                href={startHref}
                className="inline-flex w-full min-w-[12rem] items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 font-sans text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-700 hover:shadow-xl sm:w-auto"
              >
                <span>ابھی مفت شروع کریں</span>
                <ArrowLeft className="h-5 w-5 shrink-0" aria-hidden />
              </Link>
              <Link
                href="/courses"
                className="inline-flex w-full min-w-[12rem] items-center justify-center rounded-xl border-2 border-slate-200 bg-white px-8 py-4 font-sans text-base font-semibold text-slate-700 transition-all hover:border-blue-300 hover:bg-blue-50/50 sm:w-auto dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                دیگر کورسز
              </Link>
            </div>

            <p className="mt-5 font-sans text-caption text-slate-400 dark:text-slate-500">
              کوئی رجسٹریشن نہیں · فوری رسائی · موبائل پر بھی
            </p>
          </div>

          <aside className="mx-auto w-full max-w-sm lg:mx-0 lg:max-w-none">
            <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50 dark:border-slate-700/80 dark:bg-card dark:shadow-none">
              <div className="relative flex h-32 items-center justify-center overflow-hidden bg-gradient-to-bl from-blue-500 to-violet-600">
                <div
                  className="absolute inset-0 opacity-25"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 30% 70%, white 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                  aria-hidden
                />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 ring-1 ring-white/30 backdrop-blur-md">
                  <GraduationCap className="h-8 w-8 text-white" aria-hidden />
                </div>
                <span className="absolute bottom-3 start-3 rounded-full bg-white/95 px-2.5 py-1 font-sans text-caption font-semibold text-emerald-700 dark:bg-slate-900/90 dark:text-emerald-400">
                  ۱۰۰٪ مفت
                </span>
              </div>

              <div className="p-6">
                <p className="font-sans text-small font-semibold text-slate-900 dark:text-text-primary">
                  اس کورس میں شامل ہے
                </p>
                <ul className="mt-4 space-y-3">
                  {includes.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-small leading-relaxed text-slate-600 dark:text-slate-300"
                    >
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500"
                        aria-hidden
                      />
                      {item}
                    </li>
                  ))}
                </ul>

                <Link
                  href={startHref}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 font-sans text-small font-bold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-700 hover:shadow-lg"
                >
                  <span>پہلا سبق شروع کریں</span>
                  <ArrowLeft className="h-4 w-4" aria-hidden />
                </Link>

                <p className="mt-4 text-center font-sans text-caption text-slate-400 dark:text-slate-500">
                  اوسط وقت: اپنی رفتار سے
                </p>
              </div>

              <div className="absolute -top-2 end-4 z-10 rounded-xl border border-slate-100 bg-white px-3 py-1.5 shadow-md dark:border-slate-600 dark:bg-slate-800">
                <p className="flex items-center gap-1.5 whitespace-nowrap font-sans text-caption font-medium text-slate-700 dark:text-slate-200">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  AI کورس
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 font-sans text-small text-slate-500 dark:text-text-muted">
        <Icon className="h-4 w-4" aria-hidden />
        {label}
      </span>
      <span className="font-sans text-small font-medium text-slate-900 dark:text-text-primary">
        {value}
      </span>
    </div>
  );
}
