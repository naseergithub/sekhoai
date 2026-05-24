"use client";

import Link from "next/link";
import { ArrowLeft, Brain, CheckCircle2, Code2, Sparkles } from "lucide-react";
import { cn, toUrduNumeral } from "@/lib/utils";

type HeroSectionProps = {
  chapterCount: number;
  topicCount: number;
};

export default function HeroSection({
  chapterCount,
  topicCount,
}: HeroSectionProps) {
  const stats = [
    { value: `${toUrduNumeral(Math.max(chapterCount, 1))}+`, label: "ابواب" },
    { value: `${toUrduNumeral(Math.max(topicCount, 1))}+`, label: "موضوعات" },
    { value: "۱۰۰٪", label: "مفت" },
  ];

  return (
    <section
      className={cn(
        "relative overflow-hidden",
        "min-h-[min(100vh,900px)] lg:min-h-screen",
        "bg-gradient-to-bl from-blue-50 via-white to-violet-50",
        "dark:from-slate-900 dark:via-slate-950 dark:to-slate-900",
      )}
      aria-labelledby="hero-heading"
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
        className="pointer-events-none absolute -end-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-blue-300/30 blur-3xl dark:bg-blue-900/40"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-20 -start-20 h-72 w-72 rounded-full bg-violet-300/25 blur-3xl dark:bg-violet-900/30"
        aria-hidden
      />

      <div className="container-public relative z-10 py-12 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Text — first in RTL = right column */}
          <div className="order-1 animate-fade-up text-center lg:text-right">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50 px-4 py-2 font-sans text-small font-medium text-blue-800 dark:border-blue-800 dark:bg-blue-950/80 dark:text-blue-200">
              <span aria-hidden>🇵🇰</span>
              پاکستان کا پہلا مکمل اردو AI کورس
            </span>

            <h1 id="hero-heading" className="mt-8">
              <span className="hero-title-line">مصنوعی ذہانت</span>
              <span className="hero-title-accent">اردو میں سیکھیں</span>
            </h1>

            <p className="body-urdu-comfort mx-auto mt-6 max-w-xl lg:me-0 lg:ms-0">
              پاکستان کے لیے تیار کردہ مفت AI کورس — Python، مشین لرننگ، اور
              ڈیپ لرننگ بنیادی سے اعلیٰ درجے تک، آسان اردو میں حقیقی مثالوں کے
              ساتھ۔
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 lg:justify-start lg:gap-0">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={cn(
                    "min-w-[5rem] px-6 text-center lg:text-right",
                    index < stats.length - 1 &&
                      "lg:border-s lg:border-slate-200 lg:ps-8 dark:lg:border-slate-700",
                  )}
                >
                  <p className="font-sans text-3xl font-bold tabular-nums text-blue-600 dark:text-blue-400">
                    {stat.value}
                  </p>
                  <p className="mt-2 font-sans text-small text-slate-500 dark:text-slate-400">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                href="/courses"
                className="inline-flex w-full min-w-[12rem] items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 font-sans text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-700 hover:shadow-xl sm:w-auto"
              >
                <span>ابھی مفت شروع کریں</span>
                <ArrowLeft className="h-5 w-5 shrink-0" aria-hidden />
              </Link>
              <Link
                href="#features"
                className="inline-flex w-full min-w-[12rem] items-center justify-center rounded-xl border-2 border-slate-200 bg-white px-8 py-4 font-sans text-base font-semibold text-slate-700 transition-all hover:border-blue-300 hover:bg-blue-50/50 sm:w-auto dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
              >
                مزید جانیں
              </Link>
            </div>

            <p className="mt-6 font-sans text-caption text-slate-400 dark:text-slate-500">
              کوئی کریڈٹ کارڈ نہیں · فوری رسائی · موبائل پر بھی
            </p>
          </div>

          {/* Visual — second in RTL = left column */}
          <div className="order-2 mx-auto w-full max-w-lg opacity-0 animate-fade-in [animation-delay:200ms] [animation-fill-mode:forwards] lg:max-w-none">
            <div className="relative pt-6">
              <div className="relative rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xl shadow-slate-200/50 dark:border-slate-700 dark:bg-slate-800 dark:shadow-none">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-white">
                      <Brain className="h-6 w-6" aria-hidden />
                    </span>
                    <h2 className="text-lg font-bold leading-[1.8] text-slate-900 dark:text-white">
                      مصنوعی ذہانت کیا ہے؟
                    </h2>
                  </div>
                </div>

                <div className="mt-5 space-y-2.5" aria-hidden>
                  <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-700" />
                  <div className="h-2.5 w-[85%] rounded-full bg-slate-100 dark:bg-slate-700" />
                  <div className="h-2.5 w-[65%] rounded-full bg-slate-100 dark:bg-slate-700" />
                </div>

                <div
                  className="mt-5 overflow-hidden rounded-xl bg-slate-950 p-4 font-mono text-sm leading-relaxed"
                  dir="ltr"
                >
                  <p className="text-green-400"># مصنوعی ذہانت کی تعریف</p>
                  <p className="mt-2 text-blue-300">ai = ArtificialIntelligence()</p>
                  <p className="text-slate-400">print(ai.explain())</p>
                </div>

                <p className="mt-4 flex items-center gap-2 font-sans text-small text-slate-500 dark:text-slate-400">
                  <Code2 className="h-4 w-4 shrink-0" aria-hidden />
                  عملی Python کوڈ — اردو تبصرے کے ساتھ
                </p>
              </div>

              <div className="absolute -top-2 end-4 z-10 animate-pulse-soft rounded-xl border border-slate-100 bg-white px-3 py-2 shadow-lg dark:border-slate-600 dark:bg-slate-800">
                <p className="flex items-center gap-2 whitespace-nowrap font-sans text-small font-medium text-slate-700 dark:text-slate-200">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                  سبق مکمل
                </p>
              </div>

              <div className="absolute -bottom-3 start-4 z-10 animate-pulse-soft rounded-xl bg-gradient-to-l from-violet-600 to-blue-600 px-3 py-2 shadow-lg">
                <p className="flex items-center gap-2 whitespace-nowrap font-sans text-small font-medium text-white">
                  <Sparkles className="h-4 w-4 shrink-0" />
                  AI سے تیار شدہ
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
