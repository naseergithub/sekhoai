import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo/site";
import { prisma } from "@/lib/db/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  const [courses, chapters, topics, subtopics] = await Promise.all([
    prisma.course.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.chapter.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.topic.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.subtopic.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/courses`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  return [
    ...staticPages,
    ...courses.map((c) => ({
      url: `${siteUrl}/courses/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...chapters.map((c) => ({
      url: `${siteUrl}/chapter/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...topics.map((t) => ({
      url: `${siteUrl}/topic/${t.slug}`,
      lastModified: t.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...subtopics.map((s) => ({
      url: `${siteUrl}/subtopic/${s.slug}`,
      lastModified: s.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
