import SubtopicLessonNav from "@/components/subtopic/SubtopicLessonNav";
import type { SubtopicNavItem } from "@/lib/db/queries";

type SubtopicBottomNavProps = {
  prev: SubtopicNavItem | null;
  next: SubtopicNavItem | null;
  siblingIndex: number;
  siblingTotal: number;
  topicSlug: string;
};

/** @deprecated Use SubtopicLessonNav directly — thin wrapper for bottom placement */
export default function SubtopicBottomNav(props: SubtopicBottomNavProps) {
  return <SubtopicLessonNav {...props} variant="full" />;
}
