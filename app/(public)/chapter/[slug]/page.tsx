import { notFound } from "next/navigation";
import { FileText, Layers } from "lucide-react";
import ChapterNextBanner from "@/components/chapter/ChapterNextBanner";
import ChapterPageHero from "@/components/chapter/ChapterPageHero";
import ChapterTopicCard from "@/components/chapter/ChapterTopicCard";
import Sidebar from "@/components/layout/Sidebar";
import { sidebarFromCourseTree, type SidebarTree } from "@/lib/sidebar";
import {
  getCourseSidebarTree,
  getNextPublishedChapter,
  getPublishedChapterBySlug,
} from "@/lib/db/queries";
import { buildChapterMetadata } from "@/lib/seo/metadata";
import { estimateReadingTime, toUrduNumeral } from "@/lib/utils";

export const revalidate = 3600;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const chapter = await getPublishedChapterBySlug(slug);
  if (!chapter) return { title: "باب نہیں ملا" };
  return buildChapterMetadata(chapter);
}

export default async function ChapterPage({ params }: PageProps) {
  const { slug } = await params;
  const chapter = await getPublishedChapterBySlug(slug);

  if (!chapter) notFound();

  const [sidebarTree, nextChapter] = await Promise.all([
    getCourseSidebarTree(chapter.courseId),
    getNextPublishedChapter(chapter.courseId, chapter.order),
  ]);

  const topicCount = chapter.topics.length;
  const subtopicCount = chapter.topics.reduce(
    (sum, t) => sum + t._count.subtopics,
    0,
  );
  const readingTime = estimateReadingTime(
    Math.max(subtopicCount, topicCount, 1),
  );
  const firstTopicSlug = chapter.topics[0]?.slug ?? null;

  const sidebarProps = sidebarTree
    ? sidebarFromCourseTree(sidebarTree as SidebarTree)
    : null;

  return (
    <div className="-mx-4 w-[calc(100%+2rem)] sm:-mx-6 sm:w-[calc(100%+3rem)] lg:-mx-8 lg:w-[calc(100%+4rem)]">
      <ChapterPageHero
        chapterOrder={chapter.order}
        title={chapter.title}
        description={chapter.description}
        courseTitle={chapter.course.title}
        courseSlug={chapter.course.slug}
        topicCount={topicCount}
        subtopicCount={subtopicCount}
        readingTime={readingTime}
        firstTopicSlug={firstTopicSlug}
      />

      <section className="bg-slate-50 py-10 dark:bg-slate-950 lg:py-12">
        <div className="container-public flex items-start gap-6 lg:gap-8">
          {sidebarProps && (
            <Sidebar
              {...sidebarProps}
              activeChapterSlug={chapter.slug}
            />
          )}

          <main className="min-w-0 flex-1">
            <div className="mb-8">
              <p className="font-sans text-small font-medium uppercase tracking-wide text-blue-600 dark:text-blue-400">
                اس باب میں
              </p>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
                <h2 className="section-title-urdu text-2xl lg:text-3xl">
                  موضوعات کی فہرست
                </h2>
                <span className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50 px-4 py-1.5 font-sans text-small font-medium text-blue-800 dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-200">
                  <Layers className="h-4 w-4" aria-hidden />
                  {toUrduNumeral(topicCount)} موضوعات
                </span>
              </div>
              <p className="body-urdu-comfort mt-3 max-w-2xl text-base">
                ہر موضوع میں اردو وضاحت، مثالیں، اور Python کوڈ شامل ہے — ترتیب
                سے پڑھیں بہترین نتیجے کے لیے۔
              </p>
            </div>

            {chapter.topics.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-600 dark:bg-card">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                  <FileText
                    className="h-8 w-8 text-slate-400 dark:text-slate-500"
                    aria-hidden
                  />
                </div>
                <p className="text-lg font-bold text-slate-700 dark:text-slate-200">
                  ابھی کوئی موضوع دستیاب نہیں
                </p>
                <p className="mt-2 text-small text-slate-500 dark:text-text-muted">
                  جلد نئے موضوعات شامل کیے جائیں گے
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {chapter.topics.map((topic) => (
                  <ChapterTopicCard
                    key={topic.id}
                    title={topic.title}
                    slug={topic.slug}
                    order={topic.order}
                    subtopicCount={topic._count.subtopics}
                    subtopics={topic.subtopics}
                  />
                ))}
              </div>
            )}

            <ChapterNextBanner
              nextChapter={
                nextChapter
                  ? { title: nextChapter.title, slug: nextChapter.slug }
                  : null
              }
              courseSlug={chapter.course.slug}
            />
          </main>
        </div>
      </section>
    </div>
  );
}
