import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/guard";
import { chapterSchema, publishSchema } from "@/lib/admin/schemas";
import { resolveSlug, upsertChapterSeo } from "@/lib/admin/seo";
import { triggerRevalidation } from "@/lib/seo/publish";
import { prisma } from "@/lib/db/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id } = await params;
  const chapter = await prisma.chapter.findUnique({
    where: { id },
    include: {
      course: { select: { id: true, title: true } },
      seoMeta: true,
      _count: { select: { topics: true } },
    },
  });

  if (!chapter) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(chapter);
}

export async function PUT(request: Request, { params }: Params) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id } = await params;

  try {
    const body = await request.json();

    if ("published" in body && Object.keys(body).length === 1) {
      const { published } = publishSchema.parse(body);
      const chapter = await prisma.chapter.update({
        where: { id },
        data: { published },
        include: {
          course: { select: { id: true, title: true } },
          seoMeta: true,
          _count: { select: { topics: true } },
        },
      });
      if (published) await triggerRevalidation("chapter", chapter.slug);
      return NextResponse.json(chapter);
    }

    const data = chapterSchema.parse(body);
    const slug = resolveSlug(data.slug, data.titleEn, data.title);

    const duplicate = await prisma.chapter.findFirst({
      where: { slug, NOT: { id } },
    });
    if (duplicate) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
    }

    await prisma.chapter.update({
      where: { id },
      data: {
        courseId: data.courseId,
        title: data.title,
        titleEn: data.titleEn,
        slug,
        description: data.description,
        order: data.order,
        published: data.published,
      },
    });

    await upsertChapterSeo(id, data.seo);

    const chapter = await prisma.chapter.findUnique({
      where: { id },
      include: {
        course: { select: { id: true, title: true } },
        seoMeta: true,
        _count: { select: { topics: true } },
      },
    });

    return NextResponse.json(chapter);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Invalid request" },
      { status: 400 },
    );
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id } = await params;
  await prisma.chapter.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
