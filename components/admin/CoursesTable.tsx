"use client";

import RowActions from "@/components/admin/RowActions";
import { PublishBadge } from "@/components/admin/StatusBadge";

type Course = {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  _count: { chapters: number };
};

export default function CoursesTable({ courses }: { courses: Course[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Title (Urdu)</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Slug</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Chapters</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {courses.map((course) => (
            <tr key={course.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium">
                <span dir="rtl" className="font-urdu">{course.title}</span>
              </td>
              <td className="px-4 py-3 font-mono text-xs text-gray-500">{course.slug}</td>
              <td className="px-4 py-3">{course._count.chapters}</td>
              <td className="px-4 py-3"><PublishBadge published={course.published} /></td>
              <td className="px-4 py-3">
                <RowActions
                  editHref={`/admin/courses/${course.id}/edit`}
                  published={course.published}
                  onToggle={async () => {
                    const res = await fetch(`/api/admin/courses/${course.id}`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ published: !course.published }),
                    });
                    if (!res.ok) throw new Error("Toggle failed");
                  }}
                  onDelete={async () => {
                    const res = await fetch(`/api/admin/courses/${course.id}`, { method: "DELETE" });
                    if (!res.ok) throw new Error("Delete failed");
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
