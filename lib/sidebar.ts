export type SidebarChapter = {
  id: string;
  title: string;
  slug: string;
  order: number;
  topics: {
    id: string;
    title: string;
    slug: string;
    order: number;
    subtopics: { id: string; title: string; slug: string }[];
  }[];
};

export type SidebarProps = {
  course: { title: string; slug: string };
  chapters: SidebarChapter[];
  activeChapterSlug?: string;
  activeTopicSlug?: string;
  activeSubtopicSlug?: string;
};

export type SidebarTree = {
  title: string;
  slug: string;
  chapters: SidebarChapter[];
};

export function sidebarFromCourseTree(tree: SidebarTree): SidebarProps {
  return {
    course: { title: tree.title, slug: tree.slug },
    chapters: tree.chapters,
  };
}
