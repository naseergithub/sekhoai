import { clsx, type ClassValue } from "clsx";
import slugify from "slugify";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(text: string): string {
  return slugify(text, {
    lower: false,
    strict: true,
    locale: "ur",
  });
}

export function generateSlugFromEnglish(text: string): string {
  return slugify(text, {
    lower: true,
    strict: true,
  });
}

const urduDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export function toUrduNumeral(value: number): string {
  return String(value).replace(/\d/g, (digit) => urduDigits[Number(digit)] ?? digit);
}

export function estimateReadingTime(topicCount: number): string {
  const minutes = topicCount * 5;
  return `${toUrduNumeral(minutes)} منٹ`;
}

export const COURSE_GRADIENTS = [
  "from-blue-500 to-violet-600",
  "from-teal-500 to-blue-600",
  "from-violet-500 to-pink-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
] as const;

export const COURSE_LEVELS = ["ابتدائی", "درمیانہ", "اعلی"] as const;
