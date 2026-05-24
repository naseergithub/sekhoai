import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/guard";
import { publishSchema, subtopicSchema } from "@/lib/admin/schemas";
import { resolveSlug, upsertSubtopicSeo } from "@/lib/admin/seo";
import { triggerRevalidation } from "@/lib/seo/publish";
import { prisma } from "@/lib/db/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id } = await params;
  const subtopic = await prisma.subtopic.findUnique({
    where: { id },
    include: {
      topic: {
        select: {
          id: true,
          title: true,
          chapterId: true,
          chapter: {
            select: {
              id: true,
              title: true,
              courseId: true,
              course: { select: { id: true, title: true } },
            },
          },
        },
      },
      seoMeta: true,
    },
  });

  if (!subtopic) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(subtopic);
}

export async function PUT(request: Request, { params }: Params) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id } = await params;

  try {
    const body = await request.json();

    if ("published" in body && Object.keys(body).length === 1) {
      const { published } = publishSchema.parse(body);
      const subtopic = await prisma.subtopic.update({
        where: { id },
        data: { published },
        select: { slug: true, published: true },
      });
      if (published) {
        await triggerRevalidation("subtopic", subtopic.slug);
      }
      const full = await prisma.subtopic.findUnique({
        where: { id },
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
      return NextResponse.json(full);
    }

    const data = subtopicSchema.parse(body);
    const slug = resolveSlug(data.slug, data.titleEn, data.title);

    const duplicate = await prisma.subtopic.findFirst({
      where: { slug, NOT: { id } },
    });
    if (duplicate) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
    }

    await prisma.subtopic.update({
      where: { id },
      data: {
        topicId: data.topicId,
        title: data.title,
        titleEn: data.titleEn,
        slug,
        order: data.order,
        published: data.published,
        whatIsIt: data.whatIsIt,
        whyItMatters: data.whyItMatters,
        howItWorks: data.howItWorks,
        mathBehindIt: data.mathBehindIt,
        realWorldEx: data.realWorldEx,
        codeExample: data.codeExample,
        codeLanguage: data.codeLanguage ?? "python",
        applications: data.applications,
        hook: data.hook,
        analogy: data.analogy,
        commonMistakes: data.commonMistakes,
        comparison: data.comparison,
        quickSummary: data.quickSummary,
        quizData: data.quizData,
      },
    });

    await upsertSubtopicSeo(id, data.seo);

    const subtopic = await prisma.subtopic.findUnique({
      where: { id },
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

    if (subtopic?.published) {
      await triggerRevalidation("subtopic", subtopic.slug);
    }

    return NextResponse.json(subtopic);
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
  await prisma.subtopic.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
