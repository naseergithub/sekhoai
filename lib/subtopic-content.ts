/** Content parsing helpers for subtopic sections */

import { parseQuizData } from "@/types";

export function splitParagraphs(text: string): string[] {
  return text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function isBulletList(text: string): boolean {
  return text
    .split("\n")
    .some((line) => /^[\s]*[-•▪]/.test(line.trim()) || /^[\s]*\*/.test(line.trim()));
}

export function parseBulletLines(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.replace(/^[\s]*[-•▪*]\s*/, "").trim())
    .filter(Boolean);
}

export function isNumberedSteps(text: string): boolean {
  return /^[\s]*[٠-٩0-9]+[.)]\s/m.test(text);
}

export function parseNumberedSteps(text: string): string[] {
  return text
    .split(/\n(?=[\s]*[٠-٩0-9]+[.)]\s)/)
    .map((line) => line.replace(/^[\s]*[٠-٩0-9]+[.)]\s*/, "").trim())
    .filter(Boolean);
}

export function isMathNotApplicable(text: string): boolean {
  const t = text.trim();
  return (
    t === "لاگو نہیں" ||
    t.includes("لاگو نہیں") ||
    t.toLowerCase() === "n/a"
  );
}

export function splitRealWorldExamples(text: string): string[] {
  const parts = splitParagraphs(text);
  if (parts.length >= 2) return parts;
  return text.split(/\n+/).map((p) => p.trim()).filter(Boolean);
}

export type ParsedMistake = {
  mistake: string;
  solution: string;
};

export function parseCommonMistakes(text: string): ParsedMistake[] {
  const trimmed = text.trim();
  if (!trimmed) return [];

  const blocks = trimmed
    .split(/(?=غلطی\s*[:：])/i)
    .map((b) => b.trim())
    .filter(Boolean);

  if (blocks.length > 1 || /^غلطی\s*[:：]/i.test(trimmed)) {
    return blocks.map((block) => {
      const solutionMatch = block.split(/(?=حل\s*[:：])/i);
      const mistakePart = solutionMatch[0]
        ?.replace(/^غلطی\s*[:：]\s*/i, "")
        .replace(/مسئلہ\s*[:：][^\n]*/i, "")
        .trim();
      const solutionPart =
        solutionMatch[1]?.replace(/^حل\s*[:：]\s*/i, "").trim() ?? "";
      return {
        mistake: mistakePart || block,
        solution: solutionPart,
      };
    });
  }

  const paragraphs = splitParagraphs(trimmed);
  if (paragraphs.length >= 2) {
    return paragraphs.map((p) => ({ mistake: p, solution: "" }));
  }

  return [];
}

export type ParsedComparison =
  | {
      type: "cards";
      leftTitle: string;
      leftPoints: string[];
      rightTitle: string;
      rightPoints: string[];
      usage: string;
    }
  | { type: "plain"; text: string };

export function parseComparison(text: string): ParsedComparison {
  const trimmed = text.trim();
  const hasTablePattern =
    trimmed.includes("|") ||
    /\bvs\b/i.test(trimmed) ||
    trimmed.includes("بمقابلہ") ||
    trimmed.includes("فرق");

  if (!hasTablePattern) {
    return { type: "plain", text: trimmed };
  }

  const usageMatch = trimmed.match(
    /(?:کب کون سا استعمال|استعمال کریں)[^\n]*\n?([\s\S]*)/i,
  );
  const usage = usageMatch?.[1]?.trim() ?? "";

  const lines = trimmed
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const pipeRows = lines.filter((l) => l.includes("|"));
  if (pipeRows.length >= 2) {
    const leftPoints: string[] = [];
    const rightPoints: string[] = [];
    for (const row of pipeRows) {
      const cells = row.split("|").map((c) => c.trim()).filter(Boolean);
      if (cells.length >= 2) {
        leftPoints.push(cells[0]);
        rightPoints.push(cells[1]);
      }
    }
    if (leftPoints.length > 0) {
      return {
        type: "cards",
        leftTitle: "پہلا Concept",
        leftPoints,
        rightTitle: "دوسرا Concept",
        rightPoints,
        usage: usage || trimmed,
      };
    }
  }

  const vsParts = trimmed.split(/\s+(?:vs|بمقابلہ)\s+/i);
  if (vsParts.length === 2) {
    return {
      type: "cards",
      leftTitle: "پہلا Concept",
      leftPoints: splitParagraphs(vsParts[0]),
      rightTitle: "دوسرا Concept",
      rightPoints: splitParagraphs(vsParts[1]),
      usage: usage || "",
    };
  }

  return { type: "plain", text: trimmed };
}

export function parseQuickSummary(text: string): string[] {
  return text
    .split(/\n+/)
    .map((line) =>
      line
        .replace(/^[\s•\-*▪✓✅]+/, "")
        .replace(/^\d+[.)]\s*/, "")
        .trim(),
    )
    .filter(Boolean);
}

export const TOC_SECTION_DEFS = [
  { id: "hook", field: "hook" as const, label: "آغاز" },
  { id: "what-is-it", field: "whatIsIt" as const, label: "یہ کیا ہے؟" },
  { id: "why-matters", field: "whyItMatters" as const, label: "یہ کیوں ضروری ہے؟" },
  { id: "analogy", field: "analogy" as const, label: "آسان مثال" },
  { id: "how-works", field: "howItWorks" as const, label: "یہ کیسے کام کرتا ہے؟" },
  { id: "math", field: "mathBehindIt" as const, label: "ریاضی" },
  { id: "real-world", field: "realWorldEx" as const, label: "حقیقی مثالیں" },
  { id: "code", field: "codeExample" as const, label: "کوڈ مثال" },
  { id: "mistakes", field: "commonMistakes" as const, label: "عام غلطیاں" },
  { id: "comparison", field: "comparison" as const, label: "موازنہ" },
  { id: "applications", field: "applications" as const, label: "عملی استعمال" },
  { id: "summary", field: "quickSummary" as const, label: "خلاصہ" },
  { id: "quiz", field: "quizData" as const, label: "سوالات" },
  { id: "faq", field: "faq" as const, label: "اکثر سوالات" },
];

export type SubtopicContentFields = {
  whatIsIt?: string | null;
  whyItMatters?: string | null;
  howItWorks?: string | null;
  mathBehindIt?: string | null;
  realWorldEx?: string | null;
  codeExample?: string | null;
  codeLanguage?: string | null;
  applications?: string | null;
  hook?: string | null;
  analogy?: string | null;
  commonMistakes?: string | null;
  comparison?: string | null;
  quickSummary?: string | null;
  quizData?: string | null;
};

export function buildTocSections(
  subtopic: SubtopicContentFields,
  hasFaq: boolean,
): { id: string; label: string }[] {
  const sections: { id: string; label: string }[] = [];

  for (const def of TOC_SECTION_DEFS) {
    if (def.field === "faq") {
      if (hasFaq) sections.push({ id: def.id, label: def.label });
      continue;
    }
    if (def.field === "quizData") {
      if (parseQuizData(subtopic.quizData ?? null).length > 0) {
        sections.push({ id: def.id, label: def.label });
      }
      continue;
    }
    const val = subtopic[def.field];
    if (val?.trim()) sections.push({ id: def.id, label: def.label });
  }

  return sections;
}
