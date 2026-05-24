import { z } from "zod";

export const seoSchema = z
  .object({
    metaTitle: z.string().optional().nullable(),
    metaDesc: z.string().optional().nullable(),
    keywords: z.string().optional().nullable(),
    ogImage: z.string().optional().nullable(),
    canonicalUrl: z.string().optional().nullable(),
  })
  .optional();

export const courseSchema = z.object({
  title: z.string().min(1),
  titleEn: z.string().optional().nullable(),
  slug: z.string().optional(),
  description: z.string().min(1),
  thumbnail: z.string().optional().nullable(),
  order: z.coerce.number().int().default(0),
  published: z.boolean().default(false),
  seo: seoSchema,
});

export const chapterSchema = z.object({
  courseId: z.string().min(1),
  title: z.string().min(1),
  titleEn: z.string().optional().nullable(),
  slug: z.string().optional(),
  description: z.string().optional().nullable(),
  order: z.coerce.number().int().default(0),
  published: z.boolean().default(false),
  seo: seoSchema,
});

export const topicSchema = z.object({
  chapterId: z.string().min(1),
  title: z.string().min(1),
  titleEn: z.string().optional().nullable(),
  slug: z.string().optional(),
  order: z.coerce.number().int().default(0),
  published: z.boolean().default(false),
  seo: seoSchema,
});

export const subtopicSchema = z.object({
  topicId: z.string().min(1),
  title: z.string().min(1),
  titleEn: z.string().optional().nullable(),
  slug: z.string().optional(),
  order: z.coerce.number().int().default(0),
  published: z.boolean().default(false),
  whatIsIt: z.string().optional().nullable(),
  whyItMatters: z.string().optional().nullable(),
  howItWorks: z.string().optional().nullable(),
  mathBehindIt: z.string().optional().nullable(),
  realWorldEx: z.string().optional().nullable(),
  codeExample: z.string().optional().nullable(),
  codeLanguage: z.string().optional().nullable(),
  applications: z.string().optional().nullable(),
  hook: z.string().optional().nullable(),
  analogy: z.string().optional().nullable(),
  commonMistakes: z.string().optional().nullable(),
  comparison: z.string().optional().nullable(),
  quickSummary: z.string().optional().nullable(),
  quizData: z.string().optional().nullable(),
  seo: seoSchema,
});

export const publishSchema = z.object({
  published: z.boolean(),
});

export const seoUpdateSchema = z.object({
  metaTitle: z.string().optional().nullable(),
  metaDesc: z.string().optional().nullable(),
  keywords: z.string().optional().nullable(),
  ogImage: z.string().optional().nullable(),
  canonicalUrl: z.string().optional().nullable(),
});

export type SeoInput = z.infer<typeof seoSchema>;
export type CourseInput = z.infer<typeof courseSchema>;
export type ChapterInput = z.infer<typeof chapterSchema>;
export type TopicInput = z.infer<typeof topicSchema>;
export type SubtopicInput = z.infer<typeof subtopicSchema>;
