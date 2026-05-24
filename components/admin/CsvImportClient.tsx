"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  FileText,
  GraduationCap,
  Layers,
  Upload,
} from "lucide-react";
import {
  CSV_COLUMN_SPEC,
  generateSampleCsv,
  type ParsedImport,
} from "@/lib/utils/csvParser";
import type { ExistingSlugCounts, ImportResults } from "@/lib/admin/csvImport";

type Step = 1 | 2 | 3;

type PreviewData = ParsedImport & {
  existingSlugs: ExistingSlugCounts;
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

function StepIndicator({ step }: { step: Step }) {
  const items = [
    { n: 1, label: "Upload" },
    { n: 2, label: "Review" },
    { n: 3, label: "Result" },
  ] as const;

  return (
    <div className="mb-8 flex items-center justify-center gap-2">
      {items.map((item, i) => {
        const completed = step > item.n;
        const active = step === item.n;
        return (
          <div key={item.n} className="flex items-center gap-2">
            {i > 0 && (
              <span className="h-px w-8 bg-slate-200 sm:w-12" aria-hidden />
            )}
            <span
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${
                active
                  ? "bg-blue-600 text-white"
                  : completed
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-200 text-slate-500"
              }`}
            >
              <span className="font-bold">{item.n}</span>
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function PreviewTree({ courses }: { courses: PreviewData["courses"] }) {
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(courses.map((c) => c.slug)),
  );

  const toggle = (slug: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  return (
    <div className="max-h-96 overflow-y-auto">
      {courses.map((course) => {
        const isOpen = expanded.has(course.slug);
        return (
          <div
            key={course.slug}
            className="border-b border-slate-100 last:border-b-0"
          >
            <button
              type="button"
              onClick={() => toggle(course.slug)}
              className="flex w-full items-center justify-between bg-blue-50 px-6 py-4 text-left"
            >
              <span className="flex items-center gap-2 font-bold text-slate-900">
                {isOpen ? (
                  <ChevronDown className="h-4 w-4 shrink-0" />
                ) : (
                  <ChevronRight className="h-4 w-4 shrink-0" />
                )}
                <GraduationCap className="h-5 w-5 text-blue-600" />
                <span dir="rtl" className="font-urdu">{course.title}</span>
              </span>
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                {course.chapters.length} chapters
              </span>
            </button>

            {isOpen &&
              course.chapters.map((chapter) => (
                <div key={chapter.slug}>
                  <div className="flex items-center justify-between border-b border-slate-100 px-6 py-3">
                    <span className="flex items-center gap-2 text-slate-800">
                      <Layers className="h-4 w-4 text-violet-500" />
                      <span dir="rtl" className="font-urdu">{chapter.title}</span>
                    </span>
                    <span className="text-xs text-slate-400">
                      {chapter.topics.length} topics
                    </span>
                  </div>
                  {chapter.topics.slice(0, 3).map((topic) => (
                    <div
                      key={topic.slug}
                      className="flex items-center justify-between px-10 py-2 text-sm text-slate-600"
                    >
                      <span className="flex items-center gap-2">
                        <FileText className="h-3.5 w-3.5 text-emerald-500" />
                        <span dir="rtl" className="font-urdu">{topic.title}</span>
                      </span>
                      <span className="rounded bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
                        {topic.subtopics.length} subtopics
                      </span>
                    </div>
                  ))}
                  {chapter.topics.length > 3 && (
                    <p className="px-10 py-1 text-xs text-slate-400">
                      + {chapter.topics.length - 3} more topics
                    </p>
                  )}
                </div>
              ))}
          </div>
        );
      })}
    </div>
  );
}

export default function CsvImportClient() {
  const [step, setStep] = useState<Step>(1);
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [schemaOpen, setSchemaOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [importResults, setImportResults] = useState<ImportResults | null>(
    null,
  );
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const reset = useCallback(() => {
    setStep(1);
    setFile(null);
    setPreview(null);
    setParseErrors([]);
    setApiError(null);
    setImportResults(null);
    setImportMessage(null);
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  const acceptFile = (f: File) => {
    if (!f.name.toLowerCase().endsWith(".csv")) {
      setApiError("Only CSV files are accepted");
      return;
    }
    setApiError(null);
    setFile(f);
  };

  const handlePreview = async () => {
    if (!file) return;
    setLoading(true);
    setApiError(null);
    setParseErrors([]);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/import/preview", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok) {
        setApiError(data.error ?? "Preview failed");
        return;
      }

      if (!data.success) {
        setParseErrors(data.errors ?? []);
        setStep(2);
        return;
      }

      setPreview(data.preview);
      setStep(2);
    } catch {
      setApiError("Could not connect to server");
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!file) return;
    const confirmed = window.confirm(
      `Are you sure you want to import ${preview?.totalSubtopics ?? 0} subtopics?`,
    );
    if (!confirmed) return;

    setImporting(true);
    setApiError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/import", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok) {
        setApiError(data.error ?? "Import failed");
        return;
      }

      if (!data.success) {
        setParseErrors(data.errors ?? []);
        setStep(2);
        return;
      }

      setImportResults(data.results);
      setImportMessage(data.message);
      setStep(3);
    } catch {
      setApiError("Could not connect to server");
    } finally {
      setImporting(false);
    }
  };

  const downloadSample = () => {
    const blob = new Blob([generateSampleCsv()], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample-course-import.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">CSV Import</h1>
        <p className="text-slate-500">
          Import courses, chapters, topics, and subtopics from CSV
        </p>
      </div>

      <StepIndicator step={step} />

      {step === 1 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8">
          <div
            role="button"
            tabIndex={0}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const f = e.dataTransfer.files[0];
              if (f) acceptFile(f);
            }}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
            }}
            className={`cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all ${
              dragOver
                ? "border-blue-500 bg-blue-50"
                : "border-slate-300 hover:border-blue-400 hover:bg-blue-50"
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) acceptFile(f);
              }}
            />
            {file ? (
              <>
                <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-emerald-500" />
                <p className="font-medium text-slate-800">{file.name}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {formatBytes(file.size)}
                </p>
                <p className="mt-2 text-emerald-600">File ready</p>
              </>
            ) : (
              <>
                <Upload className="mx-auto mb-4 h-12 w-12 text-slate-400" />
                <p className="text-lg text-slate-600">Drop CSV file here</p>
                <p className="my-2 text-slate-400">or</p>
                <span className="inline-block rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white">
                  Choose File
                </span>
              </>
            )}
          </div>

          {apiError && (
            <p className="mt-4 text-sm text-red-600">{apiError}</p>
          )}

          <div className="mt-6">
            <button
              type="button"
              onClick={() => setSchemaOpen((o) => !o)}
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              View CSV Schema {schemaOpen ? "▲" : "▼"}
            </button>
            {schemaOpen && (
              <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-3 py-2 font-medium">Column</th>
                      <th className="px-3 py-2 font-medium">Required</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CSV_COLUMN_SPEC.map((col) => (
                      <tr key={col} className="border-t border-slate-100">
                        <td className="px-3 py-2 font-mono text-xs">{col}</td>
                        <td className="px-3 py-2 text-emerald-600">Yes</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={downloadSample}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Download Sample CSV
            </button>
            <button
              type="button"
              disabled={!file || loading}
              onClick={handlePreview}
              className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Reading CSV..." : "Preview Import"}
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          {preview && (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                {
                  icon: GraduationCap,
                  color: "text-blue-600",
                  count: preview.totalCourses,
                  label: "Courses",
                },
                {
                  icon: Layers,
                  color: "text-violet-600",
                  count: preview.totalChapters,
                  label: "Chapters",
                },
                {
                  icon: FileText,
                  color: "text-emerald-600",
                  count: preview.totalTopics,
                  label: "Topics",
                },
                {
                  icon: BookOpen,
                  color: "text-amber-600",
                  count: preview.totalSubtopics,
                  label: "Subtopics",
                },
              ].map(({ icon: Icon, color, count, label }) => (
                <div
                  key={label}
                  className="rounded-xl border border-slate-200 bg-white p-4 text-center"
                >
                  <Icon className={`mx-auto mb-2 h-8 w-8 ${color}`} />
                  <p className="text-2xl font-bold text-slate-900">{count}</p>
                  <p className="text-sm text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          )}

          {parseErrors.length > 0 && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-red-700">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">The following errors were found:</span>
              </div>
              <ul className="list-inside list-disc space-y-1 text-sm text-red-600">
                {parseErrors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
              <p className="mt-3 text-sm text-red-700">
                Please fix the CSV and upload again
              </p>
              <button
                type="button"
                onClick={reset}
                className="mt-4 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
              >
                Go Back
              </button>
            </div>
          )}

          {preview && parseErrors.length === 0 && (
            <>
              {preview.existingSlugs.total > 0 && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                  <strong>{preview.existingSlugs.total}</strong> records already
                  exist and will be skipped (
                  {preview.existingSlugs.courses} courses,{" "}
                  {preview.existingSlugs.chapters} chapters,{" "}
                  {preview.existingSlugs.topics} topics,{" "}
                  {preview.existingSlugs.subtopics} subtopics)
                </div>
              )}

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <PreviewTree courses={preview.courses} />
              </div>

              {apiError && (
                <p className="text-sm text-red-600">{apiError}</p>
              )}

              <div className="flex flex-wrap justify-between gap-3">
                <button
                  type="button"
                  onClick={reset}
                  className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Go Back
                </button>
                <button
                  type="button"
                  disabled={importing}
                  onClick={handleImport}
                  className="rounded-xl bg-blue-600 px-8 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {importing ? "Importing..." : "Start Import"}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {step === 3 && importResults && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8">
          <CheckCircle2 className="mx-auto mb-4 h-20 w-20 animate-bounce text-emerald-500" />
          <h2 className="text-center text-3xl font-bold text-slate-900">
            Import Complete!
          </h2>
          {importMessage && (
            <p className="mt-2 text-center text-slate-600">{importMessage}</p>
          )}

          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              {
                label: "Courses",
                created: importResults.coursesCreated,
                skipped: importResults.coursesSkipped,
              },
              {
                label: "Chapters",
                created: importResults.chaptersCreated,
                skipped: importResults.chaptersSkipped,
              },
              {
                label: "Topics",
                created: importResults.topicsCreated,
                skipped: importResults.topicsSkipped,
              },
              {
                label: "Subtopics",
                created: importResults.subtopicsCreated,
                skipped: importResults.subtopicsSkipped,
              },
            ].map(({ label, created, skipped }) => (
              <div
                key={label}
                className="rounded-xl border border-slate-200 p-4 text-center"
              >
                <p className="text-sm font-medium text-slate-600">{label}</p>
                <p className="mt-2 text-lg font-bold text-emerald-600">
                  {created} created
                </p>
                <p className="text-sm text-slate-400">{skipped} already existed</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              type="button"
              onClick={reset}
              className="rounded-xl border border-slate-300 px-6 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Import More
            </button>
            <Link
              href="/admin/agent"
              className="rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-violet-700"
            >
              Generate Content with AI
            </Link>
            <Link
              href="/admin/subtopics"
              className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
            >
              View Subtopics
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
