"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type SeoRecord = {
  id: string;
  metaTitle: string | null;
  metaDesc: string | null;
  keywords: string | null;
  course?: { title: string } | null;
  chapter?: { title: string } | null;
  topic?: { title: string } | null;
  subtopic?: { title: string } | null;
};

function getContentTitle(record: SeoRecord) {
  return (
    record.course?.title ??
    record.chapter?.title ??
    record.topic?.title ??
    record.subtopic?.title ??
    "—"
  );
}

function getContentType(record: SeoRecord) {
  if (record.course) return "Course";
  if (record.chapter) return "Chapter";
  if (record.topic) return "Topic";
  if (record.subtopic) return "Subtopic";
  return "—";
}

export default function SeoManager({ records }: { records: SeoRecord[] }) {
  const router = useRouter();
  const [missingOnly, setMissingOnly] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [editing, setEditing] = useState<SeoRecord | null>(null);
  const [form, setForm] = useState({
    metaTitle: "",
    metaDesc: "",
    keywords: "",
    ogImage: "",
    canonicalUrl: "",
  });
  const [loading, setLoading] = useState(false);

  const filtered = missingOnly
    ? records.filter((r) => !r.metaTitle?.trim() || !r.metaDesc?.trim())
    : records;

  const openEdit = (record: SeoRecord) => {
    setEditing(record);
    setForm({
      metaTitle: record.metaTitle ?? "",
      metaDesc: record.metaDesc ?? "",
      keywords: record.keywords ?? "",
      ogImage: "",
      canonicalUrl: "",
    });
  };

  const saveEdit = async () => {
    if (!editing) return;
    setLoading(true);
    const res = await fetch(`/api/admin/seo/${editing.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.ok) {
      setEditing(null);
      router.refresh();
    } else {
      alert("Save failed");
    }
  };

  const bulkGenerate = async () => {
    if (selected.size === 0) {
      alert("Select at least one record");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/admin/seo/bulk-generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: Array.from(selected) }),
    });
    setLoading(false);
    if (res.ok) {
      setSelected(new Set());
      router.refresh();
      alert("SEO generated for selected items");
    } else {
      alert("Bulk generate failed");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={missingOnly}
            onChange={(e) => setMissingOnly(e.target.checked)}
          />
          Missing SEO only
        </label>
        <button
          type="button"
          onClick={bulkGenerate}
          disabled={loading || selected.size === 0}
          className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
        >
          Generate SEO with AI ({selected.size})
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3"><span className="sr-only">Select</span></th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Content Title</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Type</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Meta Title</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Meta Desc</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Keywords</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-3 py-3">
                  <input
                    type="checkbox"
                    checked={selected.has(record.id)}
                    onChange={(e) => {
                      const next = new Set(selected);
                      if (e.target.checked) next.add(record.id);
                      else next.delete(record.id);
                      setSelected(next);
                    }}
                  />
                </td>
                <td className="px-4 py-3">
                  <span dir="rtl" className="font-urdu">{getContentTitle(record)}</span>
                </td>
                <td className="px-4 py-3">{getContentType(record)}</td>
                <td className="px-4 py-3 max-w-[150px] truncate">{record.metaTitle ?? "—"}</td>
                <td className="px-4 py-3 max-w-[200px] truncate">{record.metaDesc ?? "—"}</td>
                <td className="px-4 py-3 max-w-[120px] truncate">{record.keywords ?? "—"}</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => openEdit(record)}
                    className="rounded bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-bold">Edit SEO — {getContentTitle(editing)}</h3>
            <div className="space-y-3">
              {(["metaTitle", "metaDesc", "keywords"] as const).map((field) => (
                <div key={field}>
                  <label className="mb-1 block text-sm font-medium capitalize">{field}</label>
                  {field === "metaDesc" ? (
                    <textarea
                      rows={2}
                      value={form[field]}
                      onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    />
                  ) : (
                    <input
                      value={form[field]}
                      onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={saveEdit}
                disabled={loading}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
