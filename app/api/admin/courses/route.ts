import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/guard";
import { courseSchema } from "@/lib/admin/schemas";
import { resolveSlug, upsertCourseSeo } from "@/lib/admin/seo";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  const courses = await prisma.course.findMany({
    orderBy: { order: "asc" },
    include: {
      _count: { select: { chapters: true } },
      seoMeta: true,
    },
  });

  return NextResponse.json(courses);
}

export async function POST(request: Request) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const body = courseSchema.parse(await request.json());
    const slug = resolveSlug(body.slug, body.titleEn, body.title);

    const existing = await prisma.course.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
    }

    const course = await prisma.course.create({
      data: {
        title: body.title,
        titleEn: body.titleEn,
        slug,
        description: body.description,
        thumbnail: body.thumbnail,
        order: body.order,
        published: body.published,
      },
      include: { seoMeta: true, _count: { select: { chapters: true } } },
    });

    await upsertCourseSeo(course.id, body.seo);

    const full = await prisma.course.findUnique({
      where: { id: course.id },
      include: { seoMeta: true, _count: { select: { chapters: true } } },
    });

    return NextResponse.json(full, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Invalid request" },
      { status: 400 },
    );
  }
}
