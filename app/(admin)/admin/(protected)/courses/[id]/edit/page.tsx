import { notFound } from "next/navigation";
import CourseForm from "@/components/admin/CourseForm";
import { prisma } from "@/lib/db/prisma";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditCoursePage({ params }: PageProps) {
  const { id } = await params;
  const course = await prisma.course.findUnique({
    where: { id },
    include: { seoMeta: true },
  });

  if (!course) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Edit Course</h1>
      <CourseForm
        mode="edit"
        initial={{
          id: course.id,
          title: course.title,
          titleEn: course.titleEn,
          slug: course.slug,
          description: course.description,
          thumbnail: course.thumbnail,
          order: course.order,
          published: course.published,
          seoMeta: course.seoMeta,
        }}
      />
    </div>
  );
}
