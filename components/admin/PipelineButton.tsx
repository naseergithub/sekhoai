"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type PipelineButtonProps = {
  subtopicId: string;
  variant?: "primary" | "secondary";
};

export default function PipelineButton({
  subtopicId,
  variant = "secondary",
}: PipelineButtonProps) {
  const router = useRouter();
  const [running, setRunning] = useState(false);
  const [steps, setSteps] = useState({
    content: "pending" as string,
    seo: "pending" as string,
    social: "pending" as string,
  });

  const run = async () => {
    setRunning(true);
    setSteps({ content: "running", seo: "pending", social: "pending" });

    const res = await fetch("/api/admin/agent/pipeline", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subtopicId }),
    });

    const data = await res.json();
    setRunning(false);

    setSteps({
      content: data.content?.success ? "done" : "failed",
      seo: data.seo?.success ? "done" : "failed",
      social: data.social?.success ? "done" : "failed",
    });

    if (res.ok) {
      alert(data.message ?? "Pipeline complete");
      router.refresh();
      window.location.reload();
    } else {
      alert(data.error ?? "Pipeline failed");
    }
  };

  const stepIcon = (s: string) => {
    if (s === "done") return "✅";
    if (s === "failed") return "❌";
    if (s === "running") return "⏳";
    return "○";
  };

  return (
    <div>
      <button
        type="button"
        onClick={run}
        disabled={running}
        className={
          variant === "primary"
            ? "rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            : "rounded-lg border border-indigo-300 bg-indigo-50 px-6 py-2.5 text-sm font-medium text-indigo-700 hover:bg-indigo-100 disabled:opacity-50"
        }
      >
        {running ? "Running pipeline..." : "Run Full Pipeline"}
      </button>
      {running && (
        <ul className="mt-3 space-y-1 text-sm text-gray-600">
          <li>{stepIcon(steps.content)} Content</li>
          <li>{stepIcon(steps.seo)} SEO + FAQ</li>
          <li>{stepIcon(steps.social)} Social Posts</li>
        </ul>
      )}
    </div>
  );
}
