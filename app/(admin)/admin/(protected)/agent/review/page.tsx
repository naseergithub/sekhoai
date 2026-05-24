import Link from "next/link";
import ReviewQueueTable from "@/components/admin/ReviewQueueTable";
import { prisma } from "@/lib/db/prisma";

export default async function AgentReviewPage() {
  const items = await prisma.subtopic.findMany({
    where: {
      aiGenerated: true,
      published: false,
    },
    orderBy: { aiGeneratedAt: "desc" },
    include: {
      topic: {
        select: {
          title: true,
          chapter: {
            select: {
              title: true,
              course: { select: { title: true } },
            },
          },
        },
      },
    },
  });

  const subtopicIds = items.map((i) => i.id);
  const recentLogs =
    subtopicIds.length > 0
      ? await prisma.agentLog.findMany({
          where: {
            subtopicId: { in: subtopicIds },
            status: "SUCCESS",
          },
          orderBy: { createdAt: "desc" },
          select: { subtopicId: true, warningMsg: true },
        })
      : [];

  const warningBySubtopicId = new Map<string, string>();
  for (const log of recentLogs) {
    if (log.subtopicId && log.warningMsg && !warningBySubtopicId.has(log.subtopicId)) {
      warningBySubtopicId.set(log.subtopicId, log.warningMsg);
    }
  }

  const itemsWithWarnings = items.map((item) => ({
    ...item,
    qualityWarning: warningBySubtopicId.get(item.id) ?? null,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Review Queue</h1>
          <p className="text-sm text-gray-500">
            Review AI-generated content before publishing
          </p>
        </div>
        <Link
          href="/admin/agent"
          className="text-sm font-medium text-violet-600 hover:underline"
        >
          ← AI Agent
        </Link>
      </div>

      <div className="rounded-lg border border-violet-200 bg-violet-50 px-4 py-3">
        <p className="text-sm font-medium text-violet-900">
          {items.length} subtopics awaiting review
        </p>
      </div>

      <ReviewQueueTable items={itemsWithWarnings} />
    </div>
  );
}
