import { cleanJsonResponse } from "@/lib/ai/parse";

export function parseJsonFromClaude<T>(raw: string): T {
  let cleaned = cleanJsonResponse(raw);

  const arrayMatch = cleaned.match(/\[[\s\S]*\]/);
  if (arrayMatch && !cleaned.trimStart().startsWith("{")) {
    cleaned = arrayMatch[0];
  }

  try {
    return JSON.parse(cleaned) as T;
  } catch (err) {
    console.error("Gemini JSON parse error:", err);
    console.error("Raw response:", raw);
    const message = err instanceof Error ? err.message : "Invalid JSON";
    throw new Error(`AI response parsing failed: ${message}`);
  }
}
