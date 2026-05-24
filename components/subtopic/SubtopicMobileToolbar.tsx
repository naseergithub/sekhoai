"use client";

import { AlignRight, Layers, Share2 } from "lucide-react";
import SharePanel from "@/components/subtopic/SharePanel";
import TableOfContents, { type TocSection } from "@/components/subtopic/TableOfContents";
import { cn } from "@/lib/utils";
import { useState } from "react";

type SubtopicMobileToolbarProps = {
  title: string;
  pageUrl: string;
  tocSections: TocSection[];
  onOpenSidebar: () => void;
};

export default function SubtopicMobileToolbar({
  title,
  pageUrl,
  tocSections,
  onOpenSidebar,
}: SubtopicMobileToolbarProps) {
  const [tocOpen, setTocOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 end-6 z-50 flex flex-col gap-2.5 lg:hidden">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-l from-blue-600 to-violet-600 text-white shadow-xl shadow-blue-500/30 transition-transform active:scale-95"
          aria-label="کورس مینو"
        >
          <Layers className="h-6 w-6" aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => {
            setTocOpen(true);
            setShareOpen(false);
          }}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-xl transition-transform active:scale-95 dark:border-slate-700 dark:bg-card"
          aria-label="مضامین"
        >
          <AlignRight className="h-6 w-6" aria-hidden />
        </button>
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShareOpen((o) => !o);
              setTocOpen(false);
            }}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-600 text-white shadow-xl transition-transform active:scale-95"
            aria-label="شیئر کریں"
          >
            <Share2 className="h-6 w-6" aria-hidden />
          </button>
          <SharePanel
            title={title}
            url={pageUrl}
            open={shareOpen}
            onClose={() => setShareOpen(false)}
            anchor="floating"
          />
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 lg:hidden",
          tocOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setTocOpen(false)}
        aria-hidden
      />

      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 max-h-[80vh] overflow-y-auto rounded-t-3xl bg-white shadow-2xl transition-transform duration-300 lg:hidden dark:bg-slate-900",
          tocOpen ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="sticky top-0 bg-white px-4 pb-4 pt-3 dark:bg-slate-900">
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-300 dark:bg-slate-600" />
          <p className="text-center font-bold text-slate-900 dark:text-text-primary">
            مضامین
          </p>
        </div>
        <div className="px-4 pb-8">
          <TableOfContents
            sections={tocSections}
            className="!static !max-h-none !w-full"
          />
        </div>
      </div>
    </>
  );
}
