"use client";

import Link from "next/link";
import {
  BarChart3,
  BookOpen,
  Brain,
  Code2,
  Globe,
  GraduationCap,
  Sparkles,
  Zap,
} from "lucide-react";
import AnimateOnScroll from "@/components/home/AnimateOnScroll";
import HomeCourseCard from "@/components/home/HomeCourseCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

type CourseItem = {
  id: string;
  title: string;
  description: string;
  slug: string;
  chapterCount: number;
};

type HomePageSectionsProps = {
  courses: CourseItem[];
};

const trustPills = [
  { icon: BookOpen, label: "مفت تعلیم" },
  { icon: Code2, label: "Python کوڈ" },
  { icon: Brain, label: "AI موضوعات" },
  { icon: GraduationCap, label: "سرٹیفکیٹ" },
  { icon: Zap, label: "آسان اردو" },
];

const steps = [
  {
    num: "١",
    icon: BookOpen,
    title: "موضوع چنیں",
    desc: "اپنی پسند کا AI موضوع منتخب کریں",
  },
  {
    num: "٢",
    icon: Brain,
    title: "سمجھیں",
    desc: "آسان اردو میں تفصیل اور مثالیں پڑھیں",
  },
  {
    num: "٣",
    icon: Code2,
    title: "بنائیں",
    desc: "Python کوڈ سے عملی مشق کریں",
  },
];

const learnFeatures = [
  {
    icon: Brain,
    iconBg: "bg-blue-100 dark:bg-blue-950",
    iconColor: "text-blue-600 dark:text-blue-400",
    title: "AI کے بنیادی اصول",
    desc: "نیورل نیٹ ورکس، مشین لرننگ اور AI کی بنیادی تصورات اردو میں",
  },
  {
    icon: Code2,
    iconBg: "bg-violet-100 dark:bg-violet-950",
    iconColor: "text-violet-600 dark:text-violet-400",
    title: "Python پروگرامنگ",
    desc: "ہر سبق کے ساتھ عملی Python کوڈ کی مثالیں اور مشقیں",
  },
  {
    icon: BarChart3,
    iconBg: "bg-emerald-100 dark:bg-emerald-950",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    title: "ڈیٹا سائنس",
    desc: "ڈیٹا کا تجزیہ، visualization اور ماڈل بنانا سیکھیں",
  },
  {
    icon: Zap,
    iconBg: "bg-amber-100 dark:bg-amber-950",
    iconColor: "text-amber-600 dark:text-amber-400",
    title: "مشین لرننگ",
    desc: "الگورتھم، training اور prediction کی مکمل سمجھ",
  },
  {
    icon: Sparkles,
    iconBg: "bg-rose-100 dark:bg-rose-950",
    iconColor: "text-rose-600 dark:text-rose-400",
    title: "ڈیپ لرننگ",
    desc: "CNN، RNN اور جدید neural architectures کا تعارف",
  },
  {
    icon: Globe,
    iconBg: "bg-cyan-100 dark:bg-cyan-950",
    iconColor: "text-cyan-600 dark:text-cyan-400",
    title: "عملی پروجیکٹس",
    desc: "حقیقی دنیا کے پروجیکٹس سے سیکھیں اور پورٹ فولیو بنائیں",
  },
];

export default function HomePageSections({ courses }: HomePageSectionsProps) {
  return (
    <>
      {/* Trust bar */}
      <section className="border-y border-slate-800 bg-slate-900 py-14">
        <p className="mb-8 text-center font-sans text-base text-slate-300">
          پاکستان بھر کے طلباء AI سیکھنے کے لیے سیکھیں AI کا انتخاب کرتے ہیں
        </p>
        <div className="container-public flex flex-wrap justify-center gap-4 sm:gap-6">
          {trustPills.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-5 py-2.5 font-sans text-small text-slate-300"
            >
              <Icon className="h-4 w-4 text-blue-400" aria-hidden />
              {label}
            </span>
          ))}
        </div>
      </section>

      {/* Section 3 — How it works */}
      <section className="bg-white py-24 dark:bg-slate-900">
        <div className="container-public">
          <AnimateOnScroll>
            <SectionHeading title="یہ کیسے کام کرتا ہے؟" centered />
          </AnimateOnScroll>

          <div className="mt-16 flex flex-col gap-12 md:flex-row md:items-start md:justify-center">
            {steps.map((step, index) => (
              <div key={step.title} className="flex flex-1 items-start">
                {index > 0 && (
                  <div
                    className="mx-2 mt-6 hidden h-px min-w-[2rem] flex-1 border-t-2 border-dashed border-slate-300 md:block dark:border-slate-600"
                    aria-hidden
                  />
                )}
                <AnimateOnScroll delay={index * 100} className="flex-1">
                  <div className="flex flex-col items-center px-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 font-sans text-xl font-bold text-white">
                      {step.num}
                    </div>
                    <div className="mt-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950">
                      <step.icon
                        className="h-7 w-7 text-blue-600 dark:text-blue-400"
                        aria-hidden
                      />
                    </div>
                    <h3 className="mt-4 text-center text-xl font-bold text-slate-900 dark:text-text-primary">
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-xs text-center text-small leading-relaxed text-slate-500 dark:text-text-muted">
                      {step.desc}
                    </p>
                  </div>
                </AnimateOnScroll>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4 — Featured courses */}
      <section className="bg-slate-50 py-24 dark:bg-slate-950">
        <div className="container-public">
          <AnimateOnScroll>
            <SectionHeading
              title="دستیاب کورسز"
              subtitle="اپنی سطح کے مطابق کورس منتخب کریں"
              centered
            />
          </AnimateOnScroll>

          {courses.length === 0 ? (
            <p className="mt-12 text-center text-body text-text-muted">
              ابھی کوئی کورس شائع نہیں ہوا — جلد واپس آئیں!
            </p>
          ) : (
            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course, index) => (
                <AnimateOnScroll key={course.id} delay={index * 100}>
                  <HomeCourseCard
                    title={course.title}
                    description={course.description}
                    slug={course.slug}
                    chapterCount={course.chapterCount}
                  />
                </AnimateOnScroll>
              ))}
            </div>
          )}

          <AnimateOnScroll className="mt-10 flex justify-center" delay={200}>
            <Link
              href="/courses"
              className="inline-flex rounded-xl border-2 border-blue-600 px-10 py-3.5 font-sans font-medium text-blue-600 transition-all hover:bg-blue-600 hover:text-white dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-600 dark:hover:text-white"
            >
              تمام کورسز دیکھیں
            </Link>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Section 5 — Features */}
      <section id="features" className="scroll-mt-24 bg-white py-24 dark:bg-slate-900">
        <div className="container-public">
          <AnimateOnScroll>
            <SectionHeading title="آپ کیا سیکھیں گے؟" centered />
          </AnimateOnScroll>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {learnFeatures.map((feature, index) => (
              <AnimateOnScroll key={feature.title} delay={index * 80}>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 transition-all duration-300 hover:border-blue-200 hover:bg-white hover:shadow-md dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-blue-800 dark:hover:bg-card">
                  <div
                    className={cn(
                      "mb-4 flex h-12 w-12 items-center justify-center rounded-xl",
                      feature.iconBg,
                    )}
                  >
                    <feature.icon
                      className={cn("h-6 w-6", feature.iconColor)}
                      aria-hidden
                    />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-text-primary">
                    {feature.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-small leading-relaxed text-slate-500 dark:text-text-muted">
                    {feature.desc}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6 — Quote banner */}
      <section className="bg-gradient-to-l from-blue-600 to-violet-700 py-20">
        <div className="container-public text-center">
          <p
            className="font-serif text-8xl leading-none text-white/20"
            aria-hidden
          >
            &ldquo;
          </p>
          <blockquote className="mx-auto max-w-3xl text-2xl font-medium leading-[1.85] text-white">
            اردو میں AI سیکھنا اب آسان ہو گیا — پاکستانی طلباء کے لیے
            پاکستانی انداز میں
          </blockquote>
          <p className="mt-6 font-sans text-small text-blue-200">
            — سیکھیں AI ٹیم
          </p>
        </div>
      </section>

      {/* Section 7 — Final CTA */}
      <section className="bg-slate-50 py-24 text-center dark:bg-slate-950">
        <div className="container-public">
          <AnimateOnScroll>
            <SectionHeading
              title="آج ہی شروع کریں"
              subtitle="مفت — کوئی اکاؤنٹ نہیں — ابھی پڑھنا شروع کریں"
              centered
            />
          </AnimateOnScroll>

          <AnimateOnScroll delay={150} className="mt-10">
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/courses"
                className="inline-flex rounded-xl bg-blue-600 px-10 py-4 font-sans font-medium text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 hover:shadow-xl dark:shadow-blue-900/30"
              >
                پہلا سبق شروع کریں
              </Link>
              <Link
                href="/courses"
                className="inline-flex rounded-xl border-2 border-slate-300 px-10 py-4 font-sans font-medium text-slate-700 transition-all hover:border-blue-400 dark:border-slate-600 dark:text-slate-200 dark:hover:border-blue-500"
              >
                کورسز دیکھیں
              </Link>
            </div>
          </AnimateOnScroll>

          <ul className="mt-8 flex flex-wrap justify-center gap-6 font-sans text-small text-slate-400 dark:text-slate-500">
            <li>✓ بالکل مفت</li>
            <li>✓ اردو میں</li>
            <li>✓ Python کوڈ شامل</li>
          </ul>
        </div>
      </section>
    </>
  );
}
