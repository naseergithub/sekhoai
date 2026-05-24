"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type SubtopicAiGenerateButtonProps = {
  subtopicId: string;
  hasExistingContent: boolean;
  aiGenerated?: boolean;
};

export default function SubtopicAiGenerateButton({
  subtopicId,
  hasExistingContent,
  aiGenerated,
}: SubtopicAiGenerateButtonProps) {
  const router = useRouter();
  const [generating, setGenerating] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const runGenerate = async () => {
    setGenerating(true);
    setShowConfirm(false);

    try {
      const res = await fetch("/api/admin/agent/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subtopicId }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.message ?? data.error ?? "Generation failed");
        return;
      }

      router.refresh();
      window.location.reload();
    } catch {
      alert("Generation failed");
    } finally {
      setGenerating(false);
    }
  };

  const handleClick = () => {
    if (hasExistingContent || aiGenerated) {
      setShowConfirm(true);
      return;
    }
    runGenerate();
  };

  return (
    <div className="rounded-xl border border-violet-200 bg-violet-50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-medium text-violet-900">AI Content Generator</p>
          <p className="text-sm text-violet-700">
            Generate full Urdu content and SEO with Gemini
          </p>
        </div>
        <button
          type="button"
          onClick={handleClick}
          disabled={generating}
          className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
        >
          {generating ? "Gemini is generating content..." : "🤖 Generate Content with AI"}
        </button>
      </div>

      {generating && (
        <div className="mt-4 flex items-center gap-3 text-sm text-violet-800">
          <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-violet-600 border-t-transparent" />
          Gemini is generating content... (20–40 seconds)
        </div>
      )}

      {showConfirm && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="mb-3 text-sm text-amber-900">
            This subtopic already has content. Are you sure you want to regenerate?
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={runGenerate}
              disabled={generating}
              className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
            >
              Confirm
            </button>
            <button
              type="button"
              onClick={() => setShowConfirm(false)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
