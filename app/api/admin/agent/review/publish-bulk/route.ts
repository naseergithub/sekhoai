import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth } from "@/lib/auth/guard";
import { triggerRevalidation } from "@/lib/seo/publish";
import { prisma } from "@/lib/db/prisma";

const bulkPublishSchema = z.object({
  subtopicIds: z.array(z.string().min(1)).min(1),
});

export async function POST(request: Request) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const { subtopicIds } = bulkPublishSchema.parse(await request.json());

    const subtopics = await prisma.subtopic.findMany({
      where: { id: { in: subtopicIds }, aiGenerated: true },
      select: { id: true, slug: true },
    });

    await prisma.subtopic.updateMany({
      where: { id: { in: subtopics.map((s) => s.id) } },
      data: { published: true },
    });

    for (const s of subtopics) {
      await triggerRevalidation("subtopic", s.slug);
    }

    return NextResponse.json({
      success: true,
      published: subtopics.length,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Invalid request" },
      { status: 400 },
    );
  }
}
