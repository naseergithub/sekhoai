import AgentDashboard from "@/components/admin/AgentDashboard";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

function defaultSelection(
  courses: { id: string }[],
  chapters: { id: string; courseId: string }[],
  topics: { id: string; chapterId: string }[],
  subtopics: { id: string; topicId: string }[],
) {
  const courseId = courses[0]?.id ?? "";
  const chapterId =
    chapters.find((c) => c.courseId === courseId)?.id ?? "";
  const topicId = topics.find((t) => t.chapterId === chapterId)?.id ?? "";
  const subtopicId =
    subtopics.find((s) => s.topicId === topicId)?.id ?? "";
  return { courseId, chapterId, topicId, subtopicId };
}

export default async function AdminAgentPage() {
  const [courses, chapters, topics, subtopics] = await Promise.all([
    prisma.course.findMany({
      orderBy: { order: "asc" },
      select: { id: true, title: true },
    }),
    prisma.chapter.findMany({
      orderBy: { order: "asc" },
      select: { id: true, title: true, courseId: true },
    }),
    prisma.topic.findMany({
      orderBy: { order: "asc" },
      select: { id: true, title: true, chapterId: true },
    }),
    prisma.subtopic.findMany({
      orderBy: { order: "asc" },
      select: {
        id: true,
        title: true,
        slug: true,
        published: true,
        aiGenerated: true,
        topicId: true,
      },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Content Agent</h1>
        <p className="text-sm text-gray-500">
          Generate Urdu educational content with Gemini — review before publishing
        </p>
      </div>
      <AgentDashboard
        courses={courses}
        chapters={chapters}
        topics={topics}
        subtopics={subtopics}
        initialSelection={defaultSelection(
          courses,
          chapters,
          topics,
          subtopics,
        )}
      />
    </div>
  );
}
