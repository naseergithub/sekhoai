import { getSiteUrl } from "@/lib/seo/site";

export type BreadcrumbItem = {
  name: string;
  url: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

type CourseForSchema = {
  title: string;
  description: string;
  chapters: { title: string }[];
};

type SubtopicForArticleSchema = {
  title: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  seoMeta?: {
    metaDesc?: string | null;
  } | null;
};

export function buildCourseSchema(course: CourseForSchema) {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.description,
    provider: {
      "@type": "Organization",
      name: "سیکھیں AI",
      url: siteUrl,
    },
    inLanguage: "ur",
    isAccessibleForFree: true,
    educationalLevel: "Beginner to Advanced",
    teaches: course.chapters.map((c) => c.title),
  };
}

export function buildArticleSchema(subtopic: SubtopicForArticleSchema) {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: subtopic.title,
    description: subtopic.seoMeta?.metaDesc ?? subtopic.title,
    inLanguage: "ur",
    author: {
      "@type": "Organization",
      name: "سیکھیں AI",
    },
    publisher: {
      "@type": "Organization",
      name: "سیکھیں AI",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
    datePublished: subtopic.createdAt.toISOString(),
    dateModified: subtopic.updatedAt.toISOString(),
    mainEntityOfPage: `${siteUrl}/subtopic/${subtopic.slug}`,
  };
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildFaqSchema(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

type QuizQuestionForSchema = {
  question: string;
  options: string[];
  correctIndex: number;
};

export function buildQuizSchema(
  title: string,
  questions: QuizQuestionForSchema[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: `${title} — سوالات`,
    educationalLevel: "Beginner",
    inLanguage: "ur",
    hasPart: questions.map((q) => ({
      "@type": "Question",
      text: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.options[q.correctIndex] ?? "",
      },
    })),
  };
}

export function parseFaqData(faqData: string | null | undefined): FaqItem[] {
  if (!faqData?.trim()) return [];
  try {
    const parsed = JSON.parse(faqData) as FaqItem[] | { faqQuestions?: FaqItem[] };
    if (Array.isArray(parsed)) return parsed;
    if (parsed.faqQuestions && Array.isArray(parsed.faqQuestions)) {
      return parsed.faqQuestions;
    }
    return [];
  } catch {
    return [];
  }
}
