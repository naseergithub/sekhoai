"use client";

import { useRouter, useSearchParams } from "next/navigation";
import RowActions from "@/components/admin/RowActions";
import { PublishBadge } from "@/components/admin/StatusBadge";

type Course = { id: string; title: string };
type Chapter = { id: string; title: string; courseId: string };
type Topic = {
  id: string;
  title: string;
  slug: string;
  order: number;
  published: boolean;
  chapter: { title: string; course: { title: string } };
  _count: { subtopics: number };
};

export default function TopicsTable({
  topics,
  courses,
  chapters,
}: {
  topics: Topic[];
  courses: Course[];
  chapters: Chapter[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId") ?? "";
  const chapterId = searchParams.get("chapterId") ?? "";

  const filteredChapters = courseId
    ? chapters.filter((c) => c.courseId === courseId)
    : chapters;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <select
          value={courseId}
          onChange={(e) => {
            const params = new URLSearchParams();
            if (e.target.value) params.set("courseId", e.target.value);
            router.push(`/admin/topics${params.toString() ? `?${params}` : ""}`);
          }}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">All Courses</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
        <select
          value={chapterId}
          onChange={(e) => {
            const params = new URLSearchParams();
            if (courseId) params.set("courseId", courseId);
            if (e.target.value) params.set("chapterId", e.target.value);
            router.push(`/admin/topics?${params}`);
          }}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">All Chapters</option>
          {filteredChapters.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Title</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Chapter</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Course</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Order</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Subtopics</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {topics.map((topic) => (
              <tr key={topic.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">
                  <span dir="rtl" className="font-urdu">{topic.title}</span>
                </td>
                <td className="px-4 py-3">
                  <span dir="rtl" className="font-urdu">{topic.chapter.title}</span>
                </td>
                <td className="px-4 py-3">
                  <span dir="rtl" className="font-urdu">{topic.chapter.course.title}</span>
                </td>
                <td className="px-4 py-3">{topic.order}</td>
                <td className="px-4 py-3">{topic._count.subtopics}</td>
                <td className="px-4 py-3"><PublishBadge published={topic.published} /></td>
                <td className="px-4 py-3">
                  <RowActions
                    editHref={`/admin/topics/${topic.id}/edit`}
                    published={topic.published}
                    onToggle={async () => {
                      const res = await fetch(`/api/admin/topics/${topic.id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ published: !topic.published }),
                      });
                      if (!res.ok) throw new Error("Toggle failed");
                    }}
                    onDelete={async () => {
                      const res = await fetch(`/api/admin/topics/${topic.id}`, { method: "DELETE" });
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
