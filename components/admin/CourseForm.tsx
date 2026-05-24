"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import SeoFields, { type SeoFormValues } from "@/components/admin/SeoFields";
import { generateSlugFromEnglish } from "@/lib/utils";

type CourseData = {
  id?: string;
  title: string;
  titleEn?: string | null;
  slug: string;
  description: string;
  thumbnail?: string | null;
  order: number;
  published: boolean;
  seoMeta?: SeoFormValues | null;
};

type CourseFormProps = {
  initial?: CourseData;
  mode: "create" | "edit";
};

export default function CourseForm({ initial, mode }: CourseFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState(initial?.title ?? "");
  const [titleEn, setTitleEn] = useState(initial?.titleEn ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugManual, setSlugManual] = useState(!!initial?.slug);
  const [description, setDescription] = useState(initial?.description ?? "");
  const [thumbnail, setThumbnail] = useState(initial?.thumbnail ?? "");
  const [order, setOrder] = useState(initial?.order ?? 0);
  const [published, setPublished] = useState(initial?.published ?? false);
  const [seo, setSeo] = useState<SeoFormValues>(initial?.seoMeta ?? {});

  const handleTitleEnChange = (value: string) => {
    setTitleEn(value);
    if (!slugManual && value) {
      setSlug(generateSlugFromEnglish(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      title,
      titleEn: titleEn || null,
      slug,
      description,
      thumbnail: thumbnail || null,
      order: Number(order),
      published,
      seo,
    };

    const url =
      mode === "create"
        ? "/api/admin/courses"
        : `/api/admin/courses/${initial?.id}`;
    const method = mode === "create" ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to save");
      setLoading(false);
      return;
    }

    router.push("/admin/courses");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium">Title (Urdu) *</label>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 font-urdu"
          dir="rtl"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Title (English)</label>
        <input
          value={titleEn}
          onChange={(e) => handleTitleEnChange(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Slug</label>
        <input
          value={slug}
          onChange={(e) => {
            setSlugManual(true);
            setSlug(e.target.value);
          }}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Description (Urdu) *</label>
        <textarea
          required
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 font-urdu"
          dir="rtl"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Thumbnail URL</label>
        <input
          type="url"
          value={thumbnail}
          onChange={(e) => setThumbnail(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium">Order</label>
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>
        <div className="flex items-end gap-2 pb-2">
          <input
            id="published"
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="h-4 w-4"
          />
          <label htmlFor="published" className="text-sm font-medium">
            Published
          </label>
        </div>
      </div>

      <SeoFields values={seo} onChange={setSeo} />

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Course"}
      </button>
    </form>
  );
}
