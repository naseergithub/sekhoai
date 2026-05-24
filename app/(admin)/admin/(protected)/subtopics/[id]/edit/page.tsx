import { notFound } from "next/navigation";
import { Eye } from "lucide-react";
import PipelineButton from "@/components/admin/PipelineButton";
import SubtopicAiGenerateButton from "@/components/admin/SubtopicAiGenerateButton";
import SubtopicForm from "@/components/admin/SubtopicForm";
import { prisma } from "@/lib/db/prisma";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditSubtopicPage({ params }: PageProps) {
  const { id } = await params;
  const [subtopic, courses, chapters, topics] = await Promise.all([
    prisma.subtopic.findUnique({
      where: { id },
      include: {
        seoMeta: true,
        topic: {
          select: {
            chapterId: true,
            chapter: { select: { courseId: true } },
          },
        },
      },
    }),
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

  if (!subtopic) notFound();

  const hasExistingContent = Boolean(
    subtopic.whatIsIt ||
      subtopic.whyItMatters ||
      subtopic.howItWorks ||
      subtopic.mathBehindIt ||
      subtopic.realWorldEx ||
      subtopic.codeExample ||
      subtopic.applications ||
      subtopic.hook ||
      subtopic.analogy ||
      subtopic.commonMistakes ||
      subtopic.comparison ||
      subtopic.quickSummary ||
      subtopic.quizData,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Edit Subtopic</h1>
        <a
          href={`/admin/subtopics/${subtopic.id}/preview`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <Eye className="h-4 w-4" aria-hidden />
          Preview
        </a>
      </div>
      <div className="space-y-4">
        <SubtopicAiGenerateButton
          subtopicId={subtopic.id}
          hasExistingContent={hasExistingContent}
          aiGenerated={subtopic.aiGenerated}
        />
        <PipelineButton subtopicId={subtopic.id} />
      </div>
      <SubtopicForm
        courses={courses}
        chapters={chapters}
        topics={topics}
        mode="edit"
        initial={{
          id: subtopic.id,
          courseId: subtopic.topic.chapter.courseId,
          chapterId: subtopic.topic.chapterId,
          topicId: subtopic.topicId,
          title: subtopic.title,
          titleEn: subtopic.titleEn,
          slug: subtopic.slug,
          order: subtopic.order,
          published: subtopic.published,
          whatIsIt: subtopic.whatIsIt,
          whyItMatters: subtopic.whyItMatters,
          howItWorks: subtopic.howItWorks,
          mathBehindIt: subtopic.mathBehindIt,
          realWorldEx: subtopic.realWorldEx,
          codeExample: subtopic.codeExample,
          codeLanguage: subtopic.codeLanguage,
          applications: subtopic.applications,
          hook: subtopic.hook,
          analogy: subtopic.analogy,
          commonMistakes: subtopic.commonMistakes,
          comparison: subtopic.comparison,
          quickSummary: subtopic.quickSummary,
          quizData: subtopic.quizData,
          seoMeta: subtopic.seoMeta,
        }}
      />
    </div>
  );
}
