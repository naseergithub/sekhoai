import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/guard";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  const records = await prisma.seoMeta.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      course: { select: { title: true } },
      chapter: { select: { title: true } },
      topic: { select: { title: true } },
      subtopic: { select: { title: true } },
    },
  });

  return NextResponse.json(records);
}
