"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Calendar,
  ChevronLeft,
  Clock,
  Eye,
  FileText,
  Layers,
  Share2,
  Sparkles,
} from "lucide-react";
import SharePanel from "@/components/subtopic/SharePanel";

type SubtopicHeaderProps = {
  title: string;
  topicTitle: string;
  topicSlug: string;
  chapterTitle: string;
  chapterSlug: string;
  aiGenerated: boolean;
  readingTimeLabel: string;
  publishedDate: string;
  pageUrl: string;
};

export default function SubtopicHeader({
  title,
  topicTitle,
  topicSlug,
  chapterTitle,
  chapterSlug,
  aiGenerated,
  readingTimeLabel,
  publishedDate,
  pageUrl,
}: SubtopicHeaderProps) {
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <header className="relative mb-8 rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-700 dark:bg-card">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Link
          href={`/topic/${topicSlug}`}
          className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 font-sans text-small text-blue-700 transition-colors hover:bg-blue-200 dark:bg-blue-950 dark:text-blue-300"
        >
          <FileText className="h-3.5 w-3.5" aria-hidden />
          {topicTitle}
        </Link>
        <ChevronLeft className="h-4 w-4 rotate-180 text-slate-300" aria-hidden />
        <Link
          href={`/chapter/${chapterSlug}`}
          className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-1.5 font-sans text-small text-violet-700 transition-colors hover:bg-violet-200 dark:bg-violet-950 dark:text-violet-300"
        >
          <Layers className="h-3.5 w-3.5" aria-hidden />
          {chapterTitle}
        </Link>
        {aiGenerated && (
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-gradient-to-l from-violet-100 to-blue-100 px-4 py-1.5 font-sans text-small text-violet-700 dark:border-violet-800 dark:from-violet-950 dark:to-blue-950 dark:text-violet-300">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            AI تیار شدہ
          </span>
        )}
      </div>

      <h1 className="text-4xl font-bold leading-relaxed text-slate-900 dark:text-text-primary">
        {title}
      </h1>

      <div className="mt-6 flex flex-wrap items-center gap-6 border-t border-slate-100 pt-6 dark:border-slate-700">
        <span className="flex items-center gap-2 font-sans text-small text-slate-500 dark:text-text-muted">
          <Clock className="h-4 w-4 text-slate-400" aria-hidden />
          {readingTimeLabel}
        </span>
        <span className="flex items-center gap-2 font-sans text-small text-slate-500 dark:text-text-muted">
          <Calendar className="h-4 w-4 text-slate-400" aria-hidden />
          شائع: {publishedDate}
        </span>
        <span className="flex items-center gap-2 font-sans text-small text-slate-500 dark:text-text-muted">
          <Eye className="h-4 w-4 text-slate-400" aria-hidden />
          مفت مواد
        </span>

        <div className="relative ms-auto">
          <button
            type="button"
            onClick={() => setShareOpen((o) => !o)}
            className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 font-sans text-small text-slate-600 transition-colors hover:bg-blue-100 hover:text-blue-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-blue-950 dark:hover:text-blue-400"
          >
            <Share2 className="h-4 w-4" aria-hidden />
            شیئر کریں
          </button>
          <SharePanel
            title={title}
            url={pageUrl}
            open={shareOpen}
            onClose={() => setShareOpen(false)}
          />
        </div>
      </div>
    </header>
  );
}
