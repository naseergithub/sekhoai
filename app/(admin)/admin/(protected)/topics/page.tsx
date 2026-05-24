import Link from "next/link";
import { Suspense } from "react";
import TopicsTable from "@/components/admin/TopicsTable";
import { prisma } from "@/lib/db/prisma";

type PageProps = {
  searchParams: Promise<{ courseId?: string; chapterId?: string }>;
};

export default async function AdminTopicsPage({ searchParams }: PageProps) {
  const { courseId, chapterId } = await searchParams;

  const [topics, courses, chapters] = await Promise.all([
    prisma.topic.findMany({
      where: {
        ...(chapterId ? { chapterId } : {}),
        ...(courseId ? { chapter: { courseId } } : {}),
      },
      orderBy: [{ chapterId: "asc" }, { order: "asc" }],
      include: {
        chapter: {
          select: {
            title: true,
            course: { select: { title: true } },
          },
        },
        _count: { select: { subtopics: true } },
      },
    }),
    prisma.course.findMany({
      orderBy: { title: "asc" },
      select: { id: true, title: true },
    }),
    prisma.chapter.findMany({
      orderBy: { title: "asc" },
      select: { id: true, title: true, courseId: true },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Topics</h1>
        <Link
          href="/admin/topics/new"
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          Add New Topic
        </Link>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <TopicsTable topics={topics} courses={courses} chapters={chapters} />
      </Suspense>
    </div>
  );
}
