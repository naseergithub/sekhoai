import { notFound } from "next/navigation";
import SubtopicContent from "@/components/course/SubtopicContent";
import LessonProgressCard from "@/components/subtopic/LessonProgressCard";
import ReadingProgressBar from "@/components/subtopic/ReadingProgressBar";
import RelatedSubtopics from "@/components/subtopic/RelatedSubtopics";
import SubtopicBottomNav from "@/components/subtopic/SubtopicBottomNav";
import SubtopicLessonNav from "@/components/subtopic/SubtopicLessonNav";
import SubtopicFaqSection from "@/components/subtopic/SubtopicFaqSection";
import SubtopicPageHero from "@/components/subtopic/SubtopicPageHero";
import SubtopicReadingShell from "@/components/subtopic/SubtopicReadingShell";
import JsonLd from "@/components/seo/JsonLd";
import { buildTocSections } from "@/lib/subtopic-content";
import {
  getCourseSidebarTree,
  getPublishedSubtopicBySlug,
  getRelatedSubtopics,
  getSubtopicLessonNavigation,
} from "@/lib/db/queries";
import { formatSubtopicReadingTimeUrdu } from "@/lib/seo/readingTime";
import { buildSubtopicMetadata } from "@/lib/seo/metadata";
import { getSiteUrl } from "@/lib/seo/site";
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildQuizSchema,
  parseFaqData,
} from "@/lib/seo/structuredData";
import { sidebarFromCourseTree, type SidebarTree } from "@/lib/sidebar";
import { prisma } from "@/lib/db/prisma";
import { parseQuizData, type SubtopicWithRelations } from "@/types";

export const revalidate = 3600;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const subtopics = await prisma.subtopic.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return subtopics.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const subtopic = await getPublishedSubtopicBySlug(slug);
  if (!subtopic) return { title: "ذیلی موضوع نہیں ملا" };
  return buildSubtopicMetadata(subtopic);
}

export default async function SubtopicPage({ params }: PageProps) {
  const { slug } = await params;
  const subtopic = await getPublishedSubtopicBySlug(slug);

  if (!subtopic) notFound();

  const { topic } = subtopic;
  const { chapter } = topic;
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/subtopic/${subtopic.slug}`;

  const [sidebarTree, related, lessonNav] = await Promise.all([
    getCourseSidebarTree(chapter.courseId),
    getRelatedSubtopics(topic.id, subtopic.id),
    getSubtopicLessonNavigation(subtopic.id, topic.id, chapter.id),
  ]);

  const faqs = parseFaqData(subtopic.faqData);
  const quizQuestions = parseQuizData(subtopic.quizData);
  const tocSections = buildTocSections(subtopic, faqs.length > 0);

  const { prev: prevSubtopic, next: nextSubtopic, siblingIndex, siblingTotal } =
    lessonNav;

  const readingTimeLabel = formatSubtopicReadingTimeUrdu(
    [
      subtopic.hook,
      subtopic.whatIsIt,
      subtopic.whyItMatters,
      subtopic.analogy,
      subtopic.howItWorks,
      subtopic.mathBehindIt,
      subtopic.realWorldEx,
      subtopic.codeExample,
      subtopic.commonMistakes,
      subtopic.comparison,
      subtopic.applications,
      subtopic.quickSummary,
    ],
    quizQuestions.length > 0,
  );

  const publishedDate = new Date(subtopic.createdAt).toLocaleDateString(
    "ur-PK",
    { year: "numeric", month: "long", day: "numeric" },
  );

  const breadcrumbItems = [
    { name: "گھر", url: siteUrl },
    { name: "کورسز", url: `${siteUrl}/courses` },
    { name: chapter.course.title, url: `${siteUrl}/courses/${chapter.course.slug}` },
    { name: chapter.title, url: `${siteUrl}/chapter/${chapter.slug}` },
    { name: topic.title, url: `${siteUrl}/topic/${topic.slug}` },
    { name: subtopic.title, url: pageUrl },
  ];

  const jsonLdSchemas = [
    buildArticleSchema(subtopic),
    buildBreadcrumbSchema(breadcrumbItems),
    ...(faqs.length > 0 ? [buildFaqSchema(faqs)] : []),
    ...(quizQuestions.length > 0
      ? [buildQuizSchema(subtopic.title, quizQuestions)]
      : []),
  ];

  const sidebarProps = sidebarTree
    ? sidebarFromCourseTree(sidebarTree as SidebarTree)
    : null;

  if (!sidebarProps) notFound();

  return (
    <>
      <JsonLd data={jsonLdSchemas} />
      <div className="-mx-4 w-[calc(100%+2rem)] sm:-mx-6 sm:w-[calc(100%+3rem)] lg:-mx-8 lg:w-[calc(100%+4rem)]">
        <ReadingProgressBar />

        <SubtopicPageHero
          title={subtopic.title}
          topicTitle={topic.title}
          topicSlug={topic.slug}
          chapterTitle={chapter.title}
          chapterSlug={chapter.slug}
          courseTitle={chapter.course.title}
          courseSlug={chapter.course.slug}
          aiGenerated={subtopic.aiGenerated}
          readingTimeLabel={readingTimeLabel}
          publishedDate={publishedDate}
          pageUrl={pageUrl}
          lessonIndex={siblingIndex}
          lessonTotal={siblingTotal}
        />

        <SubtopicReadingShell
          sidebarProps={{
            ...sidebarProps,
            activeChapterSlug: chapter.slug,
            activeTopicSlug: topic.slug,
            activeSubtopicSlug: subtopic.slug,
          }}
          tocSections={tocSections}
          shareTitle={subtopic.title}
          pageUrl={pageUrl}
        >
          <LessonProgressCard
            currentIndex={siblingIndex}
            total={siblingTotal}
            topicTitle={topic.title}
          />

          <SubtopicLessonNav
            prev={prevSubtopic}
            next={nextSubtopic}
            siblingIndex={siblingIndex}
            siblingTotal={siblingTotal}
            topicSlug={topic.slug}
            variant="compact"
            className="mb-8"
          />

          <SubtopicContent subtopic={subtopic as SubtopicWithRelations} />

          {faqs.length > 0 && (
            <div className="mt-8">
              <SubtopicFaqSection faqs={faqs} />
            </div>
          )}

          <SubtopicBottomNav
            prev={prevSubtopic}
            next={nextSubtopic}
            siblingIndex={siblingIndex}
            siblingTotal={siblingTotal}
            topicSlug={topic.slug}
          />

          <RelatedSubtopics items={related} />
        </SubtopicReadingShell>
      </div>
    </>
  );
}
