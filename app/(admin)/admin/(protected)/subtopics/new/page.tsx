import SubtopicForm from "@/components/admin/SubtopicForm";
import { prisma } from "@/lib/db/prisma";

export default async function NewSubtopicPage() {
  const [courses, chapters, topics] = await Promise.all([
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
      <h1 className="text-2xl font-bold text-gray-900">Add New Subtopic</h1>
      <SubtopicForm
        courses={courses}
        chapters={chapters}
        topics={topics}
        mode="create"
      />
    </div>
  );
}
