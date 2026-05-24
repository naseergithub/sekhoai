import { prisma } from "@/lib/db/prisma";

export async function getPublishedCoursesWithChapterCount() {
  return prisma.course.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    include: {
      _count: {
        select: {
          chapters: { where: { published: true } },
        },
      },
    },
  });
}

export async function getPublishedStats() {
  const [chapterCount, topicCount, courseCount] = await Promise.all([
    prisma.chapter.count({ where: { published: true } }),
    prisma.topic.count({ where: { published: true } }),
    prisma.course.count({ where: { published: true } }),
  ]);

  return { chapterCount, topicCount, courseCount };
}

export async function getPublishedCourseBySlug(slug: string) {
  return prisma.course.findFirst({
    where: { slug, published: true },
    include: {
      seoMeta: true,
      chapters: {
        where: { published: true },
        orderBy: { order: "asc" },
        include: {
          _count: {
            select: {
              topics: { where: { published: true } },
            },
          },
        },
      },
    },
  });
}

export async function getPublishedChapterBySlug(slug: string) {
  return prisma.chapter.findFirst({
    where: { slug, published: true },
    include: {
      seoMeta: true,
      course: true,
      topics: {
        where: { published: true },
        orderBy: { order: "asc" },
        include: {
          subtopics: {
            where: { published: true },
            orderBy: { order: "asc" },
            select: { id: true, title: true, slug: true },
          },
          _count: {
            select: {
              subtopics: { where: { published: true } },
            },
          },
        },
      },
    },
  });
}

export async function getPublishedTopicBySlug(slug: string) {
  return prisma.topic.findFirst({
    where: { slug, published: true },
    include: {
      seoMeta: true,
      subtopics: {
        where: { published: true },
        orderBy: { order: "asc" },
        select: {
          id: true,
          title: true,
          slug: true,
          order: true,
          published: true,
          aiGenerated: true,
        },
      },
      chapter: {
        include: { course: true },
      },
    },
  });
}

export async function getPublishedSubtopicBySlug(slug: string) {
  return prisma.subtopic.findFirst({
    where: { slug, published: true },
    include: {
      seoMeta: true,
      topic: {
        include: {
          chapter: {
            include: { course: true },
          },
        },
      },
    },
  });
}

export async function getPublishedSubtopicsInTopic(topicId: string) {
  return prisma.subtopic.findMany({
    where: { topicId, published: true },
    orderBy: { order: "asc" },
    select: { id: true, title: true, slug: true, order: true },
  });
}

export type SubtopicNavItem = {
  title: string;
  slug: string;
  /** e.g. next topic name when crossing topic boundary */
  context?: string;
};

/** Prev/next published lesson within topic, then across topics in the same chapter. */
export async function getSubtopicLessonNavigation(
  subtopicId: string,
  topicId: string,
  chapterId: string,
) {
  const [siblings, topics] = await Promise.all([
    getPublishedSubtopicsInTopic(topicId),
    prisma.topic.findMany({
      where: { chapterId, published: true },
      orderBy: { order: "asc" },
      select: {
        id: true,
        title: true,
        subtopics: {
          where: { published: true },
          orderBy: { order: "asc" },
          select: { id: true, title: true, slug: true },
        },
      },
    }),
  ]);

  const currentIndex = siblings.findIndex((s) => s.id === subtopicId);
  let prev: SubtopicNavItem | null = null;
  let next: SubtopicNavItem | null = null;

  if (currentIndex > 0) {
    const s = siblings[currentIndex - 1];
    prev = { title: s.title, slug: s.slug };
  }

  if (currentIndex >= 0 && currentIndex < siblings.length - 1) {
    const s = siblings[currentIndex + 1];
    next = { title: s.title, slug: s.slug };
  }

  const topicIndex = topics.findIndex((t) => t.id === topicId);

  if (!prev && topicIndex > 0) {
    const prevTopic = topics[topicIndex - 1];
    const last = prevTopic.subtopics[prevTopic.subtopics.length - 1];
    if (last) {
      prev = {
        title: last.title,
        slug: last.slug,
        context: prevTopic.title,
      };
    }
  }

  if (!next && topicIndex >= 0 && topicIndex < topics.length - 1) {
    const nextTopic = topics[topicIndex + 1];
    const first = nextTopic.subtopics[0];
    if (first) {
      next = {
        title: first.title,
        slug: first.slug,
        context: nextTopic.title,
      };
    }
  }

  return {
    prev,
    next,
    siblingIndex: currentIndex >= 0 ? currentIndex : 0,
    siblingTotal: siblings.length,
  };
}

export async function getRelatedSubtopics(
  topicId: string,
  excludeSubtopicId: string,
  limit = 3,
) {
  return prisma.subtopic.findMany({
    where: {
      topicId,
      published: true,
      NOT: { id: excludeSubtopicId },
    },
    orderBy: { order: "asc" },
    take: limit,
    select: { title: true, slug: true },
  });
}

export async function getNextPublishedChapter(
  courseId: string,
  afterOrder: number,
) {
  return prisma.chapter.findFirst({
    where: {
      courseId,
      published: true,
      order: { gt: afterOrder },
    },
    orderBy: { order: "asc" },
    select: { title: true, slug: true },
  });
}

export async function getPublishedTopicsInChapter(chapterId: string) {
  return prisma.topic.findMany({
    where: { chapterId, published: true },
    orderBy: { order: "asc" },
    select: { id: true, title: true, slug: true, order: true },
  });
}

export async function getCourseSidebarTree(courseId: string) {
  return prisma.course.findFirst({
    where: { id: courseId, published: true },
    select: {
      title: true,
      slug: true,
      chapters: {
        where: { published: true },
        orderBy: { order: "asc" },
        select: {
          id: true,
          title: true,
          slug: true,
          order: true,
          topics: {
            where: { published: true },
            orderBy: { order: "asc" },
            select: {
              id: true,
              title: true,
              slug: true,
              order: true,
              subtopics: {
                where: { published: true },
                orderBy: { order: "asc" },
                select: {
                  id: true,
                  title: true,
                  slug: true,
                },
              },
            },
          },
        },
      },
    },
  });
}
