import { runAgentForSubtopic } from "@/lib/ai/agent";
import { generateSeoWithAI } from "@/lib/ai/seoAgent";
import { generateSocialPosts } from "@/lib/ai/socialAgent";

export async function runFullPipeline(subtopicId: string): Promise<{
  content: boolean;
  seo: boolean;
  social: boolean;
  published: boolean;
}> {
  const result = {
    content: false,
    seo: false,
    social: false,
    published: false,
  };

  const contentResult = await runAgentForSubtopic(subtopicId);
  result.content = contentResult.success;

  if (!contentResult.success) {
    return result;
  }

  try {
    await generateSeoWithAI(subtopicId);
    result.seo = true;
  } catch {
    result.seo = false;
  }

  try {
    await generateSocialPosts(subtopicId);
    result.social = true;
  } catch {
    result.social = false;
  }

  return result;
}
