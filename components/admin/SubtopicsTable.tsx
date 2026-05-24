"use client";

import { useRouter, useSearchParams } from "next/navigation";
import RowActions from "@/components/admin/RowActions";
import { PublishBadge } from "@/components/admin/StatusBadge";

type Course = { id: string; title: string };
type Chapter = { id: string; title: string; courseId: string };
type Topic = { id: string; title: string; chapterId: string };
type Subtopic = {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  aiGenerated: boolean;
  topic: {
    title: string;
    chapter: { title: string; course: { title: string } };
  };
};

export default function SubtopicsTable({
  subtopics,
  courses,
  chapters,
  topics,
}: {
  subtopics: Subtopic[];
  courses: Course[];
  chapters: Chapter[];
  topics: Topic[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId") ?? "";
  const chapterId = searchParams.get("chapterId") ?? "";
  const topicId = searchParams.get("topicId") ?? "";

  const filteredChapters = courseId ? chapters.filter((c) => c.courseId === courseId) : chapters;
  const filteredTopics = chapterId ? topics.filter((t) => t.chapterId === chapterId) : topics;

  const updateFilters = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v) params.set(k, v);
      else params.delete(k);
    });
    router.push(`/admin/subtopics?${params}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <select
          value={courseId}
          onChange={(e) => updateFilters({ courseId: e.target.value, chapterId: "", topicId: "" })}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">All Courses</option>
          {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
        <select
          value={chapterId}
          onChange={(e) => updateFilters({ courseId, chapterId: e.target.value, topicId: "" })}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">All Chapters</option>
          {filteredChapters.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
        <select
          value={topicId}
          onChange={(e) => updateFilters({ courseId, chapterId, topicId: e.target.value })}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">All Topics</option>
          {filteredTopics.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Title</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Topic</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Chapter</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">AI?</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {subtopics.map((subtopic) => (
              <tr key={subtopic.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">
                  <span dir="rtl" className="font-urdu">{subtopic.title}</span>
                </td>
                <td className="px-4 py-3">
                  <span dir="rtl" className="font-urdu">{subtopic.topic.title}</span>
                </td>
                <td className="px-4 py-3">
                  <span dir="rtl" className="font-urdu">{subtopic.topic.chapter.title}</span>
                </td>
                <td className="px-4 py-3">
                  {subtopic.aiGenerated && (
                    <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700">
                      AI Generated
                    </span>
                  )}
                </td>
                <td className="px-4 py-3"><PublishBadge published={subtopic.published} /></td>
                <td className="px-4 py-3">
                  <RowActions
                    editHref={`/admin/subtopics/${subtopic.id}/edit`}
                    previewHref={`/admin/subtopics/${subtopic.id}/preview`}
                    published={subtopic.published}
                    onToggle={async () => {
                      const res = await fetch(`/api/admin/subtopics/${subtopic.id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ published: !subtopic.published }),
                      });
                      if (!res.ok) throw new Error("Toggle failed");
                    }}
                    onDelete={async () => {
                      const res = await fetch(`/api/admin/subtopics/${subtopic.id}`, { method: "DELETE" });
                      if (!res.ok) throw new Error("Delete failed");
                    }}
                    extra={
                      <button
                        type="button"
                        onClick={async () => {
                          const res = await fetch("/api/admin/agent/generate", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ subtopicId: subtopic.id }),
                          });
                          if (res.ok) alert("AI generation completed");
                          else alert("Failed");
                        }}
                        className="rounded bg-violet-50 px-2 py-1 text-xs font-medium text-violet-700 hover:bg-violet-100"
                      >
                        Run AI
                      </button>
                    }
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
