"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import Card from "@/components/ui/Card";

type SocialShareProps = {
  title: string;
  url: string;
};

export default function SocialShare({ title, url }: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      name: "WhatsApp",
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      className: "bg-green-600 hover:bg-green-700",
    },
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      className: "bg-blue-600 hover:bg-blue-700",
    },
    {
      name: "Twitter",
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      className: "bg-sky-500 hover:bg-sky-600",
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      className: "bg-blue-700 hover:bg-blue-800",
    },
  ];

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="my-6 !p-4">
      <p className="mb-3 flex items-center gap-2 text-small font-semibold text-text-body">
        <Share2 className="h-4 w-4 text-primary" aria-hidden />
        شیئر کریں
      </p>
      <div className="flex flex-wrap gap-2">
        {links.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`rounded-xl px-4 py-2 font-sans text-small font-medium text-white transition-colors ${link.className}`}
          >
            {link.name}
          </a>
        ))}
        <button
          type="button"
          onClick={copyLink}
          className="rounded-xl bg-slate-700 px-4 py-2 font-sans text-small font-medium text-white transition-colors hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-500"
        >
          {copied ? "کاپی ہو گیا!" : "لنک کاپی کریں"}
        </button>
      </div>
    </Card>
  );
}
