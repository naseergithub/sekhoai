import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import HomePageSections from "@/components/home/HomePageSections";
import HomeSeoSections from "@/components/home/HomeSeoSections";
import {
  getPublishedCoursesWithChapterCount,
  getPublishedStats,
} from "@/lib/db/queries";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "سیکھیں AI | اردو میں مصنوعی ذہانت سیکھیں — مفت AI کورس پاکستان",
  description:
    "پاکستان کا پہلا مکمل اردو AI کورس۔ مصنوعی ذہانت، مشین لرننگ، Python، اور ڈیپ لرننگ مفت سیکھیں — بنیادی سے اعلیٰ درجے تک، حقیقی مثالوں کے ساتھ۔",
  keywords: [
    "اردو میں AI سیکھیں",
    "مصنوعی ذہانت اردو",
    "مشین لرننگ اردو",
    "Python اردو",
    "AI کورس پاکستان",
    "مفت AI کورس",
    "سیکھیں AI",
    "ڈیپ لرننگ اردو",
    "ڈیٹا سائنس اردو",
  ],
  openGraph: {
    title: "سیکھیں AI — اردو میں مصنوعی ذہانت کا مفت کورس",
    description:
      "اردو میں AI، مشین لرننگ، اور Python سیکھیں۔ پاکستان کے لیے تیار کردہ مفت آن لائن کورس۔",
    locale: "ur_PK",
    type: "website",
  },
  alternates: {
    canonical: "/",
  },
};

export default async function HomePage() {
  const [courses, stats] = await Promise.all([
    getPublishedCoursesWithChapterCount(),
    getPublishedStats(),
  ]);

  const courseItems = courses.map((course) => ({
    id: course.id,
    title: course.title,
    description: course.description,
    slug: course.slug,
    chapterCount: course._count.chapters,
  }));

  return (
    <div className="-mx-4 w-[calc(100%+2rem)] sm:-mx-6 sm:w-[calc(100%+3rem)] lg:-mx-8 lg:w-[calc(100%+4rem)]">
      <HeroSection
        chapterCount={stats.chapterCount}
        topicCount={stats.topicCount}
      />
      <HomePageSections courses={courseItems} />
      <HomeSeoSections />
    </div>
  );
}
