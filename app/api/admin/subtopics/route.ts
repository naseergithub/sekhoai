import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/guard";
import { subtopicSchema } from "@/lib/admin/schemas";
import { resolveSlug, upsertSubtopicSeo } from "@/lib/admin/seo";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: Request) {
  const { error } = await requireAuth();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get("courseId");
  const chapterId = searchParams.get("chapterId");
  const topicId = searchParams.get("topicId");

  const subtopics = await prisma.subtopic.findMany({
    where: {
      ...(topicId ? { topicId } : {}),
      ...(chapterId ? { topic: { chapterId } } : {}),
      ...(courseId ? { topic: { chapter: { courseId } } } : {}),
    },
    orderBy: [{ topicId: "asc" }, { order: "asc" }],
    include: {
      topic: {
        select: {
          id: true,
          title: true,
          chapter: {
            select: {
              id: true,
              title: true,
              course: { select: { id: true, title: true } },
            },
          },
        },
      },
      seoMeta: true,
    },
  });

  return NextResponse.json(subtopics);
}

export async function POST(request: Request) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const body = subtopicSchema.parse(await request.json());
    const slug = resolveSlug(body.slug, body.titleEn, body.title);

    const existing = await prisma.subtopic.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
    }

    const subtopic = await prisma.subtopic.create({
      data: {
        topicId: body.topicId,
        title: body.title,
        titleEn: body.titleEn,
        slug,
        order: body.order,
        published: body.published,
        whatIsIt: body.whatIsIt,
        whyItMatters: body.whyItMatters,
        howItWorks: body.howItWorks,
        mathBehindIt: body.mathBehindIt,
        realWorldEx: body.realWorldEx,
        codeExample: body.codeExample,
        codeLanguage: body.codeLanguage ?? "python",
        applications: body.applications,
        hook: body.hook,
        analogy: body.analogy,
        commonMistakes: body.commonMistakes,
        comparison: body.comparison,
        quickSummary: body.quickSummary,
        quizData: body.quizData,
      },
      include: {
        topic: {
          select: {
            id: true,
            title: true,
            chapter: {
              select: {
                id: true,
                title: true,
                course: { select: { id: true, title: true } },
              },
            },
          },
        },
        seoMeta: true,
      },
    });

    await upsertSubtopicSeo(subtopic.id, body.seo);

    const full = await prisma.subtopic.findUnique({
      where: { id: subtopic.id },
      include: {
        topic: {
          select: {
            id: true,
            title: true,
            chapter: {
              select: {
                id: true,
                title: true,
                course: { select: { id: true, title: true } },
              },
            },
          },
        },
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
