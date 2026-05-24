import { upsertSubtopicSeo } from "@/lib/admin/seo";
import { prisma } from "@/lib/db/prisma";
import { generateWithGeminiPro } from "@/lib/ai/gemini";
import { parseAgentJsonResponse } from "@/lib/ai/parse";
import { buildSubtopicPrompt } from "@/lib/ai/prompts";
import { validateContentQuality } from "@/lib/ai/validateContent";
import { validatePythonCode } from "@/lib/ai/validatePythonCode";

export const AGENT_MODEL =
  process.env.GEMINI_MODEL_PRO ??
  process.env.GEMINI_MODEL_FLASH ??
  "gemini-2.5-flash";

export async function runAgentForSubtopic(subtopicId: string): Promise<{
  success: boolean;
  message: string;
}> {
  if (!process.env.GEMINI_API_KEY) {
    return {
      success: false,
      message: "GEMINI_API_KEY is not configured",
    };
  }

  let logId: string | null = null;

  try {
    const subtopic = await prisma.subtopic.findUnique({
      where: { id: subtopicId },
      include: {
        topic: {
          include: {
            chapter: {
              include: { course: true },
            },
          },
        },
      },
    });

    if (!subtopic) {
      return { success: false, message: "Subtopic not found" };
    }

    const { chapter, ...topic } = subtopic.topic;
    const { course } = chapter;

    const prompt = buildSubtopicPrompt({
      courseTitle: course.title,
      chapterTitle: chapter.title,
      topicTitle: topic.title,
      subtopicTitle: subtopic.title,
      subtopicTitleEn: subtopic.titleEn ?? subtopic.title,
    });

    const log = await prisma.agentLog.create({
      data: {
        subtopicId,
        prompt,
        response: "",
        model: AGENT_MODEL,
        status: "PENDING",
      },
    });
    logId = log.id;

    let rawResponse: string;
    let usedModel: string;

    const first = await generateWithGeminiPro(prompt);
    rawResponse = first.text;
    usedModel = first.model;

    let content: ReturnType<typeof parseAgentJsonResponse>;
    try {
      content = parseAgentJsonResponse(rawResponse);
    } catch (parseError) {
      const parseMsg =
        parseError instanceof Error ? parseError.message : "Parse failed";
      if (
        parseMsg.includes("parsing failed") ||
        parseMsg.includes("JSON")
      ) {
        console.warn("First parse failed, retrying Gemini once...", parseMsg);
        const retry = await generateWithGeminiPro(
          `${prompt}\n\nIMPORTANT: Previous response was invalid or truncated JSON. Return ONLY complete valid JSON. Keep content thorough but ensure the JSON closes properly — all strings must be closed.`,
        );
        rawResponse = retry.text;
        usedModel = retry.model;
        content = parseAgentJsonResponse(rawResponse);
      } else {
        throw parseError;
      }
    }

    await prisma.subtopic.update({
      where: { id: subtopicId },
      data: {
        whatIsIt: content.whatIsIt || null,
        whyItMatters: content.whyItMatters || null,
        howItWorks: content.howItWorks || null,
        mathBehindIt: content.mathBehindIt || null,
        realWorldEx: content.realWorldEx || null,
        codeExample: content.codeExample || null,
        codeLanguage: content.codeLanguage || "python",
        applications: content.applications || null,
        hook: content.hook || null,
        analogy: content.analogy || null,
        commonMistakes: content.commonMistakes || null,
        comparison: content.comparison || null,
        quickSummary: content.quickSummary || null,
        quizData: content.quiz?.length
          ? JSON.stringify(content.quiz)
          : null,
        aiGenerated: true,
        aiGeneratedAt: new Date(),
        published: false,
      },
    });

    await upsertSubtopicSeo(subtopicId, {
      metaTitle: content.metaTitle,
      metaDesc: content.metaDesc,
      keywords: content.keywords,
    });

    const qualityIssues = validateContentQuality(content);
    if (qualityIssues.length > 0) {
      console.warn("Content quality issues:", qualityIssues);
    }

    let codeWarning: string | null = null;
    if (content.codeExample) {
      const codeCheck = validatePythonCode(content.codeExample);
      if (!codeCheck.isValid) {
        console.warn("Python code has Urdu syntax issues:", codeCheck.issues);
        codeWarning = `Code syntax issues: ${codeCheck.issues.slice(0, 3).join(" | ")}`;
      }
    }

    const warningParts = [
      qualityIssues.length > 0
        ? `Quality issues: ${qualityIssues.join(" | ")}`
        : null,
      codeWarning,
    ].filter(Boolean);

    await prisma.agentLog.update({
      where: { id: log.id },
      data: {
        status: "SUCCESS",
        model: usedModel,
        response: rawResponse,
        errorMsg: null,
        warningMsg: warningParts.length > 0 ? warningParts.join(" | ") : null,
      },
    });

    return {
      success: true,
      message: "Content generated successfully",
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";

    if (logId) {
      await prisma.agentLog.update({
        where: { id: logId },
        data: {
          status: "FAILED",
          errorMsg: message,
        },
      });
    }

    return { success: false, message };
  }
}
