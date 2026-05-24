"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SeoFields, { type SeoFormValues } from "@/components/admin/SeoFields";
import { generateSlugFromEnglish } from "@/lib/utils";

type Course = { id: string; title: string };
type Chapter = { id: string; title: string; courseId: string };

type TopicData = {
  id?: string;
  chapterId: string;
  title: string;
  titleEn?: string | null;
  slug: string;
  order: number;
  published: boolean;
  seoMeta?: SeoFormValues | null;
};

type TopicFormProps = {
  courses: Course[];
  chapters: Chapter[];
  initial?: TopicData & { courseId?: string };
  mode: "create" | "edit";
};

export default function TopicForm({ courses, chapters, initial, mode }: TopicFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const initialChapter = chapters.find((c) => c.id === initial?.chapterId);
  const [courseId, setCourseId] = useState(initial?.courseId ?? initialChapter?.courseId ?? courses[0]?.id ?? "");
  const [chapterId, setChapterId] = useState(initial?.chapterId ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [titleEn, setTitleEn] = useState(initial?.titleEn ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugManual, setSlugManual] = useState(!!initial?.slug);
  const [order, setOrder] = useState(initial?.order ?? 0);
  const [published, setPublished] = useState(initial?.published ?? false);
  const [seo, setSeo] = useState<SeoFormValues>(initial?.seoMeta ?? {});

  const filteredChapters = chapters.filter((c) => c.courseId === courseId);

  useEffect(() => {
    if (!filteredChapters.find((c) => c.id === chapterId)) {
      setChapterId(filteredChapters[0]?.id ?? "");
    }
  }, [courseId, filteredChapters, chapterId]);

  const handleTitleEnChange = (value: string) => {
    setTitleEn(value);
    if (!slugManual && value) setSlug(generateSlugFromEnglish(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch(
      mode === "create" ? "/api/admin/topics" : `/api/admin/topics/${initial?.id}`,
      {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chapterId,
          title,
          titleEn: titleEn || null,
          slug,
          order: Number(order),
          published,
          seo,
        }),
      },
    );

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to save");
      setLoading(false);
      return;
    }

    router.push("/admin/topics");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6">
      {error && <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div>
        <label className="mb-1 block text-sm font-medium">Course *</label>
        <select value={courseId} onChange={(e) => setCourseId(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2">
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Chapter *</label>
        <select required value={chapterId} onChange={(e) => setChapterId(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2">
          {filteredChapters.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Title (Urdu) *</label>
        <input required value={title} onChange={(e) => setTitle(e.target.value)} dir="rtl" className="w-full rounded-lg border border-gray-300 px-3 py-2 font-urdu" />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Title (English)</label>
        <input value={titleEn} onChange={(e) => handleTitleEnChange(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2" />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Slug</label>
        <input value={slug} onChange={(e) => { setSlugManual(true); setSlug(e.target.value); }} className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm" />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium">Order</label>
          <input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} className="w-full rounded-lg border border-gray-300 px-3 py-2" />
        </div>
        <div className="flex items-end gap-2 pb-2">
          <input id="published" type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="h-4 w-4" />
          <label htmlFor="published" className="text-sm font-medium">Published</label>
        </div>
      </div>

      <SeoFields values={seo} onChange={setSeo} />

      <button type="submit" disabled={loading} className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50">
        {loading ? "Saving..." : "Save Topic"}
      </button>
    </form>
  );
}
