"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertTriangle, Eye } from "lucide-react";

type ReviewItem = {
  id: string;
  title: string;
  slug: string;
  aiGeneratedAt: Date | string | null;
  qualityWarning?: string | null;
  topic: {
    title: string;
    chapter: {
      title: string;
      course: { title: string };
    };
  };
};

export default function ReviewQueueTable({ items }: { items: ReviewItem[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const toggle = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const publishOne = async (id: string) => {
    if (!confirm("Are you sure you want to publish this subtopic?")) return;
    await fetch(`/api/admin/subtopics/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: true }),
    });
    router.refresh();
  };

  const deleteOne = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    await fetch(`/api/admin/subtopics/${id}`, { method: "DELETE" });
    router.refresh();
  };

  const bulkPublish = async () => {
    if (!selected.size) return;
    if (!confirm(`Are you sure you want to publish ${selected.size} subtopics?`)) return;

    setLoading(true);
    await fetch("/api/admin/agent/review/publish-bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subtopicIds: Array.from(selected) }),
    });
    setLoading(false);
    setSelected(new Set());
    router.refresh();
  };

  if (items.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        No AI content pending review — everything is published.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {selected.size > 0 && (
        <button
          type="button"
          onClick={bulkPublish}
          disabled={loading}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          Publish Selected ({selected.size})
        </button>
      )}

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3">
                <input
                  type="checkbox"
                  checked={selected.size === items.length && items.length > 0}
                  onChange={() => {
                    if (selected.size === items.length) setSelected(new Set());
                    else setSelected(new Set(items.map((i) => i.id)));
                  }}
                />
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Title</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Chapter</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Generated At</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-3 py-3 align-top">
                  <input
                    type="checkbox"
                    checked={selected.has(item.id)}
                    onChange={() => toggle(item.id)}
                  />
                </td>
                <td className="px-4 py-3 align-top">
                  <p className="font-medium">
                    <span dir="rtl" className="font-urdu">{item.title}</span>
                  </p>
                  {item.qualityWarning && (
                    <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
                      <p className="flex items-start gap-2 text-xs text-amber-800">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                        <span>
                          <span className="font-semibold">Quality issues:</span>{" "}
                          {item.qualityWarning}
                        </span>
                      </p>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span dir="rtl" className="font-urdu">{item.topic.chapter.title}</span>
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {item.aiGeneratedAt
                    ? new Date(item.aiGeneratedAt).toLocaleString()
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={`/admin/subtopics/${item.id}/preview`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200"
                    >
                      <Eye className="h-3 w-3" aria-hidden />
                      Preview
                    </a>
                    <Link
                      href={`/admin/subtopics/${item.id}/edit`}
                      className="rounded bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => publishOne(item.id)}
                      className="rounded bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
                    >
                      Publish
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteOne(item.id)}
                      className="rounded bg-red-50 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
