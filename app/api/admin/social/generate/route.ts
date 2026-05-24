import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth } from "@/lib/auth/guard";
import { generateSocialPosts } from "@/lib/ai/socialAgent";

export const maxDuration = 60;

const schema = z.object({ subtopicId: z.string().min(1) });

export async function POST(request: Request) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const { subtopicId } = schema.parse(await request.json());
    const posts = await generateSocialPosts(subtopicId);
    return NextResponse.json({ success: true, posts });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Generation failed" },
      { status: 500 },
    );
  }
}
