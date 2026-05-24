"use client";

import { useState } from "react";
import {
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronLeft,
  Info,
  RefreshCw,
  Star,
  Trophy,
  XCircle,
} from "lucide-react";
import { parseQuizData } from "@/types";
import { cn, toUrduNumeral } from "@/lib/utils";

const OPTION_LETTERS = ["A", "B", "C", "D"];

type SubtopicQuizProps = {
  quizData: string | null;
};

export default function SubtopicQuiz({ quizData }: SubtopicQuizProps) {
  const questions = parseQuizData(quizData);

  const [answers, setAnswers] = useState<(number | null)[]>(
    () => Array(questions.length).fill(null),
  );
  const [showResults, setShowResults] = useState(false);

  if (questions.length === 0) return null;

  const score = questions.filter(
    (q, i) => answers[i] === q.correctIndex,
  ).length;

  const allAnswered = answers.every((a) => a !== null);

  const resetQuiz = () => {
    setAnswers(Array(questions.length).fill(null));
    setShowResults(false);
  };

  const resultTone =
    score === questions.length
      ? "emerald"
      : score >= questions.length - 1 && questions.length > 1
        ? "blue"
        : "amber";

  return (
    <section
      id="quiz"
      className="scroll-mt-32 mb-6 overflow-hidden rounded-2xl border-2 border-blue-200 bg-white dark:border-blue-800 dark:bg-card"
    >
      <div className="flex items-center justify-between border-b border-blue-100 bg-blue-50 px-6 py-4 dark:border-blue-900 dark:bg-blue-950/40">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900">
            <Brain className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden />
          </div>
          <h2 className="font-bold text-slate-900 dark:text-text-primary">
            اپنی سمجھ جانچیں
          </h2>
        </div>
        {showResults && (
          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
            {toUrduNumeral(score)} / {toUrduNumeral(questions.length)} درست
          </span>
        )}
      </div>

      <div className="space-y-6 px-6 py-6">
        {questions.map((question, qIndex) => (
          <div
            key={qIndex}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800/50"
          >
            <div className="mb-4 flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                {toUrduNumeral(qIndex + 1)}
              </span>
              <p className="mr-3 text-base font-semibold leading-relaxed text-slate-900 dark:text-text-primary">
                {question.question}
              </p>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2">
              {question.options.map((option, oIndex) => {
                const isSelected = answers[qIndex] === oIndex;
                const isCorrect = oIndex === question.correctIndex;

                let stateClass =
                  "bg-white border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-700 cursor-pointer dark:bg-slate-900 dark:border-slate-600 dark:hover:border-blue-700 dark:hover:bg-blue-950/30";

                if (showResults) {
                  if (isSelected && isCorrect) {
                    stateClass =
                      "bg-emerald-50 border-emerald-400 text-emerald-800 cursor-default dark:bg-emerald-950/40 dark:border-emerald-600 dark:text-emerald-200";
                  } else if (isSelected && !isCorrect) {
                    stateClass =
                      "bg-red-50 border-red-400 text-red-800 cursor-default dark:bg-red-950/40 dark:border-red-600 dark:text-red-200";
                  } else if (!isSelected && isCorrect) {
                    stateClass =
                      "bg-emerald-50 border-emerald-200 text-emerald-700 cursor-default dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-300";
                  } else {
                    stateClass =
                      "opacity-50 cursor-default bg-white border-slate-200 text-slate-700 dark:bg-slate-900 dark:border-slate-700";
                  }
                }

                return (
                  <button
                    key={oIndex}
                    type="button"
                    disabled={showResults}
                    onClick={() => {
                      if (showResults) return;
                      setAnswers((prev) => {
                        const next = [...prev];
                        next[qIndex] = oIndex;
                        return next;
                      });
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-right text-sm transition-all duration-200",
                      stateClass,
                    )}
                  >
                    <span className="flex-1 leading-relaxed">{option}</span>
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                      {OPTION_LETTERS[oIndex] ?? String(oIndex + 1)}
                    </span>
                    {showResults && isSelected && isCorrect && (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" aria-hidden />
                    )}
                    {showResults && isSelected && !isCorrect && (
                      <XCircle className="h-5 w-5 shrink-0 text-red-500" aria-hidden />
                    )}
                  </button>
                );
              })}
            </div>

            {showResults && (
              <div className="mt-4 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/30">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" aria-hidden />
                <div>
                  <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                    وضاحت:
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    {question.explanation}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}

        {!showResults && (
          <button
            type="button"
            disabled={!allAnswered}
            onClick={() => setShowResults(true)}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 font-bold text-white transition-all duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            نتیجہ دیکھیں
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
        )}

        {showResults && (
          <div
            className={cn(
              "mt-6 rounded-2xl border-2 p-6 text-center",
              resultTone === "emerald" &&
                "border-emerald-400 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/30",
              resultTone === "blue" &&
                "border-blue-400 bg-blue-50 dark:border-blue-700 dark:bg-blue-950/30",
              resultTone === "amber" &&
                "border-amber-400 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/30",
            )}
          >
            {resultTone === "emerald" && (
              <>
                <Trophy className="mx-auto mb-3 h-12 w-12 text-emerald-500" aria-hidden />
                <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300">
                  شاندار! آپ نے سب صحیح کیا!
                </p>
              </>
            )}
            {resultTone === "blue" && (
              <>
                <Star className="mx-auto mb-3 h-12 w-12 text-blue-500" aria-hidden />
                <p className="text-xl font-bold text-blue-700 dark:text-blue-300">
                  بہت اچھا! تھوڑی اور مشق کریں
                </p>
              </>
            )}
            {resultTone === "amber" && (
              <>
                <BookOpen className="mx-auto mb-3 h-12 w-12 text-amber-500" aria-hidden />
                <p className="text-xl font-bold text-amber-700 dark:text-amber-300">
                  دوبارہ پڑھیں اور کوشش کریں
                </p>
              </>
            )}

            <p
              className={cn(
                "mt-2 text-4xl font-bold",
                resultTone === "emerald" && "text-emerald-600",
                resultTone === "blue" && "text-blue-600",
                resultTone === "amber" && "text-amber-600",
              )}
            >
              {toUrduNumeral(score)} / {toUrduNumeral(questions.length)}
            </p>
            <p className="mt-1 text-sm text-slate-500">سوالات درست</p>

            <button
              type="button"
              onClick={resetQuiz}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-100 px-6 py-2.5 font-medium text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <RefreshCw className="h-4 w-4" aria-hidden />
              دوبارہ کوشش کریں
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
