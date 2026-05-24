import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth } from "@/lib/auth/guard";
import { runAgentForSubtopic } from "@/lib/ai/agent";

export const maxDuration = 300;

const bulkSchema = z.object({
  subtopicIds: z.array(z.string().min(1)).min(1),
});

export async function POST(request: Request) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const { subtopicIds } = bulkSchema.parse(await request.json());

    let processed = 0;
    let failed = 0;
    const results: { subtopicId: string; success: boolean; message: string }[] =
      [];

    for (const id of subtopicIds) {
      const result = await runAgentForSubtopic(id);
      results.push({ subtopicId: id, ...result });
      if (result.success) processed++;
      else failed++;

      if (subtopicIds.indexOf(id) < subtopicIds.length - 1) {
        await new Promise((r) => setTimeout(r, 2000));
      }
    }

    return NextResponse.json({
      success: true,
      processed,
      failed,
      total: subtopicIds.length,
      results,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Invalid request" },
      { status: 400 },
    );
  }
}
