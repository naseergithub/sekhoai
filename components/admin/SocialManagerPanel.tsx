"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

type SubtopicOption = {
  id: string;
  title: string;
  slug: string;
  published: boolean;
};

type SocialPostRow = {
  id: string;
  subtopicId: string;
  facebook: string | null;
  instagram: string | null;
  twitter: string | null;
  youtube: string | null;
  linkedin: string | null;
  generatedAt: string;
  postedAt: string | null;
  status: "DRAFT" | "SCHEDULED" | "POSTED";
  subtopic: { title: string; slug: string; published: boolean };
};

type SocialManagerPanelProps = {
  publishedSubtopics: SubtopicOption[];
  history: SocialPostRow[];
};

type Tab = "generate" | "history" | "calendar";

const PLATFORMS = [
  { key: "facebook" as const, label: "Facebook", max: null, color: "bg-blue-600" },
  { key: "instagram" as const, label: "Instagram", max: 2200, color: "bg-pink-600" },
  { key: "twitter" as const, label: "Twitter/X", max: 280, color: "bg-sky-500" },
  { key: "youtube" as const, label: "YouTube", max: 5000, color: "bg-red-600" },
  { key: "linkedin" as const, label: "LinkedIn", max: 3000, color: "bg-blue-700" },
];

export default function SocialManagerPanel({
  publishedSubtopics,
  history,
}: SocialManagerPanelProps) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("generate");
  const [subtopicId, setSubtopicId] = useState(publishedSubtopics[0]?.id ?? "");
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<Record<string, string>>({});
  const [socialPostId, setSocialPostId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("");

  const generate = async () => {
    if (!subtopicId) return;
    setLoading(true);
    const res = await fetch("/api/admin/social/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subtopicId }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setPosts(data.posts);
      router.refresh();
    } else {
      alert(data.error ?? "Failed");
    }
  };

  const copyText = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  const markPosted = async (id: string) => {
    await fetch(`/api/admin/social/${id}`, { method: "PATCH" });
    router.refresh();
  };

  const savePost = async (id: string) => {
    await fetch(`/api/admin/social/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(posts),
    });
    router.refresh();
  };

  const filteredHistory = statusFilter
    ? history.filter((h) => h.status === statusFilter)
    : history;

  const tabs: { id: Tab; label: string }[] = [
    { id: "generate", label: "Generate Posts" },
    { id: "history", label: "Post History" },
    { id: "calendar", label: "Content Calendar" },
  ];

  const existing = history.find((h) => h.subtopicId === subtopicId);

  return (
    <div className="space-y-6">
      <div className="flex gap-2 border-b border-gray-200">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "border-b-2 px-4 py-2 text-sm font-medium",
              tab === t.id
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-gray-500",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "generate" && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Subtopic (published)</label>
              <select
                value={subtopicId}
                onChange={(e) => {
                  setSubtopicId(e.target.value);
                  const ex = history.find((h) => h.subtopicId === e.target.value);
                  if (ex) {
                    setPosts({
                      facebook: ex.facebook ?? "",
                      instagram: ex.instagram ?? "",
                      twitter: ex.twitter ?? "",
                      youtube: ex.youtube ?? "",
                      linkedin: ex.linkedin ?? "",
                    });
                    setSocialPostId(ex.id);
                  } else {
                    setPosts({});
                    setSocialPostId(null);
                  }
                }}
                className="min-w-[280px] rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                {publishedSubtopics.map((s) => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={generate}
              disabled={loading || !subtopicId}
              className="rounded-lg bg-violet-600 px-6 py-2.5 text-sm font-medium text-white disabled:opacity-50"
            >
              {loading ? "Gemini is writing posts..." : "Generate Social Media Posts"}
            </button>
          </div>

          {(Object.keys(posts).length > 0 || existing) && (
            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
              {PLATFORMS.map((platform) => {
                const text =
                  posts[platform.key] ??
                  (existing ? (existing[platform.key] ?? "") : "");
                const overLimit =
                  platform.max !== null && text.length > platform.max;
                return (
                  <div
                    key={platform.key}
                    className="rounded-xl border border-gray-200 bg-white p-4"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className={cn("rounded px-2 py-0.5 text-xs font-bold text-white", platform.color)}>
                        {platform.label}
                      </span>
                      <span
                        className={cn(
                          "text-xs",
                          overLimit ? "font-bold text-red-600" : "text-gray-500",
                        )}
                      >
                        {text.length}
                        {platform.max ? ` / ${platform.max}` : ""}
                      </span>
                    </div>
                    <textarea
                      rows={8}
                      value={text}
                      onChange={(e) =>
                        setPosts((p) => ({ ...p, [platform.key]: e.target.value }))
                      }
                      dir="rtl"
                      className="mb-3 w-full rounded-lg border border-gray-200 p-2 text-sm"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => copyText(text)}
                        className="rounded bg-gray-100 px-3 py-1 text-xs font-medium"
                      >
                        Copy
                      </button>
                      {socialPostId && (
                        <>
                          <button
                            type="button"
                            onClick={() => savePost(socialPostId)}
                            className="rounded bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => markPosted(socialPostId)}
                            className="rounded bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
                          >
                            Mark as Posted
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {tab === "history" && (
        <div className="space-y-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">All statuses</option>
            <option value="DRAFT">DRAFT</option>
            <option value="POSTED">POSTED</option>
          </select>
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left">Subtopic</th>
                  <th className="px-3 py-2 text-left">Generated</th>
                  <th className="px-3 py-2 text-left">Status</th>
                  <th className="px-3 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((row) => (
                  <tr key={row.id} className="border-t">
                    <td className="px-3 py-2">
                      <span dir="rtl" className="font-urdu">{row.subtopic.title}</span>
                    </td>
                    <td className="px-3 py-2 text-xs text-gray-500">
                      {new Date(row.generatedAt).toLocaleString()}
                    </td>
                    <td className="px-3 py-2">{row.status}</td>
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSubtopicId(row.subtopicId);
                          setPosts({
                            facebook: row.facebook ?? "",
                            instagram: row.instagram ?? "",
                            twitter: row.twitter ?? "",
                            youtube: row.youtube ?? "",
                            linkedin: row.linkedin ?? "",
                          });
                          setSocialPostId(row.id);
                          setTab("generate");
                        }}
                        className="rounded bg-violet-50 px-2 py-1 text-xs text-violet-700"
                      >
                        Regenerate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "calendar" && (
        <div className="space-y-4">
          {history.length === 0 ? (
            <p className="text-sm text-gray-500">No scheduled posts yet.</p>
          ) : (
            history.map((row) => (
              <div
                key={row.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4"
              >
                <div>
                  <p className="font-medium">
                    <span dir="rtl" className="font-urdu">{row.subtopic.title}</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    Generated: {new Date(row.generatedAt).toLocaleDateString()} · {row.status}
                  </p>
                </div>
                {row.subtopic.published && row.status === "DRAFT" && (
                  <button
                    type="button"
                    onClick={() => markPosted(row.id)}
                    className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm text-white"
                  >
                    Publish Today
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
