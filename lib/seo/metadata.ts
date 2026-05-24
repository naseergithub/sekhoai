import type { Metadata } from "next";
import type { Chapter, Course, SeoMeta, Subtopic, Topic } from "@prisma/client";

type EntityWithSeo = {
  title: string;
  description?: string | null;
  seoMeta?: SeoMeta | null;
};

export function buildMetadata(
  entity: EntityWithSeo,
  fallbackDescription?: string,
): Metadata {
  const title = entity.seoMeta?.metaTitle ?? entity.title;
  const description =
    entity.seoMeta?.metaDesc ??
    fallbackDescription ??
    entity.description ??
    entity.title;

  const ogTitle =
    (entity.seoMeta as SeoMeta & { ogTitle?: string | null })?.ogTitle ?? title;
  const ogDesc =
    (entity.seoMeta as SeoMeta & { ogDesc?: string | null })?.ogDesc ??
    description;

  return {
    title,
    description,
    keywords: entity.seoMeta?.keywords ?? undefined,
    openGraph: {
      title: ogTitle,
      description: ogDesc,
      locale: "ur_PK",
      type: "article",
      ...(entity.seoMeta?.ogImage
        ? { images: [{ url: entity.seoMeta.ogImage }] }
        : {}),
    },
    alternates: entity.seoMeta?.canonicalUrl
      ? { canonical: entity.seoMeta.canonicalUrl }
      : undefined,
  };
}

export function buildCourseMetadata(course: Course & { seoMeta: SeoMeta | null }) {
  return buildMetadata(
    { ...course, seoMeta: course.seoMeta },
    course.description,
  );
}

export function buildChapterMetadata(
  chapter: Chapter & { seoMeta: SeoMeta | null; description?: string | null },
) {
  return buildMetadata(chapter, chapter.description ?? undefined);
}

export function buildTopicMetadata(topic: Topic & { seoMeta: SeoMeta | null }) {
  return buildMetadata(topic);
}

export function buildSubtopicMetadata(
  subtopic: Subtopic & { seoMeta: SeoMeta | null },
) {
  return buildMetadata(subtopic, subtopic.whatIsIt ?? undefined);
}
