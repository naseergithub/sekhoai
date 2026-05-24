"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Brain,
  Code2,
  GraduationCap,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import AnimateOnScroll from "@/components/home/AnimateOnScroll";
import CourseListingCard, {
  type CourseListingItem,
} from "@/components/courses/CourseListingCard";
import { cn, toUrduNumeral } from "@/lib/utils";

type FilterKey = "all" | "beginner" | "intermediate" | "advanced";

const filters: { key: FilterKey; label: string }[] = [
  { key: "all", label: "سب" },
  { key: "beginner", label: "ابتدائی" },
  { key: "intermediate", label: "درمیانہ" },
  { key: "advanced", label: "اعلی" },
];

const trustItems = [
  { icon: BookOpen, label: "مفت تعلیم" },
  { icon: Code2, label: "Python کوڈ" },
  { icon: Brain, label: "AI موضوعات" },
  { icon: Sparkles, label: "آسان اردو" },
];

type CoursesListingClientProps = {
  courses: CourseListingItem[];
};

export default function CoursesListingClient({
  courses,
}: CoursesListingClientProps) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    let list = courses;

    if (filter === "beginner") {
      list = list.filter((c) => c.level === "ابتدائی");
    } else if (filter === "intermediate") {
      list = list.filter((c) => c.level === "درمیانہ");
    } else if (filter === "advanced") {
      list = list.filter((c) => c.level === "اعلی");
    }

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q),
      );
    }

    return list;
  }, [courses, filter, query]);

  const hasActiveFilters = filter !== "all" || query.trim().length > 0;

  return (
    <>
      <section
        className="border-y border-slate-200/80 bg-white py-4 dark:border-slate-800 dark:bg-slate-900/50"
        aria-label="کورس کی خصوصیات"
      >
        <div className="container-public">
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6">
            {trustItems.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 font-sans text-small text-slate-600 dark:text-slate-400"
              >
                <Icon
                  className="h-4 w-4 text-blue-600 dark:text-blue-400"
                  aria-hidden
                />
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-12 dark:bg-slate-950 lg:py-16">
        <div className="container-public">
          <div className="mb-8 flex flex-col gap-2 text-center lg:text-right">
            <p className="font-sans text-small font-medium uppercase tracking-wide text-blue-600 dark:text-blue-400">
              کورس کی فہرست
            </p>
            <h2 className="section-title-urdu text-2xl lg:text-3xl">
              {hasActiveFilters
                ? `${toUrduNumeral(filtered.length)} نتائج`
                : "اپنا کورس منتخب کریں"}
            </h2>
            {!hasActiveFilters && courses.length > 0 && (
              <p className="body-urdu-comfort mx-auto max-w-xl text-base lg:me-0 lg:ms-0">
                {toUrduNumeral(courses.length)} کورسز دستیاب — فلٹر یا تلاش سے
                تلاش کریں
              </p>
            )}
          </div>

          <div className="mb-10 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-700/80 dark:bg-card lg:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <span className="mb-1 w-full font-sans text-small font-medium text-slate-500 dark:text-text-muted lg:mb-0 lg:w-auto lg:pe-2">
                  سطح:
                </span>
                {filters.map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFilter(key)}
                    className={cn(
                      "rounded-full px-4 py-2 font-sans text-small font-medium transition-all",
                      filter === key
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="relative w-full lg:max-w-xs">
                <Search
                  className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  aria-hidden
                />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="کورس تلاش کریں..."
                  aria-label="کورس تلاش کریں"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pe-10 ps-4 font-sans text-small outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-900/80 dark:text-text-primary dark:focus:bg-slate-900 dark:focus:ring-blue-900/50"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="absolute start-2 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600 dark:hover:bg-slate-700"
                    aria-label="تلاش صاف کریں"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {hasActiveFilters && (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-700/80">
                <p className="font-sans text-small text-slate-500 dark:text-text-muted">
                  {toUrduNumeral(filtered.length)} کورس ملے
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFilter("all");
                    setQuery("");
                  }}
                  className="font-sans text-small font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  سب فلٹر ہٹائیں
                </button>
              </div>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center dark:border-slate-700 dark:bg-card">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                <GraduationCap
                  className="h-10 w-10 text-slate-400 dark:text-slate-500"
                  aria-hidden
                />
              </div>
              <p className="text-lg font-bold text-slate-700 dark:text-slate-200">
                {courses.length === 0
                  ? "ابھی کوئی کورس دستیاب نہیں"
                  : "کوئی کورس نہیں ملا"}
              </p>
              <p className="body-urdu-comfort mx-auto mt-3 max-w-md text-base">
                {courses.length === 0
                  ? "ہم جلد نئے AI کورسز شامل کر رہے ہیں — گھر واپس جائیں یا بعد میں دوبارہ آئیں۔"
                  : "تلاش کا لفظ یا سطح کا فلٹر تبدیل کر کے دوبارہ کوشش کریں۔"}
              </p>
              {courses.length === 0 ? (
                <Link
                  href="/"
                  className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-sans text-small font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700"
                >
                  گھر پر واپس
                  <ArrowLeft className="h-4 w-4" aria-hidden />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setFilter("all");
                    setQuery("");
                  }}
                  className="mt-8 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 font-sans text-small font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
                >
                  تمام کورسز دکھائیں
                </button>
              )}
            </div>
          ) : (
            <div
              className={cn(
                "grid gap-8",
                filtered.length === 1
                  ? "mx-auto max-w-md md:max-w-lg"
                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
              )}
            >
              {filtered.map((course, index) => (
                <AnimateOnScroll key={course.id} delay={index * 80}>
                  <CourseListingCard course={course} />
                </AnimateOnScroll>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-slate-200 bg-gradient-to-bl from-blue-600 to-violet-700 py-16 dark:border-slate-800">
        <div
          className="pointer-events-none absolute -end-16 top-0 h-64 w-64 rounded-full bg-white/10 blur-2xl"
          aria-hidden
        />
        <div className="container-public relative z-10 text-center text-white">
          <h2 className="text-2xl font-bold leading-[1.75] lg:text-3xl">
            پہلا سبق آج ہی مفت شروع کریں
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base leading-[1.9] text-blue-100">
            کوئی رجسٹریشن فیس نہیں — صرف کورس منتخب کریں اور اردو میں AI سیکھنا
            شروع کریں۔
          </p>
          <Link
            href={
              (filtered[0] ?? courses[0])
                ? `/courses/${(filtered[0] ?? courses[0])!.slug}`
                : "/"
            }
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-sans text-base font-semibold text-blue-700 shadow-lg transition hover:bg-blue-50"
          >
            {(filtered[0] ?? courses[0]) ? "پہلا کورس کھولیں" : "گھر پر جائیں"}
            <ArrowLeft className="h-5 w-5" aria-hidden />
          </Link>
        </div>
      </section>
    </>
  );
}
