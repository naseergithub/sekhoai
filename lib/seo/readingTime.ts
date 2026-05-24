import { toUrduNumeral } from "@/lib/utils";

export function estimateReadingTimeMinutes(texts: (string | null | undefined)[]): number {
  const combined = texts.filter(Boolean).join(" ");
  const words = combined.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

/** Urdu reading speed ~100 words per minute */
export function estimateReadingTimeMinutesUrdu(
  texts: (string | null | undefined)[],
): number {
  const combined = texts.filter(Boolean).join(" ");
  const words = combined.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 100));
}

export function formatReadingTimeUrdu(minutes: number): string {
  return `پڑھنے کا وقت: ${toUrduNumeral(minutes)} منٹ`;
}

/** Urdu reading speed ~100 words per minute; +2 min when quiz present */
export function estimateSubtopicReadingMinutes(
  texts: (string | null | undefined)[],
  hasQuiz = false,
): number {
  const combined = texts.filter(Boolean).join(" ");
  const words = combined.trim().split(/\s+/).filter(Boolean).length;
  const readingMinutes = Math.max(1, Math.ceil(words / 100));
  return hasQuiz ? readingMinutes + 2 : readingMinutes;
}

export function formatSubtopicReadingTimeUrdu(
  texts: (string | null | undefined)[],
  hasQuiz = false,
): string {
  return formatReadingTimeUrdu(estimateSubtopicReadingMinutes(texts, hasQuiz));
}

export function formatReadingTimeUrduFromTexts(
  texts: (string | null | undefined)[],
): string {
  return formatReadingTimeUrdu(estimateReadingTimeMinutesUrdu(texts));
}
