import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth } from "@/lib/auth/guard";
import { prisma } from "@/lib/db/prisma";

type Params = { params: Promise<{ id: string }> };

const updateSchema = z.object({
  facebook: z.string().optional().nullable(),
  instagram: z.string().optional().nullable(),
  twitter: z.string().optional().nullable(),
  youtube: z.string().optional().nullable(),
  linkedin: z.string().optional().nullable(),
});

export async function PUT(request: Request, { params }: Params) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id } = await params;

  try {
    const body = updateSchema.parse(await request.json());
    const post = await prisma.socialPost.update({
      where: { id },
      data: body,
      include: {
        subtopic: { select: { title: true, slug: true } },
      },
    });
    return NextResponse.json(post);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Update failed" },
      { status: 400 },
    );
  }
}

export async function PATCH(request: Request, { params }: Params) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id } = await params;

  const post = await prisma.socialPost.update({
    where: { id },
    data: {
      status: "POSTED",
      postedAt: new Date(),
    },
    include: {
      subtopic: { select: { title: true, slug: true } },
    },
  });

  return NextResponse.json(post);
}
