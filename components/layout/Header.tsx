"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BookOpen,
  GraduationCap,
  Home,
  Info,
  Menu,
  Sparkles,
  X,
} from "lucide-react";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "گھر", icon: Home },
  { href: "/courses", label: "کورسز", icon: BookOpen },
  { href: "/about", label: "ہمارے بارے میں", icon: Info },
] as const;

function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}

function NavLink({
  href,
  label,
  icon: Icon,
  onClick,
  className,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  className?: string;
}) {
  const pathname = usePathname();
  const isActive =
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "nav-text-urdu inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[0.9375rem] font-medium transition-all",
        isActive
          ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
        className,
      )}
    >
      <Icon className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
      <span className="block">{label}</span>
    </Link>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrolled = useScrolled();

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 min-h-[var(--header-height)] overflow-visible border-b py-3 transition-all duration-300",
        scrolled
          ? "border-slate-200/90 bg-white/95 shadow-sm shadow-slate-200/50 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95 dark:shadow-slate-950/50"
          : "border-transparent bg-white/80 backdrop-blur-md dark:bg-slate-950/80",
      )}
    >
      <div className="container-public flex min-h-[calc(var(--header-height)-1.5rem)] items-center justify-between gap-4 overflow-visible">
        <Link
          href="/"
          className="group flex min-w-0 shrink-0 items-center gap-3 overflow-visible py-1"
          onClick={() => setMobileOpen(false)}
        >
          <span className="relative shrink-0 overflow-visible p-0.5">
            <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/30 transition-transform group-hover:scale-[1.02]">
              <GraduationCap className="h-5 w-5" aria-hidden />
            </span>
            <span
              className="absolute -bottom-1 -end-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-950"
              aria-hidden
            >
              <Sparkles className="h-2.5 w-2.5 text-white" />
            </span>
          </span>
          <span className="hidden min-w-0 overflow-visible sm:block">
            <span className="nav-brand-title block truncate">سیکھیں AI</span>
            <span className="nav-brand-subtitle block truncate">
              اردو میں مصنوعی ذہانت
            </span>
          </span>
        </Link>

        <nav
          className="hidden items-center gap-1 overflow-visible lg:flex"
          aria-label="اہم نیویگیشن"
        >
          {navLinks.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle />

          <Link
            href="/courses"
            className="nav-text-urdu hidden items-center gap-2 rounded-xl bg-gradient-to-l from-blue-600 to-violet-600 px-5 py-3 text-[0.9375rem] font-semibold text-white shadow-md shadow-blue-500/25 transition-all hover:shadow-lg hover:shadow-blue-500/30 md:inline-flex"
          >
            <span className="block">مفت شروع کریں</span>
            <Sparkles className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
          </Link>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-slate-50 text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 lg:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "مینو بند کریں" : "مینو کھولیں"}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-0 top-[var(--header-height)] z-40 bg-slate-900/50 backdrop-blur-sm transition-opacity lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setMobileOpen(false)}
        aria-hidden
      />

      <nav
        className={cn(
          "fixed inset-y-0 end-0 top-[var(--header-height)] z-50 flex w-full max-w-xs flex-col border-s border-slate-200 bg-white shadow-2xl transition-transform duration-300 ease-out dark:border-slate-800 dark:bg-slate-900 lg:hidden",
          mobileOpen ? "translate-x-0" : "translate-x-full",
        )}
        aria-label="موبائل مینو"
      >
        <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          <p className="nav-text-urdu text-xs font-medium text-slate-400">
            مینو
          </p>
        </div>

        <ul className="flex-1 overflow-y-auto px-3 py-4">
          {navLinks.map((link) => (
            <li key={link.href} className="mb-1">
              <NavLink
                {...link}
                onClick={() => setMobileOpen(false)}
                className="w-full justify-start px-4 py-3.5 text-base"
              />
            </li>
          ))}
        </ul>

        <div className="border-t border-slate-100 p-4 dark:border-slate-800">
          <Link
            href="/courses"
            onClick={() => setMobileOpen(false)}
            className="nav-text-urdu flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-blue-600 to-violet-600 py-3.5 text-[0.9375rem] font-semibold text-white shadow-lg shadow-blue-500/25"
          >
            <Sparkles className="h-4 w-4 shrink-0" aria-hidden />
            <span className="block">مفت شروع کریں</span>
          </Link>
          <p className="nav-text-urdu mt-3 text-center text-xs text-slate-400">
            پاکستان کا پہلا اردو AI کورس
          </p>
        </div>
      </nav>
    </header>
  );
}
