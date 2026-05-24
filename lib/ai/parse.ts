import { safeJsonParse } from "@/lib/ai/safeJsonParse";
import type { QuizQuestion } from "@/types";

const REQUIRED_STRING_FIELDS = [
  "whatIsIt",
  "whyItMatters",
  "howItWorks",
  "mathBehindIt",
  "realWorldEx",
  "codeExample",
  "codeLanguage",
  "applications",
  "hook",
  "analogy",
  "commonMistakes",
  "comparison",
  "quickSummary",
  "metaTitle",
  "metaDesc",
  "keywords",
] as const;

const CONTENT_MIN_LENGTH_FIELDS = [
  "whatIsIt",
  "whyItMatters",
  "howItWorks",
  "realWorldEx",
  "codeExample",
  "applications",
  "hook",
  "analogy",
  "commonMistakes",
  "comparison",
  "quickSummary",
] as const;

export type AgentContentResult = {
  whatIsIt: string;
  whyItMatters: string;
  howItWorks: string;
  mathBehindIt: string;
  realWorldEx: string;
  codeExample: string;
  codeLanguage: string;
  applications: string;
  hook: string;
  analogy: string;
  commonMistakes: string;
  comparison: string;
  quickSummary: string;
  quiz: QuizQuestion[];
  metaTitle: string;
  metaDesc: string;
  keywords: string;
};

export { cleanJsonResponse } from "@/lib/ai/safeJsonParse";

/** Gemini sometimes returns arrays/objects — normalize to plain strings. */
function coerceToString(value: unknown, field: string): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object") {
          const obj = item as Record<string, unknown>;
          const title = obj.title ?? obj.name ?? obj.heading;
          const body = obj.description ?? obj.text ?? obj.content ?? obj.answer;
          if (title && body) return `${title}\n${body}`;
          return JSON.stringify(item, null, 2);
        }
        return String(item);
      })
      .join("\n\n");
  }
  if (value && typeof value === "object") {
    return JSON.stringify(value, null, 2);
  }
  throw new Error(`Invalid field type: ${field}`);
}

function parseQuizField(value: unknown): QuizQuestion[] {
  if (value === undefined || value === null) {
    throw new Error("Missing required field: quiz");
  }
  if (typeof value === "string") {
    try {
      value = safeJsonParse<unknown>(value);
    } catch {
      throw new Error("Invalid field type: quiz");
    }
  }
  if (!Array.isArray(value)) {
    throw new Error("Invalid field type: quiz");
  }
  return value.map((item, index) => {
    if (!item || typeof item !== "object") {
      throw new Error(`Invalid quiz question at index ${index}`);
    }
    const q = item as Record<string, unknown>;
    if (typeof q.question !== "string") {
      throw new Error(`Invalid quiz question at index ${index}`);
    }
    if (!Array.isArray(q.options) || q.options.some((o) => typeof o !== "string")) {
      throw new Error(`Invalid quiz options at index ${index}`);
    }
    if (typeof q.correctIndex !== "number") {
      throw new Error(`Invalid quiz correctIndex at index ${index}`);
    }
    if (typeof q.explanation !== "string") {
      throw new Error(`Invalid quiz explanation at index ${index}`);
    }
    return {
      question: q.question,
      options: q.options,
      correctIndex: q.correctIndex,
      explanation: q.explanation,
    };
  });
}

export function parseAgentJsonResponse(raw: string): AgentContentResult {
  let parsed: Record<string, unknown>;
  try {
    parsed = safeJsonParse<Record<string, unknown>>(raw);
  } catch (err) {
    console.error("Gemini parse error:", err);
    console.error("Raw response (first 2000 chars):", raw.slice(0, 2000));
    const message = err instanceof Error ? err.message : "Invalid JSON";
    throw new Error(`AI response parsing failed: ${message}`);
  }

  for (const field of REQUIRED_STRING_FIELDS) {
    if (parsed[field] === undefined || parsed[field] === null) {
      throw new Error(`Missing required field: ${field}`);
    }
    parsed[field] = coerceToString(parsed[field], field);
  }

  const quiz = parseQuizField(parsed.quiz);

  for (const field of CONTENT_MIN_LENGTH_FIELDS) {
    const value = (parsed[field] as string).trim();
    if (value.length < 10) {
      throw new Error(`Field "${field}" is missing or too short`);
    }
  }

  const math = (parsed.mathBehindIt as string).trim();
  if (math.length > 500 && !math.includes("=")) {
    parsed.mathBehindIt = "لاگو نہیں";
  }

  return {
    ...(parsed as Omit<AgentContentResult, "quiz">),
    quiz,
  };
}
