"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import SharePanel from "@/components/subtopic/SharePanel";

type SubtopicShareButtonProps = {
  title: string;
  pageUrl: string;
  variant?: "light" | "dark";
};

export default function SubtopicShareButton({
  title,
  pageUrl,
  variant = "light",
}: SubtopicShareButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={
          variant === "dark"
            ? "inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 font-sans text-small font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            : "inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-sans text-small font-medium text-slate-700 shadow-sm transition-colors hover:border-blue-300 hover:text-blue-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:text-blue-400"
        }
      >
        <Share2 className="h-4 w-4" aria-hidden />
        شیئر کریں
      </button>
      <SharePanel
        title={title}
        url={pageUrl}
        open={open}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
