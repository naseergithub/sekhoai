import CoursesListingClient from "@/components/courses/CoursesListingClient";
import CoursesListingHero from "@/components/courses/CoursesListingHero";
import {
  COURSE_GRADIENTS,
  COURSE_LEVELS,
} from "@/lib/utils";
import {
  getPublishedCoursesWithChapterCount,
  getPublishedStats,
} from "@/lib/db/queries";

export const revalidate = 3600;

export const metadata = {
  title: "تمام AI کورسز — اردو میں مفت | سیکھیں AI",
  description:
    "اردو میں مصنوعی ذہانت، Python، اور مشین لرننگ کے مفت کورسز۔ ابتدائی سے اعلیٰ درجے تک — فلٹر کریں اور آج ہی سیکھنا شروع کریں۔",
  openGraph: {
    title: "تمام AI کورسز — سیکھیں AI",
    description: "اردو میں AI کے مفت کورسز — Python کوڈ اور عملی مثالیں۔",
  },
};

export default async function CoursesPage() {
  const [courses, stats] = await Promise.all([
    getPublishedCoursesWithChapterCount(),
    getPublishedStats(),
  ]);

  const courseItems = courses.map((course, index) => ({
    id: course.id,
    title: course.title,
    description: course.description,
    slug: course.slug,
    chapterCount: course._count.chapters,
    gradient: COURSE_GRADIENTS[index % COURSE_GRADIENTS.length],
    level: COURSE_LEVELS[index % COURSE_LEVELS.length],
  }));

  return (
    <div className="-mx-4 w-[calc(100%+2rem)] sm:-mx-6 sm:w-[calc(100%+3rem)] lg:-mx-8 lg:w-[calc(100%+4rem)]">
      <CoursesListingHero
        courseCount={stats.courseCount}
        chapterCount={stats.chapterCount}
        topicCount={stats.topicCount}
      />
      <CoursesListingClient courses={courseItems} />
    </div>
  );
}
