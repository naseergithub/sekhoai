"use client";

import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

const courseLinks = [
  { href: "/courses", label: "تمام کورسز" },
  { href: "/courses", label: "AI کا تعارف" },
  { href: "/courses", label: "مشین لرننگ" },
];

const helpLinks = [
  { href: "/about", label: "اکثر پوچھے گئے سوالات" },
  { href: "/about", label: "ہم سے رابطہ" },
  { href: "/about", label: "رازداری کی پالیسی" },
];

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .6 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.3.6 9.3.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07c0 6.02 4.39 11.01 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.89v2.27h3.32l-.53 3.49h-2.79v8.44C19.61 23.08 24 18.09 24 12.07z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.43.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.43.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.43-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.43-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.77.3-1.43.7-2.08 1.35A5.86 5.86 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.77.7 1.43 1.35 2.08.65.65 1.31 1.05 2.08 1.35.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.86 5.86 0 0 0 2.08-1.35 5.86 5.86 0 0 0 1.35-2.08c.3-.76.5-1.64.56-2.91.06-1.28.07-1.67.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.86 5.86 0 0 0-1.35-2.08A5.86 5.86 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.41-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" />
    </svg>
  );
}

const socialLinks = [
  {
    href: "#",
    label: "YouTube",
    icon: YoutubeIcon,
    hoverClass: "hover:bg-red-600",
  },
  {
    href: "#",
    label: "Facebook",
    icon: FacebookIcon,
    hoverClass: "hover:bg-blue-600",
  },
  {
    href: "#",
    label: "Instagram",
    icon: InstagramIcon,
    hoverClass:
      "hover:bg-gradient-to-br hover:from-purple-600 hover:via-pink-500 hover:to-orange-400",
  },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="container-public grid gap-10 py-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 text-white">
              <GraduationCap className="h-6 w-6" aria-hidden />
            </span>
            <span className="text-h4 font-bold text-white">سیکھیں AI</span>
          </div>
          <p className="mb-6 max-w-md text-body leading-[1.9] text-slate-400">
            پاکستان کا پہلا مکمل مصنوعی ذہانت کا کورس اردو زبان میں — بنیادی سے
            اعلی درجے تک مفت تعلیم۔
          </p>
          <div className="flex gap-3">
            {socialLinks.map(({ href, label, icon: Icon, hoverClass }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-300 transition-colors",
                  hoverClass,
                )}
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          <h4 className="mb-4 text-h4 font-semibold text-white">کورسز</h4>
          <ul className="space-y-2">
            {courseLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-small text-slate-400 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h4 className="mb-4 text-h4 font-semibold text-white">مدد</h4>
          <ul className="space-y-2">
            {helpLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-small text-slate-400 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h4 className="mb-4 text-h4 font-semibold text-white">
            نئے اسباق کی اطلاع پائیں
          </h4>
          <form
            className="flex flex-col gap-2 sm:flex-row"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="آپ کا ای میل"
              className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 font-sans text-small text-white placeholder:text-slate-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              dir="ltr"
            />
            <button
              type="submit"
              className="inline-flex shrink-0 items-center justify-center rounded-button bg-primary px-4 py-2 font-sans text-small font-medium text-white shadow-sm transition-all duration-200 hover:bg-primary-dark active:scale-95"
            >
              سبسکرائب
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="container-public flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="text-small text-slate-500">
            Made with ❤️ for Pakistan
          </p>
          <p className="text-small text-slate-500">
            © {new Date().getFullYear()} سیکھیں AI — جملہ حقوق محفوظ ہیں
          </p>
        </div>
      </div>
    </footer>
  );
}
