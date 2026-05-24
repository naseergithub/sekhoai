import type { ParsedImport } from "@/lib/utils/csvParser";
import { prisma } from "@/lib/db/prisma";
export type ImportResults = {
  coursesCreated: number;
  coursesSkipped: number;
  chaptersCreated: number;
  chaptersSkipped: number;
  topicsCreated: number;
  topicsSkipped: number;
  subtopicsCreated: number;
  subtopicsSkipped: number;
};

export type ExistingSlugCounts = {
  courses: number;
  chapters: number;
  topics: number;
  subtopics: number;
  total: number;
};

export function collectSlugs(parsed: ParsedImport) {
  const courseSlugs: string[] = [];
  const chapterSlugs: string[] = [];
  const topicSlugs: string[] = [];
  const subtopicSlugs: string[] = [];

  for (const course of parsed.courses) {
    courseSlugs.push(course.slug);
    for (const chapter of course.chapters) {
      chapterSlugs.push(chapter.slug);
      for (const topic of chapter.topics) {
        topicSlugs.push(topic.slug);
        for (const subtopic of topic.subtopics) {
          subtopicSlugs.push(subtopic.slug);
        }
      }
    }
  }

  return { courseSlugs, chapterSlugs, topicSlugs, subtopicSlugs };
}

export async function countExistingSlugs(
  parsed: ParsedImport,
): Promise<ExistingSlugCounts> {
  const { courseSlugs, chapterSlugs, topicSlugs, subtopicSlugs } =
    collectSlugs(parsed);

  const [courses, chapters, topics, subtopics] = await Promise.all([
    courseSlugs.length
      ? prisma.course.count({ where: { slug: { in: courseSlugs } } })
      : 0,
    chapterSlugs.length
      ? prisma.chapter.count({ where: { slug: { in: chapterSlugs } } })
      : 0,
    topicSlugs.length
      ? prisma.topic.count({ where: { slug: { in: topicSlugs } } })
      : 0,
    subtopicSlugs.length
      ? prisma.subtopic.count({ where: { slug: { in: subtopicSlugs } } })
      : 0,
  ]);

  return {
    courses,
    chapters,
    topics,
    subtopics,
    total: courses + chapters + topics + subtopics,
  };
}

export async function runCsvImport(
  parsed: ParsedImport,
): Promise<ImportResults> {
  const results: ImportResults = {
    coursesCreated: 0,
    coursesSkipped: 0,
    chaptersCreated: 0,
    chaptersSkipped: 0,
    topicsCreated: 0,
    topicsSkipped: 0,
    subtopicsCreated: 0,
    subtopicsSkipped: 0,
  };

  await prisma.$transaction(
    async (tx) => {
      for (let courseIndex = 0; courseIndex < parsed.courses.length; courseIndex++) {
        const course = parsed.courses[courseIndex]!;

        const existingCourse = await tx.course.findUnique({
          where: { slug: course.slug },
        });

        let courseRecord;
        if (existingCourse) {
          courseRecord = existingCourse;
          results.coursesSkipped++;
        } else {
          courseRecord = await tx.course.create({
            data: {
              title: course.title,
              titleEn: course.titleEn,
              slug: course.slug,
              description: course.description,
              published: false,
              order: courseIndex + 1,
            },
          });
          results.coursesCreated++;
        }

        for (const chapter of course.chapters) {
          const existingChapter = await tx.chapter.findUnique({
            where: { slug: chapter.slug },
          });

          let chapterRecord;
          if (existingChapter) {
            chapterRecord = existingChapter;
            results.chaptersSkipped++;
          } else {
            chapterRecord = await tx.chapter.create({
              data: {
                title: chapter.title,
                titleEn: chapter.titleEn,
                slug: chapter.slug,
                order: chapter.order,
                published: false,
                courseId: courseRecord.id,
              },
            });
            results.chaptersCreated++;
          }

          for (const topic of chapter.topics) {
            const existingTopic = await tx.topic.findUnique({
              where: { slug: topic.slug },
            });

            let topicRecord;
            if (existingTopic) {
              topicRecord = existingTopic;
              results.topicsSkipped++;
            } else {
              topicRecord = await tx.topic.create({
                data: {
                  title: topic.title,
                  titleEn: topic.titleEn,
                  slug: topic.slug,
                  order: topic.order,
                  published: false,
                  chapterId: chapterRecord.id,
                },
              });
              results.topicsCreated++;
            }

            for (const subtopic of topic.subtopics) {
              const existingSubtopic = await tx.subtopic.findUnique({
                where: { slug: subtopic.slug },
              });

              if (existingSubtopic) {
                results.subtopicsSkipped++;
              } else {
                await tx.subtopic.create({
                  data: {
                    title: subtopic.title,
                    titleEn: subtopic.titleEn,
                    slug: subtopic.slug,
                    order: subtopic.order,
                    published: false,
                    topicId: topicRecord.id,
                  },
                });
                results.subtopicsCreated++;
              }
            }
          }
        }
      }
    },
    { timeout: 120_000 },
  );

  return results;
}

export type ParsedImportPreview = ParsedImport & {
  existingSlugs: ExistingSlugCounts;
};
