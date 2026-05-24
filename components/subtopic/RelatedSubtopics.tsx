import Link from "next/link";
import { ArrowLeft, BookOpen, Sparkles } from "lucide-react";

type RelatedItem = {
  title: string;
  slug: string;
};

export default function RelatedSubtopics({ items }: { items: RelatedItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="mt-12">
      <div className="mb-6">
        <p className="font-sans text-small font-medium text-violet-600 dark:text-violet-400">
          مزید سیکھیں
        </p>
        <h2 className="section-title-urdu mt-1 text-xl lg:text-2xl">
          اسی موضوع کے دیگر سبق
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={`/subtopic/${item.slug}`}
            className="group block rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-500/10 dark:border-slate-700/80 dark:bg-card dark:hover:border-violet-800/50"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-blue-100 dark:from-violet-950 dark:to-blue-950">
              <BookOpen
                className="h-5 w-5 text-violet-600 dark:text-violet-400"
                aria-hidden
              />
            </div>
            <h3 className="line-clamp-2 font-bold leading-[1.75] text-slate-900 transition-colors group-hover:text-violet-700 dark:text-text-primary dark:group-hover:text-violet-400">
              {item.title}
            </h3>
            <span className="mt-4 inline-flex items-center gap-2 font-sans text-small font-semibold text-violet-600 transition-all group-hover:gap-3 dark:text-violet-400">
              <Sparkles className="h-4 w-4" aria-hidden />
              سبق پڑھیں
              <ArrowLeft className="h-4 w-4" aria-hidden />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
