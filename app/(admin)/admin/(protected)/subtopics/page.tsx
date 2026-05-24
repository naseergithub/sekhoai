import Link from "next/link";
import { Suspense } from "react";
import SubtopicsTable from "@/components/admin/SubtopicsTable";
import { prisma } from "@/lib/db/prisma";

type PageProps = {
  searchParams: Promise<{ courseId?: string; chapterId?: string; topicId?: string }>;
};

export default async function AdminSubtopicsPage({ searchParams }: PageProps) {
  const { courseId, chapterId, topicId } = await searchParams;

  const [subtopics, courses, chapters, topics] = await Promise.all([
    prisma.subtopic.findMany({
      where: {
        ...(topicId ? { topicId } : {}),
        ...(chapterId ? { topic: { chapterId } } : {}),
        ...(courseId ? { topic: { chapter: { courseId } } } : {}),
      },
      orderBy: [{ topicId: "asc" }, { order: "asc" }],
      include: {
        topic: {
          select: {
            title: true,
            chapter: {
              select: {
                title: true,
                course: { select: { title: true } },
              },
            },
          },
        },
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
    prisma.topic.findMany({
      orderBy: { title: "asc" },
      select: { id: true, title: true, chapterId: true },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Subtopics</h1>
        <Link
          href="/admin/subtopics/new"
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          Add New Subtopic
        </Link>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <SubtopicsTable
          subtopics={subtopics}
          courses={courses}
          chapters={chapters}
          topics={topics}
        />
      </Suspense>
    </div>
  );
}
