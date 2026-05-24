import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth } from "@/lib/auth/guard";
import { prisma } from "@/lib/db/prisma";

const bulkSchema = z.object({
  ids: z.array(z.string()).min(1),
});

export async function POST(request: Request) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const { ids } = bulkSchema.parse(await request.json());

    const updated = await Promise.all(
      ids.map(async (id) => {
        const record = await prisma.seoMeta.findUnique({
          where: { id },
          include: {
            course: true,
            chapter: true,
            topic: true,
            subtopic: true,
          },
        });
        if (!record) return null;

        const title =
          record.course?.title ??
          record.chapter?.title ??
          record.topic?.title ??
          record.subtopic?.title ??
          "سیکھیں AI";

        return prisma.seoMeta.update({
          where: { id },
          data: {
            metaTitle: record.metaTitle ?? `${title} | سیکھیں AI`,
            metaDesc:
              record.metaDesc ??
              `${title} — اردو میں مصنوعی ذہانت سیکھیں`,
          },
        });
      }),
    );

    return NextResponse.json({
      success: true,
      count: updated.filter(Boolean).length,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Invalid request" },
      { status: 400 },
    );
  }
}
