import Link from "next/link";
import { Layers } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { toUrduNumeral } from "@/lib/utils";

type ChapterCardProps = {
  title: string;
  description?: string | null;
  slug: string;
  topicCount: number;
  order: number;
};

export default function ChapterCard({
  title,
  description,
  slug,
  topicCount,
  order,
}: ChapterCardProps) {
  return (
    <Link href={`/chapter/${slug}`} className="block">
      <Card hoverable className="group flex gap-4 !p-5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-100 font-sans text-2xl font-bold text-primary dark:bg-blue-950 dark:text-blue-300">
          {toUrduNumeral(order)}
        </div>
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            <Layers className="h-4 w-4 text-accent" aria-hidden />
            <h3 className="text-h4 font-bold text-text-primary group-hover:text-primary">
              {title}
            </h3>
          </div>
          {description && (
            <p className="mb-2 line-clamp-2 text-small text-text-muted">
              {description}
            </p>
          )}
          <Badge variant="info">{toUrduNumeral(topicCount)} موضوعات</Badge>
        </div>
      </Card>
    </Link>
  );
}
