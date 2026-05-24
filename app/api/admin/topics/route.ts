import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/guard";
import { topicSchema } from "@/lib/admin/schemas";
import { resolveSlug, upsertTopicSeo } from "@/lib/admin/seo";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: Request) {
  const { error } = await requireAuth();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get("courseId");
  const chapterId = searchParams.get("chapterId");

  const topics = await prisma.topic.findMany({
    where: {
      ...(chapterId ? { chapterId } : {}),
      ...(courseId ? { chapter: { courseId } } : {}),
    },
    orderBy: [{ chapterId: "asc" }, { order: "asc" }],
    include: {
      chapter: {
        select: {
          id: true,
          title: true,
          course: { select: { id: true, title: true } },
        },
      },
      _count: { select: { subtopics: true } },
      seoMeta: true,
    },
  });

  return NextResponse.json(topics);
}

export async function POST(request: Request) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const body = topicSchema.parse(await request.json());
    const slug = resolveSlug(body.slug, body.titleEn, body.title);

    const existing = await prisma.topic.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
    }

    const topic = await prisma.topic.create({
      data: {
        chapterId: body.chapterId,
        title: body.title,
        titleEn: body.titleEn,
        slug,
        order: body.order,
        published: body.published,
      },
      include: {
        chapter: {
          select: {
            id: true,
            title: true,
            course: { select: { id: true, title: true } },
          },
        },
        _count: { select: { subtopics: true } },
        seoMeta: true,
      },
    });

    await upsertTopicSeo(topic.id, body.seo);

    const full = await prisma.topic.findUnique({
      where: { id: topic.id },
      include: {
        chapter: {
          select: {
            id: true,
            title: true,
            course: { select: { id: true, title: true } },
          },
        },
        _count: { select: { subtopics: true } },
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
