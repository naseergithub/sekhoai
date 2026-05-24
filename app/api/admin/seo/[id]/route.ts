import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/guard";
import { seoUpdateSchema } from "@/lib/admin/schemas";
import { prisma } from "@/lib/db/prisma";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id } = await params;

  try {
    const body = seoUpdateSchema.parse(await request.json());
    const record = await prisma.seoMeta.update({
      where: { id },
      data: {
        metaTitle: body.metaTitle?.trim() || null,
        metaDesc: body.metaDesc?.trim() || null,
        keywords: body.keywords?.trim() || null,
        ogImage: body.ogImage?.trim() || null,
        canonicalUrl: body.canonicalUrl?.trim() || null,
      },
      include: {
        course: { select: { title: true } },
        chapter: { select: { title: true } },
        topic: { select: { title: true } },
        subtopic: { select: { title: true } },
      },
    });
    return NextResponse.json(record);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Invalid request" },
      { status: 400 },
    );
  }
}
