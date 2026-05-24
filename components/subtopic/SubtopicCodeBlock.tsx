"use client";

import { useState } from "react";
import { Check, Code2, Copy } from "lucide-react";

const KEYWORDS = new Set([
  "def",
  "class",
  "import",
  "from",
  "return",
  "if",
  "else",
  "elif",
  "for",
  "in",
  "while",
  "print",
  "True",
  "False",
  "None",
  "and",
  "or",
  "not",
  "with",
  "as",
  "try",
  "except",
]);

function highlightLine(line: string): React.ReactNode {
  if (/^\s*#/.test(line)) {
    return <span className="text-green-400">{line}</span>;
  }

  const parts: React.ReactNode[] = [];
  let remaining = line;
  let key = 0;

  const stringMatch = remaining.match(/^([^"'#]*)(['"][^'"]*['"]?)/);
  if (stringMatch) {
    if (stringMatch[1]) {
      parts.push(<span key={key++}>{colorizeTokens(stringMatch[1])}</span>);
    }
    parts.push(<span key={key++} className="text-amber-300">{stringMatch[2]}</span>);
    remaining = remaining.slice(stringMatch[0].length);
  }

  if (remaining) {
    parts.push(<span key={key++}>{colorizeTokens(remaining)}</span>);
  }

  return parts.length > 0 ? parts : colorizeTokens(line);
}

function colorizeTokens(text: string): React.ReactNode {
  return text.split(/(\b\w+\b|\d+\.?\d*)/g).map((token, i) => {
    if (/^\d+\.?\d*$/.test(token)) {
      return (
        <span key={i} className="text-violet-400">
          {token}
        </span>
      );
    }
    if (KEYWORDS.has(token)) {
      return (
        <span key={i} className="text-blue-400">
          {token}
        </span>
      );
    }
    return <span key={i} className="text-slate-300">{token}</span>;
  });
}

function hasPrintOutput(code: string): boolean {
  return /\bprint\s*\(/.test(code);
}

type SubtopicCodeBlockProps = {
  code: string;
  language?: string | null;
};

export default function SubtopicCodeBlock({
  code,
  language = "python",
}: SubtopicCodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const lines = code.split("\n");

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="code"
      className="scroll-mt-[calc(var(--header-height)+2rem)] overflow-hidden rounded-2xl border border-slate-700/50 shadow-xl shadow-slate-900/20"
    >
      <div className="flex items-center gap-3 border-b border-slate-700 bg-slate-800 px-6 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900">
          <Code2 className="h-5 w-5 text-green-400" aria-hidden />
        </div>
        <h2 className="flex-1 font-bold text-white">کوڈ مثال</h2>
        <span className="rounded-full bg-green-500/20 px-3 py-1 font-sans text-caption text-green-400">
          {language ?? "Python"}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-lg bg-slate-700 px-3 py-1.5 font-sans text-caption text-slate-300 transition-colors hover:bg-slate-600 hover:text-white"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" aria-hidden />
              کاپی ہو گیا
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" aria-hidden />
              کاپی کریں
            </>
          )}
        </button>
      </div>

      <div className="bg-slate-950 p-6 font-mono text-small leading-relaxed" dir="ltr">
        {lines.map((line, index) => (
          <div key={index} className="flex gap-4">
            <span className="w-8 shrink-0 select-none text-right text-slate-600">
              {index + 1}
            </span>
            <pre className="flex-1 overflow-x-auto text-left">
              <code>{highlightLine(line)}</code>
            </pre>
          </div>
        ))}
      </div>

      {hasPrintOutput(code) && (
        <div className="border-t border-slate-800 bg-slate-900 px-6 py-4" dir="ltr">
          <p className="mb-2 font-sans text-caption text-slate-500">آؤٹ پٹ:</p>
          <pre className="font-mono text-small text-green-400">
            <code># پروگرام کا نتیجہ یہاں ظاہر ہوگا</code>
          </pre>
        </div>
      )}
    </section>
  );
}
