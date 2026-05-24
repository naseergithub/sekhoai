import { safeJsonParse } from "@/lib/ai/safeJsonParse";

export function parseJsonFromClaude<T>(raw: string): T {
  try {
    return safeJsonParse<T>(raw, { extractArray: true });
  } catch (err) {
    console.error("Gemini JSON parse error:", err);
    console.error("Raw response (first 2000 chars):", raw.slice(0, 2000));
    throw err;
  }
}
