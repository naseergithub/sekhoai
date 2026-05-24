import { generateWithGeminiFlash } from "@/lib/ai/gemini";
import { parseJsonFromClaude } from "@/lib/ai/parseJson";
import { buildSeoPrompt } from "@/lib/ai/prompts";
import { prisma } from "@/lib/db/prisma";

type SeoAiResult = {
  metaTitle: string;
  metaDesc: string;
  keywords: string;
  ogTitle: string;
  ogDesc: string;
  faqQuestions: { question: string; answer: string }[];
};

export async function generateSeoWithAI(subtopicId: string): Promise<void> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const subtopic = await prisma.subtopic.findUnique({
    where: { id: subtopicId },
    include: {
      seoMeta: true,
      topic: {
        include: {
          chapter: { include: { course: true } },
        },
      },
    },
  });

  if (!subtopic) throw new Error("Subtopic not found");

  const { chapter } = subtopic.topic;
  const { course } = chapter;

  const prompt = buildSeoPrompt({
    title: subtopic.title,
    titleEn: subtopic.titleEn ?? subtopic.title,
    content: subtopic.whatIsIt?.slice(0, 500) ?? subtopic.title,
    slug: subtopic.slug,
    chapterTitle: chapter.title,
    courseTitle: course.title,
  });

  const raw = await generateWithGeminiFlash(prompt);
  const result = parseJsonFromClaude<SeoAiResult>(raw.text);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const canonicalUrl = `${siteUrl}/subtopic/${subtopic.slug}`;

  await prisma.seoMeta.upsert({
    where: { subtopicId },
    create: {
      subtopicId,
      metaTitle: result.metaTitle,
      metaDesc: result.metaDesc,
      keywords: result.keywords,
      ogTitle: result.ogTitle,
      ogDesc: result.ogDesc,
      canonicalUrl,
    },
    update: {
      metaTitle: result.metaTitle,
      metaDesc: result.metaDesc,
      keywords: result.keywords,
      ogTitle: result.ogTitle,
      ogDesc: result.ogDesc,
      canonicalUrl,
    },
  });

  await prisma.subtopic.update({
    where: { id: subtopicId },
    data: {
      faqData: JSON.stringify(result.faqQuestions),
    },
  });
}
