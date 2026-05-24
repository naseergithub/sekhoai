import { notFound } from "next/navigation";
import CourseDetailView from "@/components/courses/CourseDetailView";
import JsonLd from "@/components/seo/JsonLd";
import { getPublishedCourseBySlug } from "@/lib/db/queries";
import { buildCourseMetadata } from "@/lib/seo/metadata";
import { buildCourseSchema } from "@/lib/seo/structuredData";
import { prisma } from "@/lib/db/prisma";

export const revalidate = 3600;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const courses = await prisma.course.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const course = await getPublishedCourseBySlug(slug);
  if (!course) return { title: "کورس نہیں ملا" };
  return buildCourseMetadata(course);
}

export default async function CoursePage({ params }: PageProps) {
  const { slug } = await params;
  const course = await getPublishedCourseBySlug(slug);

  if (!course) notFound();

  const topicCount = course.chapters.reduce(
    (sum, ch) => sum + ch._count.topics,
    0,
  );

  const chapters = course.chapters.map((chapter) => ({
    id: chapter.id,
    title: chapter.title,
    description: chapter.description,
    slug: chapter.slug,
    order: chapter.order,
    topicCount: chapter._count.topics,
  }));

  const firstChapterSlug = course.chapters[0]?.slug ?? null;

  return (
    <>
      <JsonLd
        data={buildCourseSchema({
          title: course.title,
          description: course.description,
          chapters: course.chapters,
        })}
      />
      <CourseDetailView
        title={course.title}
        description={course.description}
        slug={course.slug}
        chapters={chapters}
        chapterCount={course.chapters.length}
        topicCount={topicCount}
        firstChapterSlug={firstChapterSlug}
      />
    </>
  );
}
