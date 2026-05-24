import type { AgentContentResult } from "@/lib/ai/parse";

function wordCount(text: string | undefined | null): number {
  if (!text?.trim()) return 0;
  return text.trim().split(/\s+/).length;
}

export function validateContentQuality(
  parsed: AgentContentResult,
): string[] {
  const issues: string[] = [];

  if (wordCount(parsed.whatIsIt) < 80) {
    issues.push("whatIsIt too short");
  }
  if (wordCount(parsed.whyItMatters) < 40) {
    issues.push("whyItMatters too short");
  }
  if (wordCount(parsed.howItWorks) < 60) {
    issues.push("howItWorks too short");
  }
  if (wordCount(parsed.realWorldEx) < 80) {
    issues.push("realWorldEx too short");
  }
  if (
    parsed.codeExample &&
    parsed.codeExample.split("\n").length < 8
  ) {
    issues.push("codeExample too short");
  }
  if (wordCount(parsed.applications) < 50) {
    issues.push("applications too short");
  }

  if (parsed.codeExample && !parsed.codeExample.includes("#")) {
    issues.push("codeExample is missing Urdu comments");
  }

  if (parsed.metaTitle && parsed.metaTitle.length > 65) {
    issues.push("metaTitle exceeds 65 characters");
  }
  if (parsed.metaDesc && parsed.metaDesc.length > 165) {
    issues.push("metaDesc exceeds 165 characters");
  }

  if (!parsed.hook || wordCount(parsed.hook) < 30) {
    issues.push("hook missing or too short");
  }

  if (!parsed.analogy || wordCount(parsed.analogy) < 20) {
    issues.push("analogy missing or too short");
  }

  if (!parsed.commonMistakes || wordCount(parsed.commonMistakes) < 40) {
    issues.push("commonMistakes missing or too short");
  }

  if (!parsed.comparison || wordCount(parsed.comparison) < 40) {
    issues.push("comparison missing or too short");
  }

  if (!parsed.quickSummary || wordCount(parsed.quickSummary) < 20) {
    issues.push("quickSummary missing — needs 5 bullet points");
  }

  if (!parsed.quiz || !Array.isArray(parsed.quiz) || parsed.quiz.length < 3) {
    issues.push("quiz missing or has less than 3 questions");
  }

  if (parsed.quiz && Array.isArray(parsed.quiz)) {
    parsed.quiz.forEach((q, i) => {
      if (
        !q.question ||
        !q.options ||
        q.options.length < 4 ||
        q.correctIndex === undefined ||
        !q.explanation
      ) {
        issues.push(`quiz question ${i + 1} is incomplete`);
      }
    });
  }

  return issues;
}
