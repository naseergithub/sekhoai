import Link from "next/link";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-primary text-white shadow-sm hover:bg-primary-dark active:shadow-none",
  secondary:
    "border border-primary text-primary hover:bg-blue-50 dark:hover:bg-blue-950/40",
  ghost:
    "text-text-muted hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800",
  danger:
    "bg-red-600 text-white shadow-sm hover:bg-red-700 active:shadow-none",
} as const;

const sizes = {
  sm: "px-4 py-2 text-small rounded-button",
  md: "px-6 py-3 text-body rounded-button",
  lg: "px-8 py-3.5 text-body-lg rounded-button",
} as const;

type ButtonVariant = keyof typeof variants;
type ButtonSize = keyof typeof sizes;

type BaseProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = BaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = BaseProps &
  Omit<React.ComponentProps<typeof Link>, "className"> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export default function Button({
  variant = "primary",
  size = "md",
  icon: Icon,
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 font-sans font-medium transition-all duration-200 active:scale-95",
    variants[variant],
    sizes[size],
    className,
  );

  const content = (
    <>
      <span>{children}</span>
      {Icon && <Icon className="h-4 w-4 shrink-0" aria-hidden />}
    </>
  );

  if ("href" in props && props.href) {
    const { href, ...linkProps } = props;
    return (
      <Link href={href} className={classes} {...linkProps}>
        {content}
      </Link>
    );
  }

  const buttonProps = props as ButtonAsButton;
  return (
    <button type="button" className={classes} {...buttonProps}>
      {content}
    </button>
  );
}
