import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth } from "@/lib/auth/guard";
import { runFullPipeline } from "@/lib/ai/pipeline";

export const maxDuration = 300;

const schema = z.object({ subtopicId: z.string().min(1) });

export async function POST(request: Request) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const { subtopicId } = schema.parse(await request.json());
    const result = await runFullPipeline(subtopicId);

    return NextResponse.json({
      content: { success: result.content },
      seo: { success: result.seo },
      social: { success: result.social },
      published: result.published,
      message: "مکمل پائپ لائن کامیاب — جائزے کے لیے تیار",
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Pipeline failed" },
      { status: 500 },
    );
  }
}
