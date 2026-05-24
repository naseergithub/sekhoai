import TopicForm from "@/components/admin/TopicForm";
import { prisma } from "@/lib/db/prisma";

export default async function NewTopicPage() {
  const [courses, chapters] = await Promise.all([
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
      <h1 className="text-2xl font-bold text-gray-900">Add New Topic</h1>
      <TopicForm courses={courses} chapters={chapters} mode="create" />
    </div>
  );
}
