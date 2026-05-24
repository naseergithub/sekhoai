"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

type CodeBlockProps = {
  code: string;
  language?: string | null;
};

export default function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="relative my-4 overflow-hidden rounded-xl border border-amber-200 bg-gradient-amber-orange dark:border-amber-900"
      dir="ltr"
    >
      {language && (
        <div className="border-b border-amber-200/80 bg-amber-100/50 px-4 py-2 font-mono text-caption uppercase text-amber-800 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-200">
          {language}
        </div>
      )}
      <button
        type="button"
        onClick={handleCopy}
        className="absolute end-3 top-3 rounded-lg bg-slate-900/80 p-2 text-slate-200 transition-colors hover:bg-slate-900"
        aria-label="کوڈ کاپی کریں"
      >
        {copied ? (
          <Check className="h-4 w-4 text-success" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </button>
      <pre className="overflow-x-auto bg-slate-900 p-4 font-mono text-small leading-relaxed text-slate-100">
        <code>{code}</code>
      </pre>
    </div>
  );
}
