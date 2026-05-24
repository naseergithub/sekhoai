import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/guard";
import { publishSchema } from "@/lib/admin/schemas";
import { triggerRevalidation } from "@/lib/seo/publish";
import { prisma } from "@/lib/db/prisma";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id } = await params;

  try {
    const body = await request.json();
    const { published } = publishSchema.parse(body);

    const subtopic = await prisma.subtopic.update({
      where: { id },
      data: { published },
      select: { slug: true, published: true },
    });

    await triggerRevalidation("subtopic", subtopic.slug);

    return NextResponse.json({
      success: true,
      published: subtopic.published,
      message: published
        ? "Subtopic published successfully"
        : "Subtopic unpublished",
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Invalid request" },
      { status: 400 },
    );
  }
}
