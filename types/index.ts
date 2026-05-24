import type {
  AgentLog,
  Chapter,
  Course,
  SeoMeta,
  Subtopic,
  Topic,
  User,
} from "@prisma/client";

export type { AgentLog, Chapter, Course, SeoMeta, Subtopic, Topic, User };

export type CourseWithChapters = Course & {
  chapters: (Chapter & { topics: Topic[] })[];
};

export type TopicWithSubtopics = Topic & {
  subtopics: Subtopic[];
  chapter: Chapter & { course: Course };
};

export type SubtopicWithRelations = Subtopic & {
  topic: Topic & { chapter: Chapter & { course: Course } };
  seoMeta: SeoMeta | null;
};

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export function parseQuizData(quizData: string | null): QuizQuestion[] {
  if (!quizData) return [];
  try {
    const parsed = JSON.parse(quizData);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}
