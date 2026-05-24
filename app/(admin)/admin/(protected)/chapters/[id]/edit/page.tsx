import { notFound } from "next/navigation";
import ChapterForm from "@/components/admin/ChapterForm";
import { prisma } from "@/lib/db/prisma";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditChapterPage({ params }: PageProps) {
  const { id } = await params;
  const [chapter, courses] = await Promise.all([
    prisma.chapter.findUnique({
      where: { id },
      include: { seoMeta: true },
    }),
    prisma.course.findMany({
      orderBy: { title: "asc" },
      select: { id: true, title: true },
    }),
  ]);

  if (!chapter) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Edit Chapter</h1>
      <ChapterForm
        courses={courses}
        mode="edit"
        initial={{
          id: chapter.id,
          courseId: chapter.courseId,
          title: chapter.title,
          titleEn: chapter.titleEn,
          slug: chapter.slug,
          description: chapter.description,
          order: chapter.order,
          published: chapter.published,
          seoMeta: chapter.seoMeta,
        }}
      />
    </div>
  );
}
