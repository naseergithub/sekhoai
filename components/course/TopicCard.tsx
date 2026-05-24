import Link from "next/link";
import { ChevronLeft, FileText } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";

type TopicCardProps = {
  title: string;
  slug: string;
  subtopicCount: number;
};

export default function TopicCard({ title, slug, subtopicCount }: TopicCardProps) {
  return (
    <Link href={`/topic/${slug}`} className="block">
      <Card
        hoverable
        className="group flex items-center justify-between !p-4"
      >
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 shrink-0 text-primary" aria-hidden />
          <h3 className="text-body font-semibold text-text-primary group-hover:text-primary">
            {title}
          </h3>
          <Badge variant="primary">{subtopicCount} ذیلی موضوعات</Badge>
        </div>
        <ChevronLeft
          className="h-5 w-5 shrink-0 text-text-muted transition-transform group-hover:-translate-x-1 group-hover:text-primary"
          aria-hidden
        />
      </Card>
    </Link>
  );
}
