import Link from "next/link";
import { Suspense } from "react";
import CoursesTable from "@/components/admin/CoursesTable";
import { prisma } from "@/lib/db/prisma";

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { chapters: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
        <Link
          href="/admin/courses/new"
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          Add New Course
        </Link>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <CoursesTable courses={courses} />
      </Suspense>
    </div>
  );
}
