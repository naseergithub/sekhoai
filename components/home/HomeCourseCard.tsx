"use client";

import Link from "next/link";
import { ArrowLeft, GraduationCap, Layers } from "lucide-react";
import { toUrduNumeral } from "@/lib/utils";

type HomeCourseCardProps = {
  title: string;
  description: string;
  slug: string;
  chapterCount: number;
};

export default function HomeCourseCard({
  title,
  description,
  slug,
  chapterCount,
}: HomeCourseCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-card">
      <div className="relative flex h-40 items-center justify-center bg-gradient-to-bl from-blue-500 to-violet-600">
        <GraduationCap className="h-12 w-12 text-white" aria-hidden />
        <span className="absolute end-3 top-3 rounded-full bg-white/20 px-2 py-1 font-sans text-caption text-white">
          {toUrduNumeral(chapterCount)} ابواب
        </span>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold leading-relaxed text-slate-900 dark:text-text-primary">
          {title}
        </h3>
        <p className="mt-2 line-clamp-2 text-small leading-relaxed text-slate-500 dark:text-text-muted">
          {description}
        </p>

        <hr className="my-4 border-slate-100 dark:border-slate-700" />

        <div className="flex items-center justify-between">
          <Link
            href={`/courses/${slug}`}
            className="group/btn inline-flex items-center gap-1 font-sans text-small font-medium text-blue-600 transition-all hover:gap-2 hover:text-blue-700 dark:text-blue-400"
          >
            شروع کریں
            <ArrowLeft
              className="h-4 w-4 transition-transform group-hover/btn:-translate-x-0.5"
              aria-hidden
            />
          </Link>
          <span className="flex items-center gap-1.5 font-sans text-small text-slate-500 dark:text-text-muted">
            <Layers className="h-4 w-4" aria-hidden />
            {toUrduNumeral(chapterCount)} ابواب
          </span>
        </div>
      </div>
    </article>
  );
}
