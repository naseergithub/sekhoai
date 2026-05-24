import Link from "next/link";
import { AgentStatusBadge } from "@/components/admin/StatusBadge";
import { prisma } from "@/lib/db/prisma";

export default async function AdminDashboardPage() {
  const [
    courseTotal,
    coursePublished,
    chapterTotal,
    chapterPublished,
    topicTotal,
    topicPublished,
    subtopicTotal,
    subtopicPublished,
    reviewQueueCount,
    latestLog,
    recentLogs,
  ] = await Promise.all([
    prisma.course.count(),
    prisma.course.count({ where: { published: true } }),
    prisma.chapter.count(),
    prisma.chapter.count({ where: { published: true } }),
    prisma.topic.count(),
    prisma.topic.count({ where: { published: true } }),
    prisma.subtopic.count(),
    prisma.subtopic.count({ where: { published: true } }),
    prisma.subtopic.count({
      where: { aiGenerated: true, published: false },
    }),
    prisma.agentLog.findFirst({
      orderBy: { createdAt: "desc" },
    }),
    prisma.agentLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const stats = [
    {
      label: "Courses",
      total: courseTotal,
      published: coursePublished,
      draft: courseTotal - coursePublished,
    },
    {
      label: "Chapters",
      total: chapterTotal,
      published: chapterPublished,
      draft: chapterTotal - chapterPublished,
    },
    {
      label: "Topics",
      total: topicTotal,
      published: topicPublished,
      draft: topicTotal - topicPublished,
    },
    {
      label: "Subtopics",
      total: subtopicTotal,
      published: subtopicPublished,
      draft: subtopicTotal - subtopicPublished,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">{stat.total}</p>
            <p className="mt-1 text-xs text-gray-500">
              {stat.published} published / {stat.draft} draft
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-violet-200 bg-violet-50 p-6">
          <h2 className="mb-2 text-lg font-semibold text-violet-900">
            AI Review Queue
          </h2>
          <p className="mb-4 text-3xl font-bold text-violet-700">
            {reviewQueueCount}
          </p>
          <p className="mb-4 text-sm text-violet-800">
            AI-generated unpublished subtopics
          </p>
          <Link
            href="/admin/agent/review"
            className="inline-block rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
          >
            Review Now
          </Link>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Last Agent Run
          </h2>
          {!latestLog ? (
            <p className="text-sm text-gray-500">No agent runs yet.</p>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{latestLog.model}</span>
                <AgentStatusBadge status={latestLog.status} />
              </div>
              <p className="text-xs text-gray-500">
                {latestLog.createdAt.toLocaleString()}
              </p>
              {latestLog.errorMsg && (
                <p className="text-xs text-red-600">{latestLog.errorMsg}</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/courses/new"
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          Add Course
        </Link>
        <Link
          href="/admin/chapters/new"
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Add Chapter
        </Link>
        <Link
          href="/admin/agent"
          className="rounded-lg border border-violet-300 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700 hover:bg-violet-100"
        >
          Run AI Agent
        </Link>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">AI Activity</h2>
        {recentLogs.length === 0 ? (
          <p className="text-sm text-gray-500">No agent runs yet.</p>
        ) : (
          <ul className="space-y-3">
            {recentLogs.map((log) => (
              <li
                key={log.id}
                className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-800">
                    {log.model}
                  </p>
                  <p className="truncate text-xs text-gray-500">
                    {log.createdAt.toLocaleString()}
                  </p>
                </div>
                <AgentStatusBadge status={log.status} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
