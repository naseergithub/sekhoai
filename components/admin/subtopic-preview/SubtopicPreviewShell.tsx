"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Eye,
  Loader2,
  PencilLine,
  Sparkles,
  X,
} from "lucide-react";
import SubtopicPreviewContent from "@/components/admin/subtopic-preview/SubtopicPreviewContent";
import SubtopicPreviewHero from "@/components/admin/subtopic-preview/SubtopicPreviewHero";
import SubtopicFaqSection from "@/components/subtopic/SubtopicFaqSection";
import SubtopicLessonNav from "@/components/subtopic/SubtopicLessonNav";
import RelatedSubtopics from "@/components/subtopic/RelatedSubtopics";
import {
  runSubtopicQualityChecks,
  type QualityCheckResult,
} from "@/lib/admin/subtopicQualityCheck";
import type { SubtopicNavItem } from "@/lib/db/queries";
import type { FaqItem } from "@/lib/seo/structuredData";
import type { SubtopicWithRelations } from "@/types";
import { cn } from "@/lib/utils";

type SubtopicPreviewShellProps = {
  subtopic: SubtopicWithRelations;
  faqs: FaqItem[];
  related: { title: string; slug: string }[];
  prev: SubtopicNavItem | null;
  next: SubtopicNavItem | null;
  siblingIndex: number;
  siblingTotal: number;
  readingTimeLabel: string;
  publishedDate: string;
  breadcrumb: {
    courseTitle: string;
    chapterTitle: string;
    topicTitle: string;
  };
};

function countKeywords(keywords: string | null | undefined): number {
  if (!keywords?.trim()) return 0;
  return keywords.split(",").map((k) => k.trim()).filter(Boolean).length;
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="ml-1 rounded bg-slate-700 px-1.5 py-0.5 text-xs text-slate-300">
      {children}
    </kbd>
  );
}

export default function SubtopicPreviewShell({
  subtopic: initialSubtopic,
  faqs,
  related,
  prev,
  next,
  siblingIndex,
  siblingTotal,
  readingTimeLabel,
  publishedDate,
  breadcrumb,
}: SubtopicPreviewShellProps) {
  const router = useRouter();
  const [subtopic, setSubtopic] = useState(initialSubtopic);
  const [published, setPublished] = useState(initialSubtopic.published);
  const [seoOpen, setSeoOpen] = useState(false);
  const [qualityOpen, setQualityOpen] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [seoGenerating, setSeoGenerating] = useState(false);

  const seoMeta = subtopic.seoMeta;
  const metaTitle =
    seoMeta?.metaTitle?.trim() || `${subtopic.title} | سیکھیں AI`;
  const metaDesc =
    seoMeta?.metaDesc?.trim() || subtopic.whatIsIt?.slice(0, 160) || "";
  const titleLen = (seoMeta?.metaTitle?.trim() || metaTitle).length;
  const descLen = (seoMeta?.metaDesc?.trim() || metaDesc).length;
  const keywordCount = countKeywords(seoMeta?.keywords);

  const quality: QualityCheckResult = runSubtopicQualityChecks(
    subtopic,
    seoMeta,
  );

  const missingSeo: string[] = [];
  if (!seoMeta?.metaTitle?.trim()) missingSeo.push("Meta Title");
  if (!seoMeta?.metaDesc?.trim()) missingSeo.push("Meta Description");

  const truncatedTitle =
    subtopic.title.length > 40
      ? `${subtopic.title.slice(0, 40)}…`
      : subtopic.title;

  const handleGenerate = useCallback(async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/admin/agent/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subtopicId: subtopic.id }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Generation failed");
      }
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setGenerating(false);
    }
  }, [router, subtopic.id]);

  const togglePublish = useCallback(async () => {
    setPublishing(true);
    try {
      const res = await fetch(`/api/admin/subtopics/${subtopic.id}/publish`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !published }),
      });
      if (!res.ok) throw new Error("Publish toggle failed");
      const data = await res.json();
      setPublished(data.published);
      setSubtopic((s) => ({ ...s, published: data.published }));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Action failed");
    } finally {
      setPublishing(false);
    }
  }, [published, subtopic.id]);

  const handleGenerateSeo = async () => {
    setSeoGenerating(true);
    try {
      const res = await fetch("/api/admin/seo/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subtopicId: subtopic.id }),
      });
      if (!res.ok) throw new Error("SEO generation failed");
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "SEO generation failed");
    } finally {
      setSeoGenerating(false);
    }
  };

  useEffect(() => {
    setSubtopic(initialSubtopic);
    setPublished(initialSubtopic.published);
  }, [initialSubtopic]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      if (e.key === "p" || e.key === "P") {
        e.preventDefault();
        togglePublish();
      } else if (e.key === "e" || e.key === "E") {
        e.preventDefault();
        router.push(`/admin/subtopics/${subtopic.id}/edit`);
      } else if (e.key === "Escape") {
        e.preventDefault();
        router.back();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router, subtopic.id, togglePublish]);

  const scorePct = (quality.passedCount / quality.total) * 100;
  const scoreColorClass =
    quality.scoreColor === "emerald"
      ? "text-emerald-600"
      : quality.scoreColor === "blue"
        ? "text-blue-600"
        : quality.scoreColor === "amber"
          ? "text-amber-600"
          : "text-red-600";

  return (
    <div className="-m-6 min-h-[calc(100vh-4rem)] font-sans">
      <div className="sticky top-0 z-50 flex h-14 items-center justify-between bg-slate-900 px-6 text-white">
        <div className="flex min-w-0 items-center gap-2 text-sm">
          <Eye className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
          <span className="text-slate-400">Preview Mode</span>
          <span className="text-slate-600">/</span>
          <span dir="rtl" className="truncate font-medium font-urdu">
            {truncatedTitle}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium text-white",
              published ? "bg-emerald-500" : "bg-amber-500",
            )}
          >
            {published ? "Published" : "Draft"}
          </span>
          {subtopic.aiGenerated && (
            <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-violet-600 px-3 py-1 text-xs text-white">
              <Sparkles className="h-3 w-3" aria-hidden />
              AI Generated
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/admin/subtopics/${subtopic.id}/edit`}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-700 px-4 py-2 text-sm text-white hover:bg-slate-600"
          >
            <PencilLine className="h-4 w-4" aria-hidden />
            Edit Content
            <Kbd>E</Kbd>
          </Link>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating}
            className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm text-white hover:bg-violet-700 disabled:opacity-50"
          >
            {generating ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Sparkles className="h-4 w-4" aria-hidden />
            )}
            Generate with AI
          </button>

          <button
            type="button"
            onClick={togglePublish}
            disabled={publishing}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-white disabled:opacity-50",
              published
                ? "bg-amber-600 hover:bg-amber-700"
                : "bg-emerald-600 font-semibold hover:bg-emerald-700",
            )}
          >
            {publishing ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <CheckCircle className="h-4 w-4" aria-hidden />
            )}
            {published ? "Unpublish" : "Publish Now"}
            <Kbd>P</Kbd>
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="px-2 text-sm text-slate-400 hover:text-white"
          >
            ← Back
            <Kbd>Esc</Kbd>
          </button>
        </div>
      </div>

      <div className="border-b border-slate-700 bg-slate-900">
        <button
          type="button"
          onClick={() => setSeoOpen((o) => !o)}
          className="flex w-full items-center justify-center gap-2 bg-slate-800 py-2 text-sm text-slate-300 hover:bg-slate-700"
        >
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              seoOpen && "rotate-180",
            )}
            aria-hidden
          />
          SEO Preview
        </button>

        {seoOpen && (
          <div className="border-b border-slate-700 bg-slate-800 px-6 py-4">
            <div className="mx-auto max-w-2xl rounded-xl bg-white p-4 shadow">
              <p className="text-sm text-emerald-700">
                🌐 sekhain.ai › subtopic › {subtopic.slug}
              </p>
              <p className="mt-1 text-xl font-medium text-blue-700 hover:underline">
                {metaTitle}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">
                {metaDesc}
              </p>
            </div>

            <div className="mx-auto mt-3 flex max-w-2xl flex-wrap gap-3">
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium",
                  titleLen <= 60
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-700",
                )}
              >
                Meta Title: {titleLen} chars
              </span>
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium",
                  descLen <= 160
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-700",
                )}
              >
                Meta Desc: {descLen} chars
              </span>
              <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700">
                Keywords: {keywordCount}
              </span>
            </div>

            {missingSeo.length > 0 && (
              <div className="mx-auto mt-3 max-w-2xl rounded-lg border border-amber-200 bg-amber-50 p-3">
                <p className="flex items-center gap-2 text-sm text-amber-800">
                  <AlertTriangle className="h-4 w-4 text-amber-500" aria-hidden />
                  Missing: {missingSeo.join(", ")}
                </p>
                <button
                  type="button"
                  onClick={handleGenerateSeo}
                  disabled={seoGenerating}
                  className="mt-2 rounded-lg bg-violet-600 px-4 py-2 text-sm text-white hover:bg-violet-700 disabled:opacity-50"
                >
                  {seoGenerating ? "Generating…" : "Generate SEO"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="border-b border-slate-200 bg-white">
        <button
          type="button"
          onClick={() => setQualityOpen((o) => !o)}
          className="flex w-full items-center justify-center gap-2 py-2 text-sm text-slate-600 hover:bg-slate-50"
        >
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              qualityOpen && "rotate-180",
            )}
            aria-hidden
          />
          Content Quality Check
        </button>

        {qualityOpen && (
          <div className="border-t border-slate-100 px-6 py-4">
            <ul className="mx-auto max-w-2xl space-y-2">
              {quality.checks.map((check) => (
                <li
                  key={check.id}
                  className="flex items-start gap-2 text-sm text-slate-700"
                >
                  {check.passed ? (
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden />
                  ) : (
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-red-500" aria-hidden />
                  )}
                  <span>
                    <span className="font-medium">{check.label}</span>
                    {" — "}
                    {check.message}
                    {check.detail && (
                      <span className="text-slate-500"> {check.detail}</span>
                    )}
                    {check.issues && check.issues.length > 0 && (
                      <span className="mt-1 block">
                        {check.issues.slice(0, 3).map((issue) => (
                          <span
                            key={issue}
                            className="block text-xs text-red-600"
                          >
                            {issue}
                          </span>
                        ))}
                        {check.issues.length > 3 && (
                          <span className="block text-xs text-red-600">
                            and {check.issues.length - 3} more...
                          </span>
                        )}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mx-auto mt-4 max-w-2xl">
              <p className={cn("text-sm font-semibold", scoreColorClass)}>
                {quality.passedCount} / {quality.total} checks passed —{" "}
                {quality.scoreLabel}
              </p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all"
                  style={{ width: `${scorePct}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="min-h-screen bg-slate-100 py-6">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-white shadow-xl">
          <div className="flex items-center justify-center gap-2 bg-blue-600 py-2 text-center text-sm text-white">
            <Eye className="h-4 w-4" aria-hidden />
            Preview — Public view of this subtopic
          </div>

          <div dir="rtl" className="font-urdu">
            <nav
              aria-label="Preview breadcrumb"
              className="flex flex-wrap items-center gap-1 border-b border-slate-100 px-6 py-3 font-sans text-xs text-slate-400"
            >
              <span>Home</span>
              <ChevronRight className="h-3 w-3" aria-hidden />
              <span>{breadcrumb.courseTitle}</span>
              <ChevronRight className="h-3 w-3" aria-hidden />
              <span>{breadcrumb.chapterTitle}</span>
              <ChevronRight className="h-3 w-3" aria-hidden />
              <span>{breadcrumb.topicTitle}</span>
              <ChevronRight className="h-3 w-3" aria-hidden />
              <span className="text-slate-600">{subtopic.title}</span>
            </nav>

            <SubtopicPreviewHero
              title={subtopic.title}
              topicTitle={subtopic.topic.title}
              chapterTitle={subtopic.topic.chapter.title}
              courseTitle={subtopic.topic.chapter.course.title}
              aiGenerated={subtopic.aiGenerated}
              readingTimeLabel={readingTimeLabel}
              publishedDate={publishedDate}
              lessonIndex={siblingIndex}
              lessonTotal={siblingTotal}
            />

            <section className="bg-slate-50 py-8 lg:py-10">
              <div className="container-public">
                <div className="pointer-events-none mb-8 opacity-90">
                    <SubtopicLessonNav
                      prev={prev}
                      next={next}
                      siblingIndex={siblingIndex}
                      siblingTotal={siblingTotal}
                      topicSlug={subtopic.topic.slug}
                      variant="compact"
                      className="mb-8"
                    />
                </div>

                <SubtopicPreviewContent
                    subtopic={subtopic}
                    onGenerate={handleGenerate}
                    generating={generating}
                  />

                  {faqs.length > 0 && (
                    <div className="mt-8">
                      <SubtopicFaqSection faqs={faqs} />
                    </div>
                  )}

                  <div className="mt-8 flex justify-center">
                    <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-sans text-sm text-slate-500 opacity-80">
                      <ArrowLeft className="h-4 w-4 rotate-180" aria-hidden />
                      شیئر کریں (preview)
                    </span>
                  </div>

                  <div className="pointer-events-none mt-8 opacity-90">
                    <SubtopicLessonNav
                      prev={prev}
                      next={next}
                      siblingIndex={siblingIndex}
                      siblingTotal={siblingTotal}
                      topicSlug={subtopic.topic.slug}
                      variant="full"
                    />
                  </div>

                  {related.length > 0 && (
                    <div className="pointer-events-none opacity-90">
                      <RelatedSubtopics items={related} />
                    </div>
                  )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
