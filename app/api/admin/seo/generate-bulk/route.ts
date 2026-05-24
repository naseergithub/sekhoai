import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth } from "@/lib/auth/guard";
import { generateSeoWithAI } from "@/lib/ai/seoAgent";

export const maxDuration = 300;

const schema = z.object({
  subtopicIds: z.array(z.string().min(1)).min(1),
});

export async function POST(request: Request) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const { subtopicIds } = schema.parse(await request.json());
    let processed = 0;
    let failed = 0;

    for (let i = 0; i < subtopicIds.length; i++) {
      try {
        await generateSeoWithAI(subtopicIds[i]);
        processed++;
      } catch {
        failed++;
      }
      if (i < subtopicIds.length - 1) {
        await new Promise((r) => setTimeout(r, 2000));
      }
    }

    return NextResponse.json({ success: true, processed, failed });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Invalid request" },
      { status: 400 },
    );
  }
}
