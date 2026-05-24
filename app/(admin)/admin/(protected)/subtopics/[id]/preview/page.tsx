import { notFound } from "next/navigation";
import SubtopicPreviewShell from "@/components/admin/subtopic-preview/SubtopicPreviewShell";
import { prisma } from "@/lib/db/prisma";
import type { SubtopicNavItem } from "@/lib/db/queries";
import { formatReadingTimeUrduFromTexts } from "@/lib/seo/readingTime";
import { parseFaqData } from "@/lib/seo/structuredData";
import type { SubtopicWithRelations } from "@/types";

type PageProps = { params: Promise<{ id: string }> };

export default async function SubtopicPreviewPage({ params }: PageProps) {
  const { id } = await params;

  const subtopic = await prisma.subtopic.findUnique({
    where: { id },
    include: {
      seoMeta: true,
      topic: {
        include: {
          chapter: {
            include: {
              course: true,
            },
          },
        },
      },
    },
  });

  if (!subtopic) notFound();

  const siblings = await prisma.subtopic.findMany({
    where: { topicId: subtopic.topicId },
    orderBy: { order: "asc" },
    select: { id: true, title: true, slug: true },
  });

  const currentIndex = siblings.findIndex((s) => s.id === subtopic.id);
  const siblingIndex = currentIndex >= 0 ? currentIndex : 0;
  const siblingTotal = siblings.length || 1;

  let prev: SubtopicNavItem | null = null;
  let next: SubtopicNavItem | null = null;

  if (currentIndex > 0) {
    const s = siblings[currentIndex - 1];
    prev = { title: s.title, slug: s.slug };
  }
  if (currentIndex >= 0 && currentIndex < siblings.length - 1) {
    const s = siblings[currentIndex + 1];
    next = { title: s.title, slug: s.slug };
  }

  const related = await prisma.subtopic.findMany({
    where: {
      topicId: subtopic.topicId,
      NOT: { id: subtopic.id },
    },
    orderBy: { order: "asc" },
    take: 3,
    select: { title: true, slug: true },
  });

  const faqs = parseFaqData(subtopic.faqData);

  const readingTimeLabel = formatReadingTimeUrduFromTexts([
    subtopic.whatIsIt,
    subtopic.whyItMatters,
    subtopic.howItWorks,
    subtopic.mathBehindIt,
    subtopic.realWorldEx,
    subtopic.codeExample,
    subtopic.applications,
  ]);

  const publishedDate = new Date(subtopic.createdAt).toLocaleDateString(
    "ur-PK",
    { year: "numeric", month: "long", day: "numeric" },
  );

  return (
    <SubtopicPreviewShell
      subtopic={subtopic as SubtopicWithRelations}
      faqs={faqs}
      related={related}
      prev={prev}
      next={next}
      siblingIndex={siblingIndex}
      siblingTotal={siblingTotal}
      readingTimeLabel={readingTimeLabel}
      publishedDate={publishedDate}
      breadcrumb={{
        courseTitle: subtopic.topic.chapter.course.title,
        chapterTitle: subtopic.topic.chapter.title,
        topicTitle: subtopic.topic.title,
      }}
    />
  );
}
