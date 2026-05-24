import { prisma } from "@/lib/db/prisma";
import type { SeoInput } from "@/lib/admin/schemas";
import { generateSlugFromEnglish } from "@/lib/utils";

function hasSeoData(seo: NonNullable<SeoInput>) {
  return Object.values(seo).some((v) => v && String(v).trim());
}

function cleanSeo(seo: NonNullable<SeoInput>) {
  return {
    metaTitle: seo.metaTitle?.trim() || null,
    metaDesc: seo.metaDesc?.trim() || null,
    keywords: seo.keywords?.trim() || null,
    ogTitle: (seo as SeoInput & { ogTitle?: string }).ogTitle?.trim() || null,
    ogDesc: (seo as SeoInput & { ogDesc?: string }).ogDesc?.trim() || null,
    ogImage: seo.ogImage?.trim() || null,
    canonicalUrl: seo.canonicalUrl?.trim() || null,
  };
}

export async function upsertCourseSeo(courseId: string, seo?: SeoInput) {
  if (!seo || !hasSeoData(seo)) return null;
  const data = cleanSeo(seo);
  return prisma.seoMeta.upsert({
    where: { courseId },
    create: { courseId, ...data },
    update: data,
  });
}

export async function upsertChapterSeo(chapterId: string, seo?: SeoInput) {
  if (!seo || !hasSeoData(seo)) return null;
  const data = cleanSeo(seo);
  return prisma.seoMeta.upsert({
    where: { chapterId },
    create: { chapterId, ...data },
    update: data,
  });
}

export async function upsertTopicSeo(topicId: string, seo?: SeoInput) {
  if (!seo || !hasSeoData(seo)) return null;
  const data = cleanSeo(seo);
  return prisma.seoMeta.upsert({
    where: { topicId },
    create: { topicId, ...data },
    update: data,
  });
}

export async function upsertSubtopicSeo(subtopicId: string, seo?: SeoInput) {
  if (!seo || !hasSeoData(seo)) return null;
  const data = cleanSeo(seo);
  return prisma.seoMeta.upsert({
    where: { subtopicId },
    create: { subtopicId, ...data },
    update: data,
  });
}

export function resolveSlug(
  slug: string | undefined,
  titleEn: string | null | undefined,
  title: string,
): string {
  if (slug?.trim()) return slug.trim();
  if (titleEn?.trim()) return generateSlugFromEnglish(titleEn);
  return generateSlugFromEnglish(title);
}
