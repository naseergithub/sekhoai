import { notFound } from "next/navigation";
import TopicForm from "@/components/admin/TopicForm";
import { prisma } from "@/lib/db/prisma";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditTopicPage({ params }: PageProps) {
  const { id } = await params;
  const [topic, courses, chapters] = await Promise.all([
    prisma.topic.findUnique({
      where: { id },
      include: {
        seoMeta: true,
        chapter: { select: { courseId: true } },
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

  if (!topic) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Edit Topic</h1>
      <TopicForm
        courses={courses}
        chapters={chapters}
        mode="edit"
        initial={{
          id: topic.id,
          courseId: topic.chapter.courseId,
          chapterId: topic.chapterId,
          title: topic.title,
          titleEn: topic.titleEn,
          slug: topic.slug,
          order: topic.order,
          published: topic.published,
          seoMeta: topic.seoMeta,
        }}
      />
    </div>
  );
}
