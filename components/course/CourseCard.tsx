import Image from "next/image";
import { BookOpen } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { toUrduNumeral } from "@/lib/utils";

type CourseCardProps = {
  title: string;
  description: string;
  slug: string;
  thumbnail?: string | null;
  chapterCount: number;
  published: boolean;
};

export default function CourseCard({
  title,
  description,
  slug,
  thumbnail,
  chapterCount,
}: CourseCardProps) {
  return (
    <Card hoverable padding="p-0" className="group flex flex-col overflow-hidden">
      <div className="relative aspect-video bg-gradient-to-br from-blue-50 to-violet-50 dark:from-slate-800 dark:to-slate-900">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <BookOpen className="h-16 w-16 text-primary/40" aria-hidden />
          </div>
        )}
        <Badge className="absolute bottom-3 start-3 bg-card/95 font-sans shadow-sm">
          ابواب: {toUrduNumeral(chapterCount)}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="mb-2 text-h4 font-bold text-text-primary">{title}</h3>
        <p className="mb-4 line-clamp-3 flex-1 text-urdu-body text-text-muted">
          {description}
        </p>
        <Button href={`/courses/${slug}`} size="sm" className="w-full justify-center">
          مزید دیکھیں
        </Button>
      </div>
    </Card>
  );
}
