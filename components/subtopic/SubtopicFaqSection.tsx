"use client";

import { useState } from "react";
import { ChevronDown, MessageCircle } from "lucide-react";
import type { FaqItem } from "@/lib/seo/structuredData";
import { cn } from "@/lib/utils";

export default function SubtopicFaqSection({ faqs }: { faqs: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (faqs.length === 0) return null;

  return (
    <section
      id="faq"
      className="scroll-mt-[calc(var(--header-height)+2rem)] overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-700/80 dark:bg-card"
    >
      <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-700 dark:bg-slate-800/50">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 p-2 dark:bg-indigo-950">
          <MessageCircle
            className="h-5 w-5 text-indigo-600 dark:text-indigo-400"
            aria-hidden
          />
        </div>
        <h2 className="font-bold text-slate-900 dark:text-text-primary">
          اکثر پوچھے گئے سوالات
        </h2>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-700">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index}>
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between px-6 py-5 text-right"
              >
                <span className="flex flex-1 items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-sans text-caption font-bold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                    ؟
                  </span>
                  <span className="text-base font-semibold leading-relaxed text-slate-900 dark:text-text-primary">
                    {faq.question}
                  </span>
                </span>
                <span
                  className={cn(
                    "ms-3 rounded-full bg-slate-100 p-1 transition-transform duration-200 dark:bg-slate-800",
                    isOpen && "rotate-180",
                  )}
                >
                  <ChevronDown className="h-5 w-5 text-slate-400" aria-hidden />
                </span>
              </button>
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out",
                  isOpen ? "max-h-96" : "max-h-0",
                )}
              >
                <div className="px-6 pb-5 pe-16 ps-6">
                  <p className="text-base leading-[2.2] text-slate-600 dark:text-slate-300">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
