import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/guard";
import { chapterSchema } from "@/lib/admin/schemas";
import { resolveSlug, upsertChapterSeo } from "@/lib/admin/seo";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: Request) {
  const { error } = await requireAuth();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get("courseId");

  const chapters = await prisma.chapter.findMany({
    where: courseId ? { courseId } : undefined,
    orderBy: [{ courseId: "asc" }, { order: "asc" }],
    include: {
      course: { select: { id: true, title: true } },
      _count: { select: { topics: true } },
      seoMeta: true,
    },
  });

  return NextResponse.json(chapters);
}

export async function POST(request: Request) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const body = chapterSchema.parse(await request.json());
    const slug = resolveSlug(body.slug, body.titleEn, body.title);

    const existing = await prisma.chapter.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
    }

    const chapter = await prisma.chapter.create({
      data: {
        courseId: body.courseId,
        title: body.title,
        titleEn: body.titleEn,
        slug,
        description: body.description,
        order: body.order,
        published: body.published,
      },
      include: {
        course: { select: { id: true, title: true } },
        _count: { select: { topics: true } },
        seoMeta: true,
      },
    });

    await upsertChapterSeo(chapter.id, body.seo);

    const full = await prisma.chapter.findUnique({
      where: { id: chapter.id },
      include: {
        course: { select: { id: true, title: true } },
        _count: { select: { topics: true } },
        seoMeta: true,
      },
    });

    return NextResponse.json(full, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Invalid request" },
      { status: 400 },
    );
  }
}
