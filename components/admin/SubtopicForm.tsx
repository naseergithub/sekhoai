"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SeoFields, { type SeoFormValues } from "@/components/admin/SeoFields";
import { generateSlugFromEnglish } from "@/lib/utils";

type Course = { id: string; title: string };
type Chapter = { id: string; title: string; courseId: string };
type Topic = { id: string; title: string; chapterId: string };

type SubtopicData = {
  id?: string;
  topicId: string;
  title: string;
  titleEn?: string | null;
  slug: string;
  order: number;
  published: boolean;
  whatIsIt?: string | null;
  whyItMatters?: string | null;
  howItWorks?: string | null;
  mathBehindIt?: string | null;
  realWorldEx?: string | null;
  codeExample?: string | null;
  codeLanguage?: string | null;
  applications?: string | null;
  hook?: string | null;
  analogy?: string | null;
  commonMistakes?: string | null;
  comparison?: string | null;
  quickSummary?: string | null;
  quizData?: string | null;
  seoMeta?: SeoFormValues | null;
};

type SubtopicFormProps = {
  courses: Course[];
  chapters: Chapter[];
  topics: Topic[];
  initial?: SubtopicData & { courseId?: string; chapterId?: string };
  mode: "create" | "edit";
};

const contentSections = [
  { key: "whatIsIt" as const, label: "What Is It?" },
  { key: "whyItMatters" as const, label: "Why It Matters" },
  { key: "howItWorks" as const, label: "How It Works" },
  { key: "mathBehindIt" as const, label: "The Math" },
  { key: "realWorldEx" as const, label: "Real-World Examples" },
  { key: "applications" as const, label: "Practical Applications" },
];

export default function SubtopicForm({
  courses,
  chapters,
  topics,
  initial,
  mode,
}: SubtopicFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const initialTopic = topics.find((t) => t.id === initial?.topicId);
  const initialChapter = chapters.find((c) => c.id === initialTopic?.chapterId);

  const [courseId, setCourseId] = useState(initial?.courseId ?? initialChapter?.courseId ?? courses[0]?.id ?? "");
  const [chapterId, setChapterId] = useState(initial?.chapterId ?? initialChapter?.id ?? "");
  const [topicId, setTopicId] = useState(initial?.topicId ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [titleEn, setTitleEn] = useState(initial?.titleEn ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugManual, setSlugManual] = useState(!!initial?.slug);
  const [order, setOrder] = useState(initial?.order ?? 0);
  const [published, setPublished] = useState(initial?.published ?? false);
  const [seo, setSeo] = useState<SeoFormValues>(initial?.seoMeta ?? {});

  const [whatIsIt, setWhatIsIt] = useState(initial?.whatIsIt ?? "");
  const [whyItMatters, setWhyItMatters] = useState(initial?.whyItMatters ?? "");
  const [howItWorks, setHowItWorks] = useState(initial?.howItWorks ?? "");
  const [mathBehindIt, setMathBehindIt] = useState(initial?.mathBehindIt ?? "");
  const [realWorldEx, setRealWorldEx] = useState(initial?.realWorldEx ?? "");
  const [codeExample, setCodeExample] = useState(initial?.codeExample ?? "");
  const [codeLanguage, setCodeLanguage] = useState(initial?.codeLanguage ?? "python");
  const [applications, setApplications] = useState(initial?.applications ?? "");
  const [hook, setHook] = useState(initial?.hook ?? "");
  const [analogy, setAnalogy] = useState(initial?.analogy ?? "");
  const [commonMistakes, setCommonMistakes] = useState(initial?.commonMistakes ?? "");
  const [comparison, setComparison] = useState(initial?.comparison ?? "");
  const [quickSummary, setQuickSummary] = useState(initial?.quickSummary ?? "");
  const [quizData, setQuizData] = useState(initial?.quizData ?? "");
  const [quizJsonStatus, setQuizJsonStatus] = useState<"idle" | "valid" | "invalid">("idle");

  const filteredChapters = chapters.filter((c) => c.courseId === courseId);
  const filteredTopics = topics.filter((t) => t.chapterId === chapterId);

  useEffect(() => {
    if (!filteredChapters.find((c) => c.id === chapterId)) {
      setChapterId(filteredChapters[0]?.id ?? "");
    }
  }, [courseId, filteredChapters, chapterId]);

  useEffect(() => {
    if (!filteredTopics.find((t) => t.id === topicId)) {
      setTopicId(filteredTopics[0]?.id ?? "");
    }
  }, [chapterId, filteredTopics, topicId]);

  const contentValues: Record<string, string> = {
    whatIsIt,
    whyItMatters,
    howItWorks,
    mathBehindIt,
    realWorldEx,
    applications,
  };

  const setContent = (key: string, value: string) => {
    const setters: Record<string, (v: string) => void> = {
      whatIsIt: setWhatIsIt,
      whyItMatters: setWhyItMatters,
      howItWorks: setHowItWorks,
      mathBehindIt: setMathBehindIt,
      realWorldEx: setRealWorldEx,
      applications: setApplications,
    };
    setters[key]?.(value);
  };

  const handleTitleEnChange = (value: string) => {
    setTitleEn(value);
    if (!slugManual && value) setSlug(generateSlugFromEnglish(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch(
      mode === "create" ? "/api/admin/subtopics" : `/api/admin/subtopics/${initial?.id}`,
      {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicId,
          title,
          titleEn: titleEn || null,
          slug,
          order: Number(order),
          published,
          whatIsIt: whatIsIt || null,
          whyItMatters: whyItMatters || null,
          howItWorks: howItWorks || null,
          mathBehindIt: mathBehindIt || null,
          realWorldEx: realWorldEx || null,
          codeExample: codeExample || null,
          codeLanguage: codeLanguage || "python",
          applications: applications || null,
          hook: hook || null,
          analogy: analogy || null,
          commonMistakes: commonMistakes || null,
          comparison: comparison || null,
          quickSummary: quickSummary || null,
          quizData: quizData || null,
          seo,
        }),
      },
    );

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to save");
      setLoading(false);
      return;
    }

    router.push("/admin/subtopics");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-6">
      {error && <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium">Course *</label>
          <select value={courseId} onChange={(e) => setCourseId(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
            {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Chapter *</label>
          <select value={chapterId} onChange={(e) => setChapterId(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
            {filteredChapters.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Topic *</label>
          <select required value={topicId} onChange={(e) => setTopicId(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
            {filteredTopics.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Title (Urdu) *</label>
        <input required value={title} onChange={(e) => setTitle(e.target.value)} dir="rtl" className="w-full rounded-lg border border-gray-300 px-3 py-2 font-urdu" />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Title (English)</label>
        <input value={titleEn} onChange={(e) => handleTitleEnChange(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2" />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Slug</label>
        <input value={slug} onChange={(e) => { setSlugManual(true); setSlug(e.target.value); }} className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm" />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium">Order</label>
          <input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} className="w-full rounded-lg border border-gray-300 px-3 py-2" />
        </div>
        <div className="flex items-end gap-2 pb-2">
          <input id="published" type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="h-4 w-4" />
          <label htmlFor="published" className="text-sm font-medium">Published</label>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700">Content Sections (Urdu)</h3>
        {contentSections.map(({ key, label }) => (
          <div key={key} className="rounded-lg border border-gray-200">
            <button
              type="button"
              onClick={() => setOpenSections((s) => ({ ...s, [key]: !s[key] }))}
              className="flex w-full items-center justify-between px-4 py-2 text-sm font-medium text-gray-700"
            >
              <span>{label}</span>
              <span>{openSections[key] ? "−" : "+"}</span>
            </button>
            {openSections[key] && (
              <textarea
                rows={4}
                value={contentValues[key]}
                onChange={(e) => setContent(key, e.target.value)}
                dir="rtl"
                className="w-full border-t border-gray-200 px-4 py-2 text-sm font-urdu"
              />
            )}
          </div>
        ))}

        <div className="rounded-lg border border-gray-200 p-4">
          <label className="mb-1 block text-sm font-medium">Hook / Opening Story</label>
          <p className="mb-2 text-xs text-gray-500">
            Start with a story or problem — not a definition
          </p>
          <textarea
            rows={4}
            value={hook}
            onChange={(e) => setHook(e.target.value)}
            placeholder="Write an engaging opening story in Urdu..."
            dir="rtl"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-urdu"
          />
        </div>

        <div className="rounded-lg border border-gray-200 p-4">
          <label className="mb-1 block text-sm font-medium">Simple Analogy</label>
          <p className="mb-2 text-xs text-gray-500">
            Compare this concept to everyday Pakistani life
          </p>
          <textarea
            rows={3}
            value={analogy}
            onChange={(e) => setAnalogy(e.target.value)}
            placeholder="Write a simple analogy in Urdu..."
            dir="rtl"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-urdu"
          />
        </div>

        <div className="rounded-lg border border-gray-200 p-4">
          <label className="mb-1 block text-sm font-medium">Common Mistakes</label>
          <p className="mb-2 text-xs text-gray-500">
            3 mistakes beginners make with this concept
          </p>
          <textarea
            rows={6}
            value={commonMistakes}
            onChange={(e) => setCommonMistakes(e.target.value)}
            placeholder="Write 3 common mistakes and their solutions in Urdu..."
            dir="rtl"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-urdu"
          />
        </div>

        <div className="rounded-lg border border-gray-200 p-4">
          <label className="mb-1 block text-sm font-medium">
            Comparison with Similar Concept
          </label>
          <p className="mb-2 text-xs text-gray-500">
            Compare with the most similar concept students confuse this with
          </p>
          <textarea
            rows={5}
            value={comparison}
            onChange={(e) => setComparison(e.target.value)}
            placeholder="Write comparison in Urdu..."
            dir="rtl"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-urdu"
          />
        </div>

        <div className="rounded-lg border border-gray-200 p-4">
          <label className="mb-1 block text-sm font-medium">Quick Summary</label>
          <p className="mb-2 text-xs text-gray-500">
            5 key bullet points students should remember
          </p>
          <textarea
            rows={4}
            value={quickSummary}
            onChange={(e) => setQuickSummary(e.target.value)}
            placeholder="Write 5 key takeaways in Urdu..."
            dir="rtl"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-urdu"
          />
        </div>

        <div className="rounded-lg border border-gray-200 p-4">
          <label className="mb-1 block text-sm font-medium">Quiz Questions (JSON)</label>
          <p className="mb-2 text-xs text-gray-500">
            3 multiple choice questions — auto-generated by AI
          </p>
          <textarea
            rows={10}
            value={quizData}
            onChange={(e) => {
              setQuizData(e.target.value);
              setQuizJsonStatus("idle");
            }}
            placeholder='[{"question":"...","options":["A","B","C","D"],"correctIndex":0,"explanation":"..."}]'
            dir="ltr"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm"
          />
          <p className="mt-2 text-xs text-gray-500">
            This is auto-filled by AI. Only edit if needed.
          </p>
          <div className="mt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                try {
                  JSON.parse(quizData);
                  setQuizJsonStatus("valid");
                } catch {
                  setQuizJsonStatus("invalid");
                }
              }}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Validate JSON
            </button>
            {quizJsonStatus === "valid" && (
              <span className="text-xs font-medium text-emerald-600">Valid JSON ✓</span>
            )}
            {quizJsonStatus === "invalid" && (
              <span className="text-xs font-medium text-red-600">
                Invalid JSON — check formatting
              </span>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 p-4">
          <label className="mb-1 block text-sm font-medium">Code Example</label>
          <select value={codeLanguage} onChange={(e) => setCodeLanguage(e.target.value)} className="mb-2 rounded border border-gray-300 px-2 py-1 text-sm">
            <option value="python">python</option>
            <option value="javascript">javascript</option>
            <option value="bash">bash</option>
            <option value="none">none</option>
          </select>
          <textarea
            rows={6}
            value={codeExample}
            onChange={(e) => setCodeExample(e.target.value)}
            dir="ltr"
            className="w-full rounded-lg border border-gray-300 bg-gray-900 px-3 py-2 font-mono text-sm text-gray-100"
          />
        </div>
      </div>

      <SeoFields values={seo} onChange={setSeo} />

      <button type="submit" disabled={loading} className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50">
        {loading ? "Saving..." : "Save Subtopic"}
      </button>
    </form>
  );
}
