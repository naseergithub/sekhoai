import { revalidateContent } from "@/lib/seo/revalidate";

export async function triggerRevalidation(
  type: "subtopic" | "course" | "chapter" | "topic",
  slug: string,
) {
  const secret = process.env.REVALIDATE_SECRET;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  if (secret) {
    try {
      await fetch(`${siteUrl}/api/revalidate?secret=${secret}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, type }),
      });
    } catch {
      await revalidateContent(type, slug);
    }
  } else {
    await revalidateContent(type, slug);
  }
}
