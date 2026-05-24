"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  ChevronDown,
  FileText,
  GraduationCap,
  Layers,
  ListTree,
  Sparkles,
  X,
} from "lucide-react";
import type { SidebarProps } from "@/lib/sidebar";
import { cn, toUrduNumeral } from "@/lib/utils";

export type { SidebarChapter, SidebarProps, SidebarTree } from "@/lib/sidebar";

function SidebarPanel({
  course,
  chapters,
  activeChapterSlug,
  activeTopicSlug,
  activeSubtopicSlug,
  onNavigate,
}: SidebarProps & { onNavigate?: () => void }) {
  const [openChapters, setOpenChapters] = useState<Record<string, boolean>>(
    () => {
      const initial: Record<string, boolean> = {};
      for (const chapter of chapters) {
        initial[chapter.id] =
          chapter.slug === activeChapterSlug ||
          chapter.topics.some((t) => t.slug === activeTopicSlug);
      }
      return initial;
    },
  );

  const { chapterCount, topicCount, subtopicCount } = useMemo(() => {
    const ch = chapters.length;
    const top = chapters.reduce((sum, c) => sum + c.topics.length, 0);
    const sub = chapters.reduce(
      (sum, c) =>
        sum + c.topics.reduce((ts, t) => ts + t.subtopics.length, 0),
      0,
    );
    return { chapterCount: ch, topicCount: top, subtopicCount: sub };
  }, [chapters]);

  const toggleChapter = (chapterId: string) => {
    setOpenChapters((prev) => ({ ...prev, [chapterId]: !prev[chapterId] }));
  };

  return (
    <div className="flex h-full flex-col">
      {/* Course card */}
      <Link
        href={`/courses/${course.slug}`}
        onClick={onNavigate}
        className="group relative mb-5 block overflow-hidden rounded-2xl border border-blue-200/50 bg-gradient-to-bl from-blue-600 to-violet-700 p-4 text-white shadow-lg shadow-blue-500/15 transition-all hover:shadow-xl dark:border-blue-800/50"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
          aria-hidden
        />
        <div className="relative flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 ring-1 ring-white/25">
            <GraduationCap className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="line-clamp-2 text-sm font-bold leading-[1.75]">
              {course.title}
            </p>
            <p className="mt-2 flex flex-wrap gap-x-2 gap-y-1 font-sans text-caption text-blue-100">
              <span>{toUrduNumeral(chapterCount)} ابواب</span>
              <span aria-hidden>·</span>
              <span>{toUrduNumeral(topicCount)} موضوعات</span>
              <span aria-hidden>·</span>
              <span>{toUrduNumeral(subtopicCount)} سبق</span>
            </p>
          </div>
        </div>
      </Link>

      <div className="mb-3 flex items-center gap-2 px-1">
        <ListTree
          className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400"
          aria-hidden
        />
        <p className="font-sans text-caption font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          کورس مینو
        </p>
      </div>

      <nav className="scrollbar-thin flex-1 space-y-1.5 overflow-y-auto pe-0.5">
        {chapters.map((chapter) => {
          const isChapterActive = chapter.slug === activeChapterSlug;
          const isOpen = openChapters[chapter.id] ?? isChapterActive;
          const hasActiveTopic = chapter.topics.some(
            (t) => t.slug === activeTopicSlug,
          );

          return (
            <div
              key={chapter.id}
              className={cn(
                "overflow-hidden rounded-xl border transition-colors",
                isChapterActive || hasActiveTopic
                  ? "border-blue-200/80 bg-white shadow-sm dark:border-blue-800/50 dark:bg-slate-900/80"
                  : "border-transparent bg-slate-50/80 dark:bg-slate-800/30",
              )}
            >
              <div className="flex items-stretch">
                <button
                  type="button"
                  onClick={() => toggleChapter(chapter.id)}
                  className="flex shrink-0 items-center justify-center px-2 text-slate-400 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                  aria-expanded={isOpen}
                  aria-label={`باب ${toUrduNumeral(chapter.order)} کھولیں`}
                >
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>

                <Link
                  href={`/chapter/${chapter.slug}`}
                  onClick={onNavigate}
                  className={cn(
                    "flex min-w-0 flex-1 items-center gap-2.5 py-3 pe-3 ps-0 text-right transition-colors",
                    isChapterActive && "bg-blue-50/50 dark:bg-blue-950/20",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-sans text-caption font-bold",
                      isChapterActive
                        ? "bg-gradient-to-b from-blue-600 to-violet-600 text-white shadow-sm"
                        : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
                    )}
                  >
                    {toUrduNumeral(chapter.order)}
                  </span>
                  <span
                    className={cn(
                      "line-clamp-2 flex-1 text-small font-semibold leading-[1.65]",
                      isChapterActive
                        ? "text-blue-700 dark:text-blue-400"
                        : "text-slate-700 dark:text-slate-200",
                    )}
                  >
                    {chapter.title}
                  </span>
                </Link>
              </div>

              {isOpen && chapter.topics.length > 0 && (
                <ul className="border-t border-slate-100 px-2 pb-2 pt-1 dark:border-slate-700/80">
                  {chapter.topics.map((topic) => {
                    const isTopicActive = topic.slug === activeTopicSlug;
                    const showSubtopics =
                      isTopicActive && topic.subtopics.length > 0;

                    return (
                      <li key={topic.id}>
                        <Link
                          href={`/topic/${topic.slug}`}
                          onClick={onNavigate}
                          className={cn(
                            "flex items-center gap-2 rounded-lg px-2.5 py-2.5 text-right transition-all",
                            isTopicActive
                              ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                              : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800",
                          )}
                        >
                          <FileText
                            className={cn(
                              "h-3.5 w-3.5 shrink-0",
                              isTopicActive
                                ? "text-blue-100"
                                : "text-slate-400",
                            )}
                            aria-hidden
                          />
                          <span
                            className={cn(
                              "line-clamp-2 flex-1 text-caption leading-[1.6]",
                              isTopicActive && "font-semibold",
                            )}
                          >
                            {topic.title}
                          </span>
                          {topic.subtopics.length > 0 && (
                            <span
                              className={cn(
                                "shrink-0 rounded-full px-1.5 py-0.5 font-sans text-[0.65rem] font-medium",
                                isTopicActive
                                  ? "bg-white/20 text-blue-50"
                                  : "bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400",
                              )}
                            >
                              {toUrduNumeral(topic.subtopics.length)}
                            </span>
                          )}
                        </Link>

                        {showSubtopics && (
                          <ul className="me-2 mt-0.5 space-y-0.5 border-r-2 border-blue-200 pe-3 ps-1 dark:border-blue-800">
                            {topic.subtopics.map((subtopic) => {
                              const isSubActive =
                                subtopic.slug === activeSubtopicSlug;
                              return (
                                <li key={subtopic.id}>
                                  <Link
                                    href={`/subtopic/${subtopic.slug}`}
                                    onClick={onNavigate}
                                    className={cn(
                                      "flex items-center gap-2 rounded-md py-2 pe-2 ps-2 text-caption leading-[1.55] transition-colors",
                                      isSubActive
                                        ? "bg-blue-50 font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-slate-800/50",
                                    )}
                                  >
                                    <span
                                      className={cn(
                                        "h-1.5 w-1.5 shrink-0 rounded-full",
                                        isSubActive
                                          ? "bg-blue-600 dark:bg-blue-400"
                                          : "bg-slate-300 dark:bg-slate-600",
                                      )}
                                      aria-hidden
                                    />
                                    <span className="line-clamp-2">
                                      {subtopic.title}
                                    </span>
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </nav>

      <div className="mt-4 rounded-2xl border border-violet-200/60 bg-gradient-to-bl from-violet-50 to-blue-50 p-4 dark:border-violet-900/50 dark:from-violet-950/40 dark:to-blue-950/40">
        <p className="flex items-center justify-center gap-2 text-center font-sans text-caption font-medium text-violet-700 dark:text-violet-300">
          <Sparkles className="h-4 w-4 shrink-0" aria-hidden />
          AI ٹیوٹر — جلد آ رہا ہے
        </p>
        <button
          type="button"
          disabled
          className="mt-3 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-violet-200/80 bg-white/80 py-2.5 font-sans text-caption font-medium text-violet-600 opacity-70 dark:border-violet-800 dark:bg-slate-900/50 dark:text-violet-400"
        >
          <BookOpen className="h-3.5 w-3.5" aria-hidden />
          سوال پوچھیں
        </button>
      </div>
    </div>
  );
}

type SidebarComponentProps = SidebarProps & {
  hideMobileTrigger?: boolean;
  hideDesktop?: boolean;
  mobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
};

export default function Sidebar({
  hideMobileTrigger = false,
  hideDesktop = false,
  mobileOpen: controlledMobileOpen,
  onMobileOpenChange,
  ...props
}: SidebarComponentProps) {
  const [internalMobileOpen, setInternalMobileOpen] = useState(false);
  const mobileOpen = controlledMobileOpen ?? internalMobileOpen;
  const setMobileOpen = onMobileOpenChange ?? setInternalMobileOpen;

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const stickyTop = "calc(var(--header-height) + 1rem)";

  return (
    <>
      {/* Desktop */}
      {!hideDesktop && (
      <aside className="hidden w-80 shrink-0 lg:block">
        <div
          className="scrollbar-thin sticky max-h-[calc(100vh-var(--header-height)-2rem)] overflow-y-auto rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-700/80 dark:bg-slate-900/50"
          style={{ top: stickyTop }}
        >
          <SidebarPanel {...props} />
        </div>
      </aside>
      )}

      {!hideMobileTrigger && (
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="fixed bottom-6 start-6 z-50 flex items-center gap-2 rounded-full bg-gradient-to-l from-blue-600 to-violet-600 py-3.5 ps-5 pe-4 font-sans text-small font-semibold text-white shadow-xl shadow-blue-500/30 transition-transform hover:scale-[1.02] lg:hidden"
          aria-label="کورس مینو کھولیں"
        >
          <Layers className="h-5 w-5 shrink-0" aria-hidden />
          <span>مینو</span>
        </button>
      )}

      {/* Mobile backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        style={{ top: "var(--header-height)" }}
        onClick={() => setMobileOpen(false)}
        aria-hidden
      />

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col overflow-hidden rounded-t-3xl border-t border-slate-200 bg-white shadow-2xl transition-transform duration-300 lg:hidden dark:border-slate-800 dark:bg-slate-900",
          mobileOpen ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="relative shrink-0 border-b border-slate-100 bg-white px-4 pb-3 pt-3 dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-slate-300 dark:bg-slate-600" />
          <p className="text-center font-sans text-small font-semibold text-slate-700 dark:text-slate-200">
            کورس مینو
          </p>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="absolute end-3 top-3 rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="بند کریں"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="scrollbar-thin flex-1 overflow-y-auto px-4 pb-8 pt-2">
          <SidebarPanel {...props} onNavigate={() => setMobileOpen(false)} />
        </div>
      </div>
    </>
  );
}
