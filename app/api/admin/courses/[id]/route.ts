import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/guard";
import { courseSchema, publishSchema } from "@/lib/admin/schemas";
import { resolveSlug, upsertCourseSeo } from "@/lib/admin/seo";
import { triggerRevalidation } from "@/lib/seo/publish";
import { prisma } from "@/lib/db/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id } = await params;
  const course = await prisma.course.findUnique({
    where: { id },
    include: { seoMeta: true, _count: { select: { chapters: true } } },
  });

  if (!course) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(course);
}

export async function PUT(request: Request, { params }: Params) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id } = await params;

  try {
    const body = await request.json();

    if ("published" in body && Object.keys(body).length === 1) {
      const { published } = publishSchema.parse(body);
      const course = await prisma.course.update({
        where: { id },
        data: { published },
        include: { seoMeta: true, _count: { select: { chapters: true } } },
      });
      if (published) await triggerRevalidation("course", course.slug);
      return NextResponse.json(course);
    }

    const data = courseSchema.parse(body);
    const slug = resolveSlug(data.slug, data.titleEn, data.title);

    const duplicate = await prisma.course.findFirst({
      where: { slug, NOT: { id } },
    });
    if (duplicate) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
    }

    await prisma.course.update({
      where: { id },
      data: {
        title: data.title,
        titleEn: data.titleEn,
        slug,
        description: data.description,
        thumbnail: data.thumbnail,
        order: data.order,
        published: data.published,
      },
    });

    await upsertCourseSeo(id, data.seo);

    const course = await prisma.course.findUnique({
      where: { id },
      include: { seoMeta: true, _count: { select: { chapters: true } } },
    });

    return NextResponse.json(course);
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
  await prisma.course.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
