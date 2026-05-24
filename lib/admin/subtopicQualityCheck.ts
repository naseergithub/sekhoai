import { parseFaqData } from "@/lib/seo/structuredData";
import { validatePythonCode } from "@/lib/ai/validatePythonCode";
import { parseQuizData } from "@/types";
import type { SeoMeta, Subtopic } from "@prisma/client";

function wordCount(text: string | undefined | null): number {
  if (!text?.trim()) return 0;
  return text.trim().split(/\s+/).length;
}

export type QualityCheckItem = {
  id: string;
  label: string;
  passed: boolean;
  message: string;
  detail?: string;
  issues?: string[];
};

export type QualityCheckResult = {
  checks: QualityCheckItem[];
  passedCount: number;
  total: number;
  scoreLabel: string;
  scoreColor: "emerald" | "blue" | "amber" | "red";
};

export function runSubtopicQualityChecks(
  subtopic: Pick<
    Subtopic,
    | "whatIsIt"
    | "whyItMatters"
    | "howItWorks"
    | "mathBehindIt"
    | "realWorldEx"
    | "codeExample"
    | "applications"
    | "hook"
    | "analogy"
    | "commonMistakes"
    | "comparison"
    | "quickSummary"
    | "quizData"
    | "faqData"
  >,
  seoMeta: Pick<SeoMeta, "metaTitle" | "metaDesc"> | null,
): QualityCheckResult {
  const whatWords = wordCount(subtopic.whatIsIt);
  const whyWords = wordCount(subtopic.whyItMatters);
  const howWords = wordCount(subtopic.howItWorks);
  const realWords = wordCount(subtopic.realWorldEx);
  const appWords = wordCount(subtopic.applications);
  const hookWords = wordCount(subtopic.hook);
  const analogyWords = wordCount(subtopic.analogy);
  const mistakesWords = wordCount(subtopic.commonMistakes);
  const comparisonWords = wordCount(subtopic.comparison);
  const codeLines = subtopic.codeExample?.trim()
    ? subtopic.codeExample.split("\n").length
    : 0;
  const codeValidation = subtopic.codeExample?.trim()
    ? validatePythonCode(subtopic.codeExample)
    : { isValid: false, issues: [] as string[] };
  const hasComments = Boolean(subtopic.codeExample?.includes("#"));
  const codePassed =
    codeValidation.isValid && codeLines >= 15 && hasComments;

  let codeMessage: string;
  if (!subtopic.codeExample?.trim()) {
    codeMessage = "Code missing or has no Urdu comments";
  } else if (!codeValidation.isValid) {
    codeMessage =
      "Code has Urdu syntax — will not run! Python keywords/variable names in Urdu";
  } else if (codeLines < 15) {
    codeMessage = "Code too short — needs 15+ lines";
  } else if (!hasComments) {
    codeMessage = "Code has no Urdu comments";
  } else {
    codeMessage = "Valid Python syntax and length";
  }
  const faqCount = parseFaqData(subtopic.faqData).length;
  const quizCount = parseQuizData(subtopic.quizData).length;
  const metaTitle = seoMeta?.metaTitle?.trim() ?? "";
  const metaDesc = seoMeta?.metaDesc?.trim() ?? "";

  const checks: QualityCheckItem[] = [
    {
      id: "whatIsIt",
      label: "What Is It?",
      passed: whatWords >= 80,
      message:
        whatWords >= 80
          ? "Good length"
          : "Too short — needs at least 80 words",
      detail: `(${whatWords} words)`,
    },
    {
      id: "whyItMatters",
      label: "Why It Matters",
      passed: whyWords >= 40,
      message:
        whyWords >= 40
          ? "Good length"
          : "Too short — needs at least 40 words",
      detail: whyWords > 0 ? `(${whyWords} words)` : undefined,
    },
    {
      id: "howItWorks",
      label: "How It Works",
      passed: howWords >= 60,
      message: howWords >= 60 ? "Good length" : "Too short",
      detail: howWords > 0 ? `(${howWords} words)` : undefined,
    },
    {
      id: "mathBehindIt",
      label: "Math Section",
      passed: Boolean(subtopic.mathBehindIt?.trim()),
      message: subtopic.mathBehindIt?.trim()
        ? "Present"
        : "Missing math section",
    },
    {
      id: "realWorldEx",
      label: "Real World Examples",
      passed: realWords >= 80,
      message:
        realWords >= 80
          ? "Good length"
          : "Too short — needs 3 Pakistan examples",
      detail: realWords > 0 ? `(${realWords} words)` : undefined,
    },
    {
      id: "codeExample",
      label: "Code Example",
      passed: codePassed,
      message: codeMessage,
      issues: codeValidation.issues.length > 0 ? codeValidation.issues : undefined,
    },
    {
      id: "applications",
      label: "Applications",
      passed: appWords >= 50,
      message:
        appWords >= 50
          ? "Good length"
          : "Too short — needs 5 ideas",
      detail: appWords > 0 ? `(${appWords} words)` : undefined,
    },
    {
      id: "seoTitle",
      label: "SEO Meta Title",
      passed: Boolean(metaTitle) && metaTitle.length <= 60,
      message:
        metaTitle && metaTitle.length <= 60
          ? "Valid"
          : metaTitle
            ? "Too long"
            : "Missing or too long",
      detail: metaTitle ? `(${metaTitle.length} chars)` : undefined,
    },
    {
      id: "seoDesc",
      label: "SEO Meta Description",
      passed: Boolean(metaDesc) && metaDesc.length <= 160,
      message:
        metaDesc && metaDesc.length <= 160
          ? "Valid"
          : metaDesc
            ? "Too long"
            : "Missing or too long",
      detail: metaDesc ? `(${metaDesc.length} chars)` : undefined,
    },
    {
      id: "faq",
      label: "FAQ Questions",
      passed: faqCount >= 3,
      message:
        faqCount >= 3
          ? `${faqCount} questions`
          : "Missing FAQ — hurts SEO",
      detail: faqCount > 0 ? `(${faqCount} questions)` : undefined,
    },
    {
      id: "hook",
      label: "Hook / Opening Story",
      passed: hookWords >= 30,
      message:
        hookWords >= 30
          ? "Good opening"
          : "Missing hook — students need an engaging start",
      detail: hookWords > 0 ? `(${hookWords} words)` : undefined,
    },
    {
      id: "analogy",
      label: "Simple Analogy",
      passed: analogyWords >= 20,
      message:
        analogyWords >= 20
          ? "Present"
          : "Missing analogy — helps beginners relate",
      detail: analogyWords > 0 ? `(${analogyWords} words)` : undefined,
    },
    {
      id: "commonMistakes",
      label: "Common Mistakes",
      passed: mistakesWords >= 40,
      message:
        mistakesWords >= 40
          ? "Present"
          : "Missing common mistakes section",
      detail: mistakesWords > 0 ? `(${mistakesWords} words)` : undefined,
    },
    {
      id: "comparison",
      label: "Comparison",
      passed: comparisonWords >= 40,
      message:
        comparisonWords >= 40
          ? "Present"
          : "Missing comparison with similar concept",
      detail: comparisonWords > 0 ? `(${comparisonWords} words)` : undefined,
    },
    {
      id: "quickSummary",
      label: "Quick Summary",
      passed: Boolean(subtopic.quickSummary?.trim()),
      message: subtopic.quickSummary?.trim()
        ? "Present"
        : "Missing quick summary — hurts retention",
    },
    {
      id: "quiz",
      label: "Quiz Questions",
      passed: quizCount >= 3,
      message:
        quizCount >= 3
          ? `${quizCount} questions`
          : "Missing quiz — hurts engagement and SEO",
      detail: quizCount > 0 ? `(${quizCount} questions)` : undefined,
    },
  ];

  const passedCount = checks.filter((c) => c.passed).length;
  const total = checks.length;

  let scoreLabel: string;
  let scoreColor: QualityCheckResult["scoreColor"];

  if (passedCount >= 13) {
    scoreLabel = "Excellent — Ready to publish";
    scoreColor = "emerald";
  } else if (passedCount >= 9) {
    scoreLabel = "Good — Minor improvements needed";
    scoreColor = "blue";
  } else if (passedCount >= 5) {
    scoreLabel = "Needs improvement";
    scoreColor = "amber";
  } else {
    scoreLabel = "Not ready — regenerate content";
    scoreColor = "red";
  }

  return { checks, passedCount, total, scoreLabel, scoreColor };
}
