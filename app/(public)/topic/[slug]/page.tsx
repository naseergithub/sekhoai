import { notFound } from "next/navigation";
import { FileText } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import TopicContentPreview from "@/components/topic/TopicContentPreview";
import TopicPageHero from "@/components/topic/TopicPageHero";
import TopicPrevNextNav from "@/components/topic/TopicPrevNextNav";
import TopicSubtopicCard from "@/components/topic/TopicSubtopicCard";
import { sidebarFromCourseTree, type SidebarTree } from "@/lib/sidebar";
import {
  getCourseSidebarTree,
  getPublishedTopicBySlug,
  getPublishedTopicsInChapter,
} from "@/lib/db/queries";
import { buildTopicMetadata } from "@/lib/seo/metadata";
import { estimateReadingTime, toUrduNumeral } from "@/lib/utils";

export const revalidate = 3600;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const topic = await getPublishedTopicBySlug(slug);
  if (!topic) return { title: "موضوع نہیں ملا" };
  return buildTopicMetadata(topic);
}

export default async function TopicPage({ params }: PageProps) {
  const { slug } = await params;
  const topic = await getPublishedTopicBySlug(slug);

  if (!topic) notFound();

  const { chapter } = topic;
  const subtopicCount = topic.subtopics.length;
  const readingTime = estimateReadingTime(Math.max(subtopicCount * 2, 1));
  const firstSubtopicSlug = topic.subtopics[0]?.slug ?? null;

  const [sidebarTree, siblingTopics] = await Promise.all([
    getCourseSidebarTree(chapter.courseId),
    getPublishedTopicsInChapter(chapter.id),
  ]);

  const currentIndex = siblingTopics.findIndex((t) => t.id === topic.id);
  const prevTopic = currentIndex > 0 ? siblingTopics[currentIndex - 1] : null;
  const nextTopic =
    currentIndex >= 0 && currentIndex < siblingTopics.length - 1
      ? siblingTopics[currentIndex + 1]
      : null;

  const sidebarProps = sidebarTree
    ? sidebarFromCourseTree(sidebarTree as SidebarTree)
    : null;

  return (
    <div className="-mx-4 w-[calc(100%+2rem)] sm:-mx-6 sm:w-[calc(100%+3rem)] lg:-mx-8 lg:w-[calc(100%+4rem)]">
      <TopicPageHero
        title={topic.title}
        topicOrder={topic.order}
        chapterTitle={chapter.title}
        chapterSlug={chapter.slug}
        courseTitle={chapter.course.title}
        courseSlug={chapter.course.slug}
        subtopicCount={subtopicCount}
        readingTime={readingTime}
        firstSubtopicSlug={firstSubtopicSlug}
      />

      <section className="bg-slate-50 py-10 dark:bg-slate-950 lg:py-12">
        <div className="container-public flex items-start gap-6 lg:gap-8">
          {sidebarProps && (
            <Sidebar
              {...sidebarProps}
              activeChapterSlug={chapter.slug}
              activeTopicSlug={topic.slug}
            />
          )}

          <main className="min-w-0 flex-1">
            <div className="mb-8">
              <p className="font-sans text-small font-medium text-blue-600 dark:text-blue-400">
                اس موضوع میں
              </p>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
                <h2 className="section-title-urdu text-2xl lg:text-3xl">
                  ذیلی موضوعات / سبق
                </h2>
                <span className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50 px-4 py-1.5 font-sans text-small font-medium text-blue-800 dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-200">
                  <FileText className="h-4 w-4" aria-hidden />
                  {toUrduNumeral(subtopicCount)} سبق
                </span>
              </div>
              <p className="body-urdu-comfort mt-3 max-w-2xl text-base">
                ہر سبق میں مکمل اردو وضاحت، مثالیں، اور Python کوڈ — ترتیب سے پڑھیں
                تاکہ تصورات واضح رہیں۔
              </p>
            </div>

            {topic.subtopics.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-600 dark:bg-card">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                  <FileText
                    className="h-8 w-8 text-slate-400 dark:text-slate-500"
                    aria-hidden
                  />
                </div>
                <p className="text-lg font-bold text-slate-700 dark:text-slate-200">
                  ابھی کوئی سبق دستیاب نہیں
                </p>
                <p className="mt-2 text-small text-slate-500 dark:text-text-muted">
                  جلد نئے سبق شامل کیے جائیں گے
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {topic.subtopics.map((subtopic) => (
                  <TopicSubtopicCard
                    key={subtopic.id}
                    title={subtopic.title}
                    slug={subtopic.slug}
                    order={subtopic.order}
                    published={subtopic.published}
                    aiGenerated={subtopic.aiGenerated}
                  />
                ))}
              </div>
            )}

            <TopicContentPreview />

            <TopicPrevNextNav
              prevTopic={
                prevTopic
                  ? { title: prevTopic.title, slug: prevTopic.slug }
                  : null
              }
              nextTopic={
                nextTopic
                  ? { title: nextTopic.title, slug: nextTopic.slug }
                  : null
              }
            />
          </main>
        </div>
      </section>
    </div>
  );
}
