import { generateWithGeminiFlash } from "@/lib/ai/gemini";
import { parseJsonFromClaude } from "@/lib/ai/parseJson";
import { buildSocialPrompt } from "@/lib/ai/prompts";
import { getSiteUrl } from "@/lib/seo/site";
import { prisma } from "@/lib/db/prisma";

export type SocialPostsResult = {
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
  linkedin: string;
};

export async function generateSocialPosts(
  subtopicId: string,
): Promise<SocialPostsResult> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const subtopic = await prisma.subtopic.findUnique({
    where: { id: subtopicId },
    select: {
      id: true,
      title: true,
      titleEn: true,
      slug: true,
      whatIsIt: true,
      topic: {
        select: {
          chapter: {
            select: {
              course: { select: { title: true } },
            },
          },
        },
      },
    },
  });

  if (!subtopic) throw new Error("Subtopic not found");

  const siteUrl = getSiteUrl();
  const link = `${siteUrl}/subtopic/${subtopic.slug}`;

  const prompt = buildSocialPrompt({
    title: subtopic.title,
    titleEn: subtopic.titleEn ?? subtopic.title,
    summary: subtopic.whatIsIt?.slice(0, 300) ?? subtopic.title,
    url: link,
    courseTitle: subtopic.topic.chapter.course.title,
  });

  const raw = await generateWithGeminiFlash(prompt);
  const posts = parseJsonFromClaude<SocialPostsResult>(raw.text);

  await prisma.socialPost.upsert({
    where: { subtopicId },
    create: {
      subtopicId,
      facebook: posts.facebook,
      instagram: posts.instagram,
      twitter: posts.twitter,
      youtube: posts.youtube,
      linkedin: posts.linkedin,
      status: "DRAFT",
    },
    update: {
      facebook: posts.facebook,
      instagram: posts.instagram,
      twitter: posts.twitter,
      youtube: posts.youtube,
      linkedin: posts.linkedin,
      generatedAt: new Date(),
      status: "DRAFT",
    },
  });

  return posts;
}
