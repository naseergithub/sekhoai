import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav
      aria-label="بریڈکرمب"
      className="sticky top-[var(--header-height)] z-40 border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
    >
      <ol className="container-public flex flex-wrap items-center gap-2 py-4">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {index > 0 && (
                <ChevronLeft
                  className="h-3.5 w-3.5 rotate-180 text-slate-400"
                  aria-hidden
                />
              )}
              {isLast || !item.href ? (
                <span className="nav-text-urdu text-small font-medium text-slate-900 dark:text-text-primary">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="nav-text-urdu text-small text-blue-600 transition-colors hover:text-blue-700 hover:underline dark:text-blue-400"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
