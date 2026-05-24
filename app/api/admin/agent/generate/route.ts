import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth } from "@/lib/auth/guard";
import { runAgentForSubtopic } from "@/lib/ai/agent";

export const maxDuration = 120;

const generateSchema = z.object({
  subtopicId: z.string().min(1),
});

export async function POST(request: Request) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const { subtopicId } = generateSchema.parse(await request.json());
    const result = await runAgentForSubtopic(subtopicId);

    if (!result.success) {
      const isQuota =
        result.message.includes("quota") ||
        result.message.includes("429") ||
        result.message.includes("GEMINI_API_KEY");
      return NextResponse.json(
        { success: false, message: result.message, subtopicId },
        { status: isQuota ? 503 : 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      subtopicId,
    });
  } catch (e) {
    return NextResponse.json(
      {
        success: false,
        message: e instanceof Error ? e.message : "Invalid request",
      },
      { status: 400 },
    );
  }
}
