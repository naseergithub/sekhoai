"use client";

import { useState } from "react";
import type { FaqItem } from "@/lib/seo/structuredData";
import Card from "@/components/ui/Card";
import SectionHeading from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

export default function FaqSection({ faqs }: { faqs: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (faqs.length === 0) return null;

  return (
    <section className="mt-12 border-t border-border pt-10">
      <SectionHeading title="اکثر پوچھے گئے سوالات" className="mb-6" />
      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <Card key={index} padding="p-0" className="overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between px-4 py-4 text-right text-body font-semibold text-text-primary transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <span>{faq.question}</span>
                <span
                  className={cn(
                    "ms-3 shrink-0 text-xl text-primary transition-transform duration-200",
                    isOpen && "rotate-180",
                  )}
                >
                  ▼
                </span>
              </button>
              <div
                className={cn(
                  "grid transition-all duration-300 ease-in-out",
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                )}
              >
                <div className="overflow-hidden">
                  <p className="border-t border-border px-4 py-4 text-urdu-body text-text-body">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
