import Papa from "papaparse";
import { generateSlugFromEnglish } from "@/lib/utils";

export interface CsvRow {
  course_title: string;
  course_title_en: string;
  course_description: string;
  chapter_title: string;
  chapter_title_en: string;
  chapter_order: string;
  topic_title: string;
  topic_title_en: string;
  topic_order: string;
  subtopic_title: string;
  subtopic_title_en: string;
  subtopic_order: string;
}

export interface ParsedImport {
  courses: {
    title: string;
    titleEn: string;
    slug: string;
    description: string;
    chapters: {
      title: string;
      titleEn: string;
      slug: string;
      order: number;
      topics: {
        title: string;
        titleEn: string;
        slug: string;
        order: number;
        subtopics: {
          title: string;
          titleEn: string;
          slug: string;
          order: number;
        }[];
      }[];
    }[];
  }[];
  totalCourses: number;
  totalChapters: number;
  totalTopics: number;
  totalSubtopics: number;
  errors: string[];
}

const REQUIRED_COLUMNS: (keyof CsvRow)[] = [
  "course_title",
  "course_title_en",
  "course_description",
  "chapter_title",
  "chapter_title_en",
  "chapter_order",
  "topic_title",
  "topic_title_en",
  "topic_order",
  "subtopic_title",
  "subtopic_title_en",
  "subtopic_order",
];

const ROW_FIELDS: { key: keyof CsvRow; label: string }[] = [
  { key: "course_title", label: "course_title" },
  { key: "course_title_en", label: "course_title_en" },
  { key: "course_description", label: "course_description" },
  { key: "chapter_title", label: "chapter_title" },
  { key: "chapter_title_en", label: "chapter_title_en" },
  { key: "chapter_order", label: "chapter_order" },
  { key: "topic_title", label: "topic_title" },
  { key: "topic_title_en", label: "topic_title_en" },
  { key: "topic_order", label: "topic_order" },
  { key: "subtopic_title", label: "subtopic_title" },
  { key: "subtopic_title_en", label: "subtopic_title_en" },
  { key: "subtopic_order", label: "subtopic_order" },
];

function parseOrder(value: string, rowNum: number, field: string, errors: string[]): number | null {
  const trimmed = value.trim();
  if (!trimmed) {
    errors.push(`Row ${rowNum}: ${field} is empty`);
    return null;
  }
  const num = Number(trimmed);
  if (!Number.isFinite(num) || num < 0) {
    errors.push(`Row ${rowNum}: ${field} is not a valid number`);
    return null;
  }
  return Math.floor(num);
}

function countTotals(courses: ParsedImport["courses"]) {
  let totalChapters = 0;
  let totalTopics = 0;
  let totalSubtopics = 0;

  for (const course of courses) {
    totalChapters += course.chapters.length;
    for (const chapter of course.chapters) {
      totalTopics += chapter.topics.length;
      for (const topic of chapter.topics) {
        totalSubtopics += topic.subtopics.length;
      }
    }
  }

  return {
    totalCourses: courses.length,
    totalChapters,
    totalTopics,
    totalSubtopics,
  };
}

export function parseCsvImport(csvText: string): ParsedImport {
  const errors: string[] = [];

  const parsed = Papa.parse<CsvRow>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  });

  if (parsed.errors.length > 0) {
    for (const err of parsed.errors) {
      errors.push(err.message ?? "CSV parsing error");
    }
  }

  const headers = parsed.meta.fields ?? [];
  for (const col of REQUIRED_COLUMNS) {
    if (!headers.includes(col)) {
      errors.push(`Missing column: ${col}`);
    }
  }

  if (errors.length > 0) {
    return {
      courses: [],
      totalCourses: 0,
      totalChapters: 0,
      totalTopics: 0,
      totalSubtopics: 0,
      errors,
    };
  }

  const courseMap = new Map<
    string,
    {
      title: string;
      titleEn: string;
      slug: string;
      description: string;
      chapters: Map<
        string,
        {
          title: string;
          titleEn: string;
          slug: string;
          order: number;
          topics: Map<
            string,
            {
              title: string;
              titleEn: string;
              slug: string;
              order: number;
              subtopics: Map<
                string,
                { title: string; titleEn: string; slug: string; order: number }
              >;
            }
          >;
        }
      >;
    }
  >();

  const rows = parsed.data;
  rows.forEach((row, index) => {
    const rowNum = index + 2;

    for (const { key, label } of ROW_FIELDS) {
      const val = row[key];
      if (val === undefined || String(val).trim() === "") {
        errors.push(`Row ${rowNum}: ${label} is empty`);
      }
    }

    if (errors.some((e) => e.startsWith(`Row ${rowNum}:`))) {
      return;
    }

    const courseSlug = generateSlugFromEnglish(row.course_title_en);
    const chapterSlug = generateSlugFromEnglish(row.chapter_title_en);
    const topicSlug = generateSlugFromEnglish(row.topic_title_en);
    const subtopicSlug = generateSlugFromEnglish(row.subtopic_title_en);

    if (!courseSlug || !chapterSlug || !topicSlug || !subtopicSlug) {
      errors.push(`Row ${rowNum}: could not generate slug from English title`);
      return;
    }

    const chapterOrder = parseOrder(
      row.chapter_order,
      rowNum,
      "chapter_order",
      errors,
    );
    const topicOrder = parseOrder(row.topic_order, rowNum, "topic_order", errors);
    const subtopicOrder = parseOrder(
      row.subtopic_order,
      rowNum,
      "subtopic_order",
      errors,
    );

    if (
      chapterOrder === null ||
      topicOrder === null ||
      subtopicOrder === null
    ) {
      return;
    }

    if (!courseMap.has(courseSlug)) {
      courseMap.set(courseSlug, {
        title: row.course_title.trim(),
        titleEn: row.course_title_en.trim(),
        slug: courseSlug,
        description: row.course_description.trim(),
        chapters: new Map(),
      });
    }

    const course = courseMap.get(courseSlug)!;

    if (!course.chapters.has(chapterSlug)) {
      course.chapters.set(chapterSlug, {
        title: row.chapter_title.trim(),
        titleEn: row.chapter_title_en.trim(),
        slug: chapterSlug,
        order: chapterOrder,
        topics: new Map(),
      });
    }

    const chapter = course.chapters.get(chapterSlug)!;

    if (!chapter.topics.has(topicSlug)) {
      chapter.topics.set(topicSlug, {
        title: row.topic_title.trim(),
        titleEn: row.topic_title_en.trim(),
        slug: topicSlug,
        order: topicOrder,
        subtopics: new Map(),
      });
    }

    const topic = chapter.topics.get(topicSlug)!;

    if (topic.subtopics.has(subtopicSlug)) {
      errors.push(
        `Row ${rowNum}: subtopic slug "${subtopicSlug}" already exists in this topic`,
      );
      return;
    }

    topic.subtopics.set(subtopicSlug, {
      title: row.subtopic_title.trim(),
      titleEn: row.subtopic_title_en.trim(),
      slug: subtopicSlug,
      order: subtopicOrder,
    });
  });

  const courses = Array.from(courseMap.values()).map((course) => ({
    title: course.title,
    titleEn: course.titleEn,
    slug: course.slug,
    description: course.description,
    chapters: Array.from(course.chapters.values()).map((chapter) => ({
      title: chapter.title,
      titleEn: chapter.titleEn,
      slug: chapter.slug,
      order: chapter.order,
      topics: Array.from(chapter.topics.values()).map((topic) => ({
        title: topic.title,
        titleEn: topic.titleEn,
        slug: topic.slug,
        order: topic.order,
        subtopics: Array.from(topic.subtopics.values()).sort(
          (a, b) => a.order - b.order,
        ),
      })),
    })),
  }));

  const totals = countTotals(courses);

  return {
    courses,
    ...totals,
    errors,
  };
}

export const CSV_COLUMN_SPEC = REQUIRED_COLUMNS;

export function generateSampleCsv(): string {
  const headers = REQUIRED_COLUMNS.join(",");
  const rows = [
    [
      "مصنوعی ذہانت کا تعارف",
      "Introduction to AI",
      "AI کے بنیادی تصورات سیکھیں",
      "AI کیا ہے؟",
      "What is AI",
      "1",
      "تعارف",
      "Introduction",
      "1",
      "AI کی تعریف",
      "Definition of AI",
      "1",
    ],
    [
      "مصنوعی ذہانت کا تعارف",
      "Introduction to AI",
      "AI کے بنیادی تصورات سیکھیں",
      "AI کیا ہے؟",
      "What is AI",
      "1",
      "تعارف",
      "Introduction",
      "1",
      "AI کی تاریخ",
      "History of AI",
      "2",
    ],
    [
      "مصنوعی ذہانت کا تعارف",
      "Introduction to AI",
      "AI کے بنیادی تصورات سیکھیں",
      "AI کیا ہے؟",
      "What is AI",
      "1",
      "اقسام",
      "Types of AI",
      "2",
      "Narrow AI",
      "Narrow AI",
      "1",
    ],
  ];
  return [headers, ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join(
    "\n",
  );
}
