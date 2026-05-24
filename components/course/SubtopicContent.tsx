import type { ComponentType, ReactNode } from "react";
import {
  AlertTriangle,
  BarChart3,
  Brain,
  CheckCircle2,
  CheckSquare,
  GitCompare,
  Globe,
  Info,
  Lightbulb,
  MapPin,
  Sparkles,
  Zap,
} from "lucide-react";
import SubtopicCodeBlock from "@/components/subtopic/SubtopicCodeBlock";
import SubtopicQuiz from "@/components/course/SubtopicQuiz";
import { hasUrduPythonSyntax } from "@/lib/ai/validatePythonCode";
import {
  isBulletList,
  isMathNotApplicable,
  isNumberedSteps,
  parseBulletLines,
  parseCommonMistakes,
  parseComparison,
  parseNumberedSteps,
  parseQuickSummary,
  splitParagraphs,
  splitRealWorldExamples,
} from "@/lib/subtopic-content";
import { toUrduNumeral } from "@/lib/utils";
import type { SubtopicWithRelations } from "@/types";

type SubtopicContentProps = {
  subtopic: SubtopicWithRelations;
};

function SectionShell({
  id,
  title,
  icon: Icon,
  iconClass,
  headerClass,
  accentClass,
  children,
}: {
  id: string;
  title: string;
  icon: ComponentType<{ className?: string }>;
  iconClass: string;
  headerClass: string;
  accentClass: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="group scroll-mt-[calc(var(--header-height)+2rem)] overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-700/80 dark:bg-card"
    >
      <div className={`flex border-s-4 ${accentClass}`}>
        <div className="min-w-0 flex-1">
          <div
            className={`flex items-center gap-3 border-b border-slate-100 px-6 py-4 dark:border-slate-700/80 ${headerClass}`}
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm ${iconClass}`}
            >
              <Icon className="h-5 w-5" aria-hidden />
            </div>
            <h2 className="text-lg font-bold leading-[1.75] text-slate-900 dark:text-text-primary">
              {title}
            </h2>
          </div>
          <div className="px-6 py-6 lg:px-8 lg:py-7">{children}</div>
        </div>
      </div>
    </section>
  );
}

function ParagraphBody({
  text,
  leadFirst = false,
}: {
  text: string;
  leadFirst?: boolean;
}) {
  const paragraphs = splitParagraphs(text);
  return (
    <div className="space-y-5">
      {paragraphs.map((p, i) =>
        leadFirst && i === 0 ? (
          <p
            key={i}
            className="rounded-xl border border-blue-100/80 bg-blue-50/50 px-5 py-4 text-xl leading-[2.1] text-slate-800 dark:border-blue-900/50 dark:bg-blue-950/20 dark:text-slate-200"
          >
            {p}
          </p>
        ) : (
          <p
            key={i}
            className="text-lg leading-[2.15] text-slate-700 dark:text-slate-300"
          >
            {p}
          </p>
        ),
      )}
    </div>
  );
}

function InlineMathBody({ text }: { text: string }) {
  const paragraphs = splitParagraphs(text);
  return (
    <div className="space-y-4 rounded-xl border border-amber-100 bg-amber-50/30 p-6 dark:border-amber-900 dark:bg-amber-950/20">
      {paragraphs.map((p, i) => (
        <p key={i} className="text-lg leading-[2.2] text-slate-700 dark:text-slate-300">
          {p.split(/(`[^`]+`)/g).map((part, j) =>
            part.startsWith("`") && part.endsWith("`") ? (
              <code
                key={j}
                className="rounded bg-amber-100 px-2 py-0.5 font-mono text-small text-amber-800 dark:bg-amber-950 dark:text-amber-200"
              >
                {part.slice(1, -1)}
              </code>
            ) : (
              <span key={j}>{part}</span>
            ),
          )}
        </p>
      ))}
    </div>
  );
}

function HookSection({ text }: { text: string }) {
  return (
    <section
      id="hook"
      className="relative mb-6 scroll-mt-32 overflow-hidden rounded-2xl border-e-4 border-blue-500 bg-gradient-to-l from-blue-50 to-violet-50 p-6 dark:from-blue-950/30 dark:to-violet-950/30"
    >
      <div
        className="pointer-events-none absolute start-0 top-0 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400 opacity-10"
        aria-hidden
      />
      <div className="relative z-10">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 p-2.5 dark:bg-blue-900">
            <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wide text-blue-500">
            سوچیں...
          </span>
        </div>
        <div className="space-y-4">
          {splitParagraphs(text).map((p, i) => (
            <p
              key={i}
              className="font-urdu text-xl font-medium leading-[2.2] text-slate-800 dark:text-slate-200"
            >
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

function AnalogySection({ text }: { text: string }) {
  return (
    <section
      id="analogy"
      className="mb-6 scroll-mt-32 overflow-hidden rounded-2xl border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20"
    >
      <div className="flex items-center gap-3 border-b border-amber-100 px-6 py-4 dark:border-amber-900">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900">
          <Zap className="h-5 w-5 text-amber-600 dark:text-amber-400" aria-hidden />
        </div>
        <h2 className="font-bold text-slate-900 dark:text-text-primary">آسان مثال</h2>
      </div>
      <div className="border-e-4 border-amber-400 px-6 py-6">
        <p className="text-lg italic leading-[2.2] text-slate-700 dark:text-slate-300">
          {text.trim()}
        </p>
      </div>
    </section>
  );
}

function CommonMistakesSection({ text }: { text: string }) {
  const mistakes = parseCommonMistakes(text);

  return (
    <section
      id="mistakes"
      className="mb-6 scroll-mt-32 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-card"
    >
      <div className="flex items-center justify-between border-b border-slate-100 bg-red-50/50 px-6 py-4 dark:border-slate-700 dark:bg-red-950/20">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" aria-hidden />
          </div>
          <h2 className="font-bold text-slate-900 dark:text-text-primary">عام غلطیاں</h2>
        </div>
        <span className="rounded-full bg-red-100 px-3 py-1 text-xs text-red-600 dark:bg-red-900 dark:text-red-300">
          ان سے بچیں
        </span>
      </div>
      <div className="px-6 py-6">
        {mistakes.length > 0 ? (
          <div className="space-y-4">
            {mistakes.map((item, i) => (
              <div
                key={i}
                className="rounded-xl border border-red-100 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950/20"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-500 text-sm font-bold text-white">
                    {toUrduNumeral(i + 1)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="mb-1 text-xs font-semibold text-red-500">غلطی:</p>
                    <p className="font-medium leading-relaxed text-slate-800 dark:text-slate-200">
                      {item.mistake}
                    </p>
                    {item.solution && (
                      <div className="mt-3 flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-950/30">
                        <CheckCircle2
                          className="mt-1 h-4 w-4 shrink-0 text-emerald-500"
                          aria-hidden
                        />
                        <div>
                          <span className="text-xs font-semibold text-emerald-600">
                            حل:
                          </span>
                          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                            {item.solution}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {splitParagraphs(text).map((p, i) => (
              <p
                key={i}
                className="text-lg leading-[2.2] text-slate-700 dark:text-slate-300"
              >
                <AlertTriangle
                  className="me-2 inline h-4 w-4 text-red-400"
                  aria-hidden
                />
                {p}
              </p>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ComparisonSection({ text }: { text: string }) {
  const parsed = parseComparison(text);

  return (
    <section
      id="comparison"
      className="mb-6 scroll-mt-32 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-card"
    >
      <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-700 dark:bg-slate-800/50">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
          <GitCompare className="h-5 w-5 text-slate-600 dark:text-slate-400" aria-hidden />
        </div>
        <h2 className="font-bold text-slate-900 dark:text-text-primary">موازنہ</h2>
        <span className="mr-3 text-sm text-slate-500">ملتے جلتے concepts میں فرق</span>
      </div>
      <div className="px-6 py-6">
        {parsed.type === "cards" ? (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
                <h3 className="mb-3 font-bold text-blue-700 dark:text-blue-300">
                  {parsed.leftTitle}
                </h3>
                <ul className="space-y-2">
                  {parsed.leftPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-violet-200 bg-violet-50 p-4 dark:border-violet-800 dark:bg-violet-950/30">
                <h3 className="mb-3 font-bold text-violet-700 dark:text-violet-300">
                  {parsed.rightTitle}
                </h3>
                <ul className="space-y-2">
                  {parsed.rightPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-violet-500" />
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {parsed.usage && (
              <div className="mt-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
                <h3 className="mb-2 font-bold text-slate-900 dark:text-text-primary">
                  کب کون سا استعمال کریں؟
                </h3>
                <p className="text-lg leading-[2.2] text-slate-700 dark:text-slate-300">
                  {parsed.usage}
                </p>
              </div>
            )}
          </>
        ) : (
          <p className="text-lg leading-[2.2] text-slate-700 dark:text-slate-300">
            {parsed.text}
          </p>
        )}
      </div>
    </section>
  );
}

function QuickSummarySection({ text }: { text: string }) {
  const bullets = parseQuickSummary(text);

  return (
    <section
      id="summary"
      className="mb-6 scroll-mt-32 overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/20"
    >
      <div className="flex items-center justify-between border-b border-emerald-100 px-6 py-4 dark:border-emerald-900">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900">
            <CheckSquare className="h-5 w-5 text-emerald-600 dark:text-emerald-400" aria-hidden />
          </div>
          <h2 className="font-bold text-slate-900 dark:text-text-primary">خلاصہ</h2>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
          یاد رکھیں
        </span>
      </div>
      <div className="px-6 py-6">
        <ul className="space-y-3">
          {bullets.map((bullet, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500">
                <CheckCircle2 className="h-3.5 w-3.5 text-white" aria-hidden />
              </span>
              <span className="text-base font-medium leading-relaxed text-slate-800 dark:text-slate-200">
                {bullet}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function SubtopicContent({ subtopic }: SubtopicContentProps) {
  const hasAny =
    subtopic.hook?.trim() ||
    subtopic.whatIsIt?.trim() ||
    subtopic.whyItMatters?.trim() ||
    subtopic.analogy?.trim() ||
    subtopic.howItWorks?.trim() ||
    subtopic.mathBehindIt?.trim() ||
    subtopic.realWorldEx?.trim() ||
    subtopic.codeExample?.trim() ||
    subtopic.commonMistakes?.trim() ||
    subtopic.comparison?.trim() ||
    subtopic.applications?.trim() ||
    subtopic.quickSummary?.trim() ||
    subtopic.quizData?.trim();

  if (!hasAny) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500 dark:border-slate-600 dark:bg-card">
        اس موضوع کا مواد جلد شامل کیا جائے گا۔
      </p>
    );
  }

  return (
    <article className="space-y-6 lg:space-y-8">
      {subtopic.hook?.trim() && <HookSection text={subtopic.hook} />}

      {subtopic.whatIsIt?.trim() && (
        <SectionShell
          id="what-is-it"
          title="یہ کیا ہے؟"
          icon={Brain}
          iconClass="bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
          headerClass="bg-blue-50/50 dark:bg-blue-950/30"
          accentClass="border-s-blue-500"
        >
          <ParagraphBody text={subtopic.whatIsIt} leadFirst />
        </SectionShell>
      )}

      {subtopic.whyItMatters?.trim() && (
        <SectionShell
          id="why-matters"
          title="یہ کیوں ضروری ہے؟"
          icon={CheckCircle2}
          iconClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
          headerClass="bg-emerald-50/50 dark:bg-emerald-950/30"
          accentClass="border-s-emerald-500"
        >
          {isBulletList(subtopic.whyItMatters) ? (
            <ul className="mt-2 space-y-3">
              {parseBulletLines(subtopic.whyItMatters).map((line, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2
                    className="mt-1 h-5 w-5 shrink-0 text-emerald-500"
                    aria-hidden
                  />
                  <span className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                    {line}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <ParagraphBody text={subtopic.whyItMatters} />
          )}
        </SectionShell>
      )}

      {subtopic.analogy?.trim() && <AnalogySection text={subtopic.analogy} />}

      {subtopic.howItWorks?.trim() && (
        <SectionShell
          id="how-works"
          title="یہ کیسے کام کرتا ہے؟"
          icon={Zap}
          iconClass="bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400"
          headerClass="bg-violet-50/50 dark:bg-violet-950/30"
          accentClass="border-s-violet-500"
        >
          {isNumberedSteps(subtopic.howItWorks) ? (
            <ol className="mt-2 space-y-4">
              {parseNumberedSteps(subtopic.howItWorks).map((step, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-600 font-sans text-small font-bold text-white">
                    {toUrduNumeral(i + 1)}
                  </span>
                  <span className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <ParagraphBody text={subtopic.howItWorks} />
          )}
        </SectionShell>
      )}

      {subtopic.mathBehindIt?.trim() && (
        <SectionShell
          id="math"
          title="ریاضی"
          icon={BarChart3}
          iconClass="bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
          headerClass="bg-amber-50/50 dark:bg-amber-950/30"
          accentClass="border-s-amber-500"
        >
          {isMathNotApplicable(subtopic.mathBehindIt) ? (
            <div className="flex items-center gap-3 rounded-xl bg-amber-50 p-4 dark:bg-amber-950/40">
              <Info className="h-5 w-5 text-amber-500" aria-hidden />
              <p className="text-amber-700 dark:text-amber-300">
                اس موضوع میں ریاضی شامل نہیں
              </p>
            </div>
          ) : (
            <InlineMathBody text={subtopic.mathBehindIt} />
          )}
        </SectionShell>
      )}

      {subtopic.realWorldEx?.trim() && (
        <SectionShell
          id="real-world"
          title="حقیقی مثالیں"
          icon={Globe}
          iconClass="bg-teal-100 text-teal-600 dark:bg-teal-950 dark:text-teal-400"
          headerClass="bg-teal-50/50 dark:bg-teal-950/30"
          accentClass="border-s-teal-500"
        >
          {(() => {
            const examples = splitRealWorldExamples(subtopic.realWorldEx);
            if (examples.length === 3) {
              return (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {examples.map((ex, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-teal-100 bg-teal-50 p-5 dark:border-teal-900 dark:bg-teal-950/30"
                    >
                      <p className="font-sans text-3xl font-bold text-teal-200">
                        {toUrduNumeral(i + 1)}
                      </p>
                      <p className="mt-2 text-small leading-relaxed text-slate-700 dark:text-slate-300">
                        {ex}
                      </p>
                    </div>
                  ))}
                </div>
              );
            }
            return (
              <div className="space-y-3">
                {examples.map((ex, i) => (
                  <div
                    key={i}
                    className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50"
                  >
                    {i === 0 && (
                      <MapPin
                        className="me-2 inline h-4 w-4 text-teal-500"
                        aria-hidden
                      />
                    )}
                    <span className="text-lg leading-[2.2] text-slate-700 dark:text-slate-300">
                      {ex}
                    </span>
                  </div>
                ))}
              </div>
            );
          })()}
        </SectionShell>
      )}

      {subtopic.codeExample?.trim() && (
        <>
          {hasUrduPythonSyntax(subtopic.codeExample) && (
            <div className="mb-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 dark:border-red-900 dark:bg-red-950/30">
              <AlertTriangle
                className="mt-0.5 h-5 w-5 shrink-0 text-red-500"
                aria-hidden
              />
              <p className="text-sm text-red-700 dark:text-red-300">
                نوٹ: یہ کوڈ درست نہیں ہو سکتا — جلد درست کیا جائے گا
              </p>
            </div>
          )}
          <SubtopicCodeBlock
            code={subtopic.codeExample}
            language={subtopic.codeLanguage}
          />
        </>
      )}

      {subtopic.commonMistakes?.trim() && (
        <CommonMistakesSection text={subtopic.commonMistakes} />
      )}

      {subtopic.comparison?.trim() && (
        <ComparisonSection text={subtopic.comparison} />
      )}

      {subtopic.applications?.trim() && (
        <SectionShell
          id="applications"
          title="عملی استعمال"
          icon={Sparkles}
          iconClass="bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400"
          headerClass="bg-rose-50/50 dark:bg-rose-950/30"
          accentClass="border-s-rose-500"
        >
          {(() => {
            const ideas = splitParagraphs(subtopic.applications);
            if (ideas.length >= 2) {
              return (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {ideas.map((idea, i) => {
                    const lines = idea.split("\n").filter(Boolean);
                    const titleLine = lines[0] ?? idea;
                    const desc = lines.slice(1).join(" ") || idea;
                    return (
                      <div
                        key={i}
                        className="rounded-xl border border-slate-200 p-4 transition-all hover:border-rose-200 hover:bg-rose-50/50 dark:border-slate-700 dark:hover:border-rose-900 dark:hover:bg-rose-950/20"
                      >
                        <p className="flex items-center gap-2 font-bold text-slate-900 dark:text-text-primary">
                          <Sparkles className="h-4 w-4 text-rose-400" aria-hidden />
                          {titleLine}
                        </p>
                        {lines.length > 1 && (
                          <p className="mt-2 text-small leading-relaxed text-slate-600 dark:text-text-muted">
                            {desc}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            }
            return <ParagraphBody text={subtopic.applications} />;
          })()}
        </SectionShell>
      )}

      {subtopic.quickSummary?.trim() && (
        <QuickSummarySection text={subtopic.quickSummary} />
      )}

      <SubtopicQuiz quizData={subtopic.quizData} />
    </article>
  );
}
