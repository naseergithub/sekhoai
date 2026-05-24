"use client";

import { useEffect, useRef } from "react";
import { Check, Link2, MessageCircle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type SharePanelProps = {
  title: string;
  url: string;
  open: boolean;
  onClose: () => void;
  className?: string;
  anchor?: "header" | "floating";
};

export default function SharePanel({
  title,
  url,
  open,
  onClose,
  className,
  anchor = "header",
}: SharePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onMouseDown = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [open, onClose]);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const platforms = [
    {
      name: "واٹس ایپ",
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      className: "bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-950 dark:text-green-300",
    },
    {
      name: "فیس بک",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      className: "bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300",
    },
    {
      name: "ٹویٹر",
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      className: "bg-slate-50 text-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300",
    },
    {
      name: "لنکڈ اِن",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      className: "bg-sky-50 text-sky-700 hover:bg-sky-100 dark:bg-sky-950 dark:text-sky-300",
    },
  ];

  const copyUrl = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      className={cn(
        "z-50 w-64 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-card",
        anchor === "header"
          ? "absolute end-0 top-full mt-2"
          : "fixed bottom-24 start-6",
        className,
      )}
    >
      <p className="mb-3 text-small font-bold text-slate-900 dark:text-text-primary">
        اس سبق کو شیئر کریں
      </p>
      <div className="grid grid-cols-2 gap-2">
        {platforms.map((p) => (
          <a
            key={p.name}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex items-center gap-2 rounded-xl p-3 font-sans text-caption font-medium transition-all",
              p.className,
            )}
          >
            <MessageCircle className="h-4 w-4 shrink-0" aria-hidden />
            {p.name}
          </a>
        ))}
      </div>
      <div className="mt-3 border-t border-slate-100 pt-3 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={url}
            dir="ltr"
            className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-sans text-caption text-slate-500 dark:border-slate-600 dark:bg-slate-900"
          />
          <button
            type="button"
            onClick={copyUrl}
            className="flex shrink-0 items-center gap-1 rounded-lg bg-blue-600 px-3 py-2 font-sans text-caption text-white hover:bg-blue-700"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5" aria-hidden />
            ) : (
              <Link2 className="h-3.5 w-3.5" aria-hidden />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
