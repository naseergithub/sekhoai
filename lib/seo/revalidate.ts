import { revalidatePath } from "next/cache";

export type RevalidateType = "subtopic" | "course" | "chapter" | "topic";

const pathMap: Record<RevalidateType, (slug: string) => string> = {
  subtopic: (slug) => `/subtopic/${slug}`,
  course: (slug) => `/courses/${slug}`,
  chapter: (slug) => `/chapter/${slug}`,
  topic: (slug) => `/topic/${slug}`,
};

export async function revalidateContent(type: RevalidateType, slug: string) {
  const path = pathMap[type](slug);
  revalidatePath(path);
  revalidatePath("/");
  revalidatePath("/courses");
  revalidatePath("/sitemap.xml");
}
