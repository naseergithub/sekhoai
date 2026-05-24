"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye } from "lucide-react";

type RowActionsProps = {
  editHref: string;
  previewHref?: string;
  published: boolean;
  onToggle: () => Promise<void>;
  onDelete: () => Promise<void>;
  extra?: React.ReactNode;
};

export default function RowActions({
  editHref,
  previewHref,
  published,
  onToggle,
  onDelete,
  extra,
}: RowActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const run = async (fn: () => Promise<void>) => {
    setLoading(true);
    try {
      await fn();
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Action failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {previewHref && (
        <a
          href={previewHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200"
        >
          <Eye className="h-3 w-3" aria-hidden />
          Preview
        </a>
      )}
      <Link
        href={editHref}
        className="rounded bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
      >
        Edit
      </Link>
      <button
        type="button"
        disabled={loading}
        onClick={() => run(onToggle)}
        className="rounded bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 hover:bg-amber-100 disabled:opacity-50"
      >
        {published ? "Unpublish" : "Publish"}
      </button>
      <button
        type="button"
        disabled={loading}
        onClick={() => {
          if (confirm("Are you sure you want to delete this item?")) {
            run(onDelete);
          }
        }}
        className="rounded bg-red-50 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
      >
        Delete
      </button>
      {extra}
    </div>
  );
}
