"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

type SubtopicRow = {
  id: string;
  title: string;
  slug: string;
  seoMeta: {
    id: string;
    metaTitle: string | null;
    metaDesc: string | null;
    keywords: string | null;
  } | null;
  faqData: string | null;
};

type SeoManagerPanelProps = {
  stats: {
    totalSubtopics: number;
    withSeo: number;
    missingSeo: number;
    withFaq: number;
    sitemapCount: number;
  };
  subtopics: SubtopicRow[];
};

type Tab = "overview" | "editor" | "technical";

export default function SeoManagerPanel({ stats, subtopics }: SeoManagerPanelProps) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [loading, setLoading] = useState(false);
  const [bulkProgress, setBulkProgress] = useState({ current: 0, total: 0 });
  const [filter, setFilter] = useState<"all" | "title" | "desc" | "keywords">("all");
  const [edits, setEdits] = useState<Record<string, { metaTitle: string; metaDesc: string }>>({});

  const missingList = subtopics.filter((s) => !s.seoMeta?.metaTitle?.trim());

  const filteredEditor = subtopics.filter((s) => {
    if (filter === "title") return !s.seoMeta?.metaTitle?.trim();
    if (filter === "desc") return !s.seoMeta?.metaDesc?.trim();
    if (filter === "keywords") return !s.seoMeta?.keywords?.trim();
    return true;
  });

  const generateOne = async (subtopicId: string) => {
    setLoading(true);
    const res = await fetch("/api/admin/seo/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subtopicId }),
    });
    setLoading(false);
    if (res.ok) router.refresh();
    else alert("SEO generation failed");
  };

  const generateAllMissing = async () => {
    const ids = missingList.map((s) => s.id);
    if (!ids.length) return;
    setLoading(true);
    setBulkProgress({ current: 0, total: ids.length });

    for (let i = 0; i < ids.length; i++) {
      await fetch("/api/admin/seo/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subtopicId: ids[i] }),
      });
      setBulkProgress({ current: i + 1, total: ids.length });
      if (i < ids.length - 1) await new Promise((r) => setTimeout(r, 2000));
    }

    setLoading(false);
    router.refresh();
  };

  const saveInline = async (seoMetaId: string, subtopicId: string) => {
    const data = edits[subtopicId];
    if (!data) return;
    await fetch(`/api/admin/seo/${seoMetaId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    router.refresh();
  };

  const pingGoogle = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/seo/ping-google", { method: "POST" });
    setLoading(false);
    const data = await res.json();
    alert(data.message ?? (res.ok ? "Done" : "Failed"));
  };

  const revalidateSitemap = async () => {
    const secret = prompt("Revalidate secret (from .env):");
    if (!secret) return;
    await fetch(`/api/revalidate?secret=${secret}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: "all", type: "subtopic" }),
    });
    router.refresh();
    alert("Sitemap revalidation triggered");
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "editor", label: "SEO Editor" },
    { id: "technical", label: "Sitemap & Technical" },
  ];

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

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
                : "border-transparent text-gray-500 hover:text-gray-700",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-4">
            {[
              { label: "Total Subtopics", value: stats.totalSubtopics },
              { label: "With SEO", value: stats.withSeo },
              { label: "Missing SEO", value: stats.missingSeo },
              { label: "With FAQ", value: stats.withFaq },
            ].map((card) => (
              <div key={card.label} className="rounded-xl border border-gray-200 bg-white p-4">
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-2xl font-bold">{card.value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">Missing SEO</h3>
              <button
                type="button"
                onClick={generateAllMissing}
                disabled={loading || missingList.length === 0}
                className="rounded-lg bg-violet-600 px-4 py-2 text-sm text-white disabled:opacity-50"
              >
                Generate All Missing SEO
              </button>
            </div>
            {bulkProgress.total > 0 && (
              <div className="mb-4">
                <p className="mb-1 text-sm text-gray-600">
                  {bulkProgress.current} / {bulkProgress.total}
                </p>
                <div className="h-2 rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-violet-600 transition-all"
                    style={{
                      width: `${(bulkProgress.current / bulkProgress.total) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}
            <ul className="space-y-2">
              {missingList.slice(0, 20).map((s) => (
                <li key={s.id} className="flex items-center justify-between border-b py-2">
                  <span dir="rtl" className="font-urdu">{s.title}</span>
                  <button
                    type="button"
                    onClick={() => generateOne(s.id)}
                    disabled={loading}
                    className="rounded bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700"
                  >
                    Generate SEO
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {tab === "editor" && (
        <div className="space-y-4">
          <div className="flex gap-2">
            {(["all", "title", "desc", "keywords"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded-lg px-3 py-1 text-sm",
                  filter === f ? "bg-emerald-100 text-emerald-800" : "bg-gray-100",
                )}
              >
                {f === "all" ? "All" : `Missing ${f}`}
              </button>
            ))}
          </div>
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left">Title</th>
                  <th className="px-3 py-2 text-left">Meta Title</th>
                  <th className="px-3 py-2 text-left">Meta Desc</th>
                  <th className="px-3 py-2 text-left">FAQ</th>
                  <th className="px-3 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEditor.map((s) => (
                  <tr key={s.id} className="border-t">
                    <td className="px-3 py-2">
                      <span dir="rtl" className="font-urdu">{s.title}</span>
                    </td>
                    <td className="px-3 py-2">
                      <input
                        className="w-full rounded border px-2 py-1 text-xs"
                        defaultValue={s.seoMeta?.metaTitle ?? ""}
                        onChange={(e) =>
                          setEdits((prev) => ({
                            ...prev,
                            [s.id]: {
                              metaTitle: e.target.value,
                              metaDesc: prev[s.id]?.metaDesc ?? s.seoMeta?.metaDesc ?? "",
                            },
                          }))
                        }
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        className="w-full rounded border px-2 py-1 text-xs"
                        defaultValue={s.seoMeta?.metaDesc ?? ""}
                        onChange={(e) =>
                          setEdits((prev) => ({
                            ...prev,
                            [s.id]: {
                              metaTitle: prev[s.id]?.metaTitle ?? s.seoMeta?.metaTitle ?? "",
                              metaDesc: e.target.value,
                            },
                          }))
                        }
                      />
                    </td>
                    <td className="px-3 py-2">{s.faqData ? "✓" : "—"}</td>
                    <td className="px-3 py-2">
                      <div className="flex flex-wrap gap-1">
                        <button
                          type="button"
                          onClick={() => generateOne(s.id)}
                          className="rounded bg-violet-50 px-2 py-1 text-xs text-violet-700"
                        >
                          AI
                        </button>
                        {s.seoMeta && (
                          <button
                            type="button"
                            onClick={() => saveInline(s.seoMeta!.id, s.id)}
                            className="rounded bg-blue-50 px-2 py-1 text-xs text-blue-700"
                          >
                            Save
                          </button>
                        )}
                        <a
                          href={`${siteUrl}/subtopic/${s.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded bg-gray-100 px-2 py-1 text-xs"
                        >
                          View
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "technical" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="mb-4 font-semibold">Sitemap</h3>
            <p className="mb-2 text-sm text-gray-600">
              Current URLs in sitemap: <strong>{stats.sitemapCount}</strong>
            </p>
            <p className="mb-4 text-sm">
              <a href="/sitemap.xml" target="_blank" className="text-emerald-600 hover:underline">
                /sitemap.xml
              </a>
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={revalidateSitemap}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
              >
                Regenerate Sitemap
              </button>
              <button
                type="button"
                onClick={pingGoogle}
                disabled={loading}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white disabled:opacity-50"
              >
                Notify Google
              </button>
            </div>
            <p className="mt-4 text-xs text-gray-500">
              <a
                href="https://search.google.com/search-console"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 hover:underline"
              >
                Google Search Console — Submit Sitemap
              </a>
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="mb-4 font-semibold">robots.txt preview</h3>
            <pre className="rounded bg-gray-900 p-4 text-xs text-gray-100">
{`User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${siteUrl}/sitemap.xml`}
            </pre>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="mb-4 font-semibold">Core Web Vitals checklist</h3>
            <ul className="space-y-2 text-sm">
              <li>✅ Images use next/image</li>
              <li>✅ Fonts preloaded</li>
              <li>✅ RTL direction set</li>
              <li>⚠️ Add canonical URLs (via SEO meta)</li>
              <li>✅ Add structured data (JSON-LD)</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
