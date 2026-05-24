import ChapterForm from "@/components/admin/ChapterForm";
import { prisma } from "@/lib/db/prisma";

export default async function NewChapterPage() {
  const courses = await prisma.course.findMany({
    orderBy: { title: "asc" },
    select: { id: true, title: true },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Add New Chapter</h1>
      <ChapterForm courses={courses} mode="create" />
    </div>
  );
}
