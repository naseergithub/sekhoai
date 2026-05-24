"use client";

import { useRouter, useSearchParams } from "next/navigation";
import RowActions from "@/components/admin/RowActions";
import { PublishBadge } from "@/components/admin/StatusBadge";

type Course = { id: string; title: string };
type Chapter = {
  id: string;
  title: string;
  slug: string;
  order: number;
  published: boolean;
  course: { title: string };
  _count: { topics: number };
};

export default function ChaptersTable({
  chapters,
  courses,
}: {
  chapters: Chapter[];
  courses: Course[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId") ?? "";

  return (
    <div className="space-y-4">
      <select
        value={courseId}
        onChange={(e) => {
          const params = new URLSearchParams();
          if (e.target.value) params.set("courseId", e.target.value);
          router.push(`/admin/chapters${params.toString() ? `?${params}` : ""}`);
        }}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
      >
        <option value="">All Courses</option>
        {courses.map((c) => (
          <option key={c.id} value={c.id}>{c.title}</option>
        ))}
      </select>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Title</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Course</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Order</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Topics</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {chapters.map((chapter) => (
              <tr key={chapter.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">
                  <span dir="rtl" className="font-urdu">{chapter.title}</span>
                </td>
                <td className="px-4 py-3">
                  <span dir="rtl" className="font-urdu">{chapter.course.title}</span>
                </td>
                <td className="px-4 py-3">{chapter.order}</td>
                <td className="px-4 py-3">{chapter._count.topics}</td>
                <td className="px-4 py-3"><PublishBadge published={chapter.published} /></td>
                <td className="px-4 py-3">
                  <RowActions
                    editHref={`/admin/chapters/${chapter.id}/edit`}
                    published={chapter.published}
                    onToggle={async () => {
                      const res = await fetch(`/api/admin/chapters/${chapter.id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ published: !chapter.published }),
                      });
                      if (!res.ok) throw new Error("Toggle failed");
                    }}
                    onDelete={async () => {
                      const res = await fetch(`/api/admin/chapters/${chapter.id}`, { method: "DELETE" });
                      if (!res.ok) throw new Error("Delete failed");
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
