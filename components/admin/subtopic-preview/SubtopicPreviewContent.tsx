"use client";

import {
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import SubtopicContent from "@/components/course/SubtopicContent";
import type { SubtopicWithRelations } from "@/types";

const CONTENT_SECTIONS = [
  { key: "whatIsIt" as const, label: "What Is It?" },
  { key: "whyItMatters" as const, label: "Why It Matters" },
  { key: "howItWorks" as const, label: "How It Works" },
  { key: "mathBehindIt" as const, label: "The Math" },
  { key: "realWorldEx" as const, label: "Real-World Examples" },
  { key: "codeExample" as const, label: "Code Example" },
  { key: "applications" as const, label: "Practical Applications" },
];

type SubtopicPreviewContentProps = {
  subtopic: SubtopicWithRelations;
  onGenerate: () => void;
  generating: boolean;
};

function EmptySectionPlaceholder({
  label,
  onGenerate,
  generating,
}: {
  label: string;
  onGenerate: () => void;
  generating: boolean;
}) {
  return (
    <div className="my-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center">
      <AlertCircle className="mx-auto mb-2 h-8 w-8 text-slate-300" aria-hidden />
      <p className="font-sans text-sm text-slate-500">
        {label} — No content yet
      </p>
      <button
        type="button"
        onClick={onGenerate}
        disabled={generating}
        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-violet-100 px-4 py-2 text-sm text-violet-700 hover:bg-violet-200 disabled:opacity-50"
      >
        {generating ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        ) : (
          <Sparkles className="h-4 w-4" aria-hidden />
        )}
        Generate with AI
      </button>
    </div>
  );
}

function stripContentFields(
  subtopic: SubtopicWithRelations,
): SubtopicWithRelations {
  return {
    ...subtopic,
    whatIsIt: null,
    whyItMatters: null,
    howItWorks: null,
    mathBehindIt: null,
    realWorldEx: null,
    codeExample: null,
    applications: null,
  };
}

export default function SubtopicPreviewContent({
  subtopic,
  onGenerate,
  generating,
}: SubtopicPreviewContentProps) {
  const empty = stripContentFields(subtopic);

  return (
    <article className="space-y-8">
      {CONTENT_SECTIONS.map(({ key, label }) => {
        const value = subtopic[key];
        const hasContent = Boolean(value?.trim());

        if (hasContent) {
          return (
            <div key={key}>
              <SubtopicContent subtopic={{ ...empty, [key]: value }} />
            </div>
          );
        }

        return (
          <EmptySectionPlaceholder
            key={key}
            label={label}
            onGenerate={onGenerate}
            generating={generating}
          />
        );
      })}
    </article>
  );
}
