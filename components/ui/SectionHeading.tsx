import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
};

export default function SectionHeading({
  title,
  subtitle,
  centered = false,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        centered ? "text-center" : "text-right",
        className,
      )}
    >
      <h2 className="section-title-urdu">{title}</h2>
      {subtitle && (
        <p className="body-urdu-comfort mt-4 text-base">{subtitle}</p>
      )}
      <div
        className={cn(
          "mt-4 h-1 w-16 rounded bg-primary",
          centered ? "mx-auto" : "ms-auto",
        )}
        aria-hidden
      />
    </div>
  );
}
