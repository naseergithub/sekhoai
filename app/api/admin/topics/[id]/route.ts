import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/guard";
import { publishSchema, topicSchema } from "@/lib/admin/schemas";
import { resolveSlug, upsertTopicSeo } from "@/lib/admin/seo";
import { triggerRevalidation } from "@/lib/seo/publish";
import { prisma } from "@/lib/db/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id } = await params;
  const topic = await prisma.topic.findUnique({
    where: { id },
    include: {
      chapter: {
        select: {
          id: true,
          title: true,
          courseId: true,
          course: { select: { id: true, title: true } },
        },
      },
      seoMeta: true,
      _count: { select: { subtopics: true } },
    },
  });

  if (!topic) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(topic);
}

export async function PUT(request: Request, { params }: Params) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id } = await params;

  try {
    const body = await request.json();

    if ("published" in body && Object.keys(body).length === 1) {
      const { published } = publishSchema.parse(body);
      const topic = await prisma.topic.update({
        where: { id },
        data: { published },
        include: {
          chapter: {
            select: {
              id: true,
              title: true,
              course: { select: { id: true, title: true } },
            },
          },
          seoMeta: true,
          _count: { select: { subtopics: true } },
        },
      });
      if (published) await triggerRevalidation("topic", topic.slug);
      return NextResponse.json(topic);
    }

    const data = topicSchema.parse(body);
    const slug = resolveSlug(data.slug, data.titleEn, data.title);

    const duplicate = await prisma.topic.findFirst({
      where: { slug, NOT: { id } },
    });
    if (duplicate) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
    }

    await prisma.topic.update({
      where: { id },
      data: {
        chapterId: data.chapterId,
        title: data.title,
        titleEn: data.titleEn,
        slug,
        order: data.order,
        published: data.published,
      },
    });

    await upsertTopicSeo(id, data.seo);

    const topic = await prisma.topic.findUnique({
      where: { id },
      include: {
        chapter: {
          select: {
            id: true,
            title: true,
            course: { select: { id: true, title: true } },
          },
        },
        seoMeta: true,
        _count: { select: { subtopics: true } },
      },
    });

    return NextResponse.json(topic);
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
  await prisma.topic.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
