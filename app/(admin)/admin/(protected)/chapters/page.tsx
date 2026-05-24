import Link from "next/link";
import { Suspense } from "react";
import ChaptersTable from "@/components/admin/ChaptersTable";
import { prisma } from "@/lib/db/prisma";

type PageProps = { searchParams: Promise<{ courseId?: string }> };

export default async function AdminChaptersPage({ searchParams }: PageProps) {
  const { courseId } = await searchParams;

  const [chapters, courses] = await Promise.all([
    prisma.chapter.findMany({
      where: courseId ? { courseId } : undefined,
      orderBy: [{ courseId: "asc" }, { order: "asc" }],
      include: {
        course: { select: { title: true } },
        _count: { select: { topics: true } },
      },
    }),
    prisma.course.findMany({
      orderBy: { title: "asc" },
      select: { id: true, title: true },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Chapters</h1>
        <Link
          href="/admin/chapters/new"
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          Add New Chapter
        </Link>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <ChaptersTable chapters={chapters} courses={courses} />
      </Suspense>
    </div>
  );
}
