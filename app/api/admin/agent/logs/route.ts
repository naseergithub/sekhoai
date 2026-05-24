import { NextResponse } from "next/server";
import type { AgentStatus } from "@prisma/client";
import { requireAuth } from "@/lib/auth/guard";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: Request) {
  const { error } = await requireAuth();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? "20")));
  const statusParam = searchParams.get("status");

  const status =
    statusParam && ["SUCCESS", "FAILED", "PENDING"].includes(statusParam)
      ? (statusParam as AgentStatus)
      : undefined;

  const where = status ? { status } : {};

  const [logs, total] = await Promise.all([
    prisma.agentLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        subtopicId: true,
        model: true,
        status: true,
        errorMsg: true,
        createdAt: true,
      },
    }),
    prisma.agentLog.count({ where }),
  ]);

  const subtopicIds = logs
    .map((l) => l.subtopicId)
    .filter((id): id is string => Boolean(id));

  const subtopics =
    subtopicIds.length > 0
      ? await prisma.subtopic.findMany({
          where: { id: { in: subtopicIds } },
          select: { id: true, title: true, slug: true },
        })
      : [];

  const titleMap = Object.fromEntries(
    subtopics.map((s) => [s.id, { title: s.title, slug: s.slug }]),
  );

  const enriched = logs.map((log) => ({
    ...log,
    subtopicTitle: log.subtopicId ? titleMap[log.subtopicId]?.title ?? null : null,
    subtopicSlug: log.subtopicId ? titleMap[log.subtopicId]?.slug ?? null : null,
  }));

  return NextResponse.json({
    logs: enriched,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
