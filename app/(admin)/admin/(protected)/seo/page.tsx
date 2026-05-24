import SeoManagerPanel from "@/components/admin/SeoManagerPanel";
import { prisma } from "@/lib/db/prisma";

export default async function AdminSeoPage() {
  const subtopics = await prisma.subtopic.findMany({
    orderBy: { title: "asc" },
    select: {
      id: true,
      title: true,
      slug: true,
      faqData: true,
      seoMeta: {
        select: {
          id: true,
          metaTitle: true,
          metaDesc: true,
          keywords: true,
        },
      },
    },
  });

  const [
    totalSubtopics,
    withSeo,
    withFaq,
    publishedCourses,
    publishedChapters,
    publishedTopics,
    publishedSubtopics,
  ] = await Promise.all([
    prisma.subtopic.count(),
    prisma.subtopic.count({
      where: { seoMeta: { metaTitle: { not: null } } },
    }),
    prisma.subtopic.count({
      where: { faqData: { not: null } },
    }),
    prisma.course.count({ where: { published: true } }),
    prisma.chapter.count({ where: { published: true } }),
    prisma.topic.count({ where: { published: true } }),
    prisma.subtopic.count({ where: { published: true } }),
  ]);

  const sitemapCount =
    2 +
    publishedCourses +
    publishedChapters +
    publishedTopics +
    publishedSubtopics;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">SEO Manager</h1>
      <SeoManagerPanel
        stats={{
          totalSubtopics,
          withSeo,
          missingSeo: totalSubtopics - withSeo,
          withFaq,
          sitemapCount,
        }}
        subtopics={subtopics}
      />
    </div>
  );
}
