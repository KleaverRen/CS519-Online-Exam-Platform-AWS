// components/ExamRunner.tsx
"use client";

import { useState, useCallback, useRef } from "react";
import Timer from "./Timer";
import Link from "next/link";

type Question = {
  questionId: string;
  text: string;
  choices: string[];
  points: number;
};

type ExamDetail = {
  examId: string;
  examName: string;
  durationMinutes: number;
  questions: Question[];
};

type ExamRunnerProps = {
  exam: ExamDetail;
  submitAction: (answers: Record<string, string>) => Promise<void>;
};

export default function ExamRunner({ exam, submitAction }: ExamRunnerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const submitOnceGuard = useRef(false);

  const question = exam.questions[currentQuestionIndex];

  function selectAnswer(choice: string) {
    setAnswers((prev) => ({ ...prev, [question.questionId]: choice }));
  }

  function goPrevious() {
    setCurrentQuestionIndex((i) => Math.max(i - 1, 0));
  }

  function goNext() {
    setCurrentQuestionIndex((i) => Math.min(i + 1, exam.questions.length - 1));
  }

  const handleSubmit = useCallback(
    async (auto = false) => {
      if (submitOnceGuard.current) return;
      submitOnceGuard.current = true;

      setSubmitting(true);
      try {
        await submitAction(answers);
        setSubmitted(true);
      } catch (e) {
        console.error("Submit failed", e);
        // if submit failed, allow retry
        submitOnceGuard.current = false;
        if (auto) {
          alert(
            "Time is up, but we could not submit your exam. Please try again."
          );
        } else {
          alert("Submission failed. Please try again.");
        }
      } finally {
        setSubmitting(false);
      }
    },
    [answers, submitAction]
  );

  const handleTimerExpire = useCallback(() => {
    // Auto-submit when time runs out
    handleSubmit(true);
  }, [handleSubmit]);

  if (submitted) {
    return (
      <div className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl shadow p-6 space-y-3">
        <h2 className="text-2xl font-semibold">Exam submitted</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Your answers have been submitted. You can return to the exams list to
          take another exam or review your results (if enabled).
        </p>
        <Link
          href="/exams"
          className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Back to exams
        </Link>
      </div>
    );
  }

  const totalQuestions = exam.questions.length;
  const currentNumber = currentQuestionIndex + 1;

  return (
    <div className="space-y-5 text-slate-900 dark:text-slate-100">
      {/* Header with title + timer */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {exam.examName}
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Question {currentNumber} of {totalQuestions} ·{" "}
            {exam.durationMinutes} minute exam
          </p>
        </div>
        <Timer minutes={exam.durationMinutes} onExpire={handleTimerExpire} />
      </header>

      {/* Progress bar */}
      <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-blue-600 transition-all"
          style={{
            width: `${(currentNumber / totalQuestions) * 100}%`,
          }}
        />
      </div>

      {/* Question card */}
      <div className="bg-white text-slate-900 rounded-xl shadow border border-slate-200 p-6 dark:bg-slate-900 dark:border-slate-700">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-2">
          Question {currentNumber} of {totalQuestions}
        </p>
        <h3 className="font-semibold mb-4 text-lg text-slate-900 dark:text-slate-100">
          {question.text}
        </h3>

        <div className="space-y-2">
          {question.choices.map((choice) => {
            const selected = answers[question.questionId] === choice;
            return (
              <button
                key={choice}
                type="button"
                onClick={() => selectAnswer(choice)}
                className={`w-full text-left px-3 py-2 rounded-lg border text-sm transition
                  ${
                    selected
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-white text-slate-900 border-slate-300 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-600 dark:hover:bg-slate-800"
                  }
                `}
              >
                {choice}
              </button>
            );
          })}
        </div>
      </div>

      {/* Question index dots */}
      <div className="flex flex-wrap gap-2">
        {exam.questions.map((q, idx) => {
          const answered = answers[q.questionId] !== undefined;
          const isCurrent = idx === currentQuestionIndex;
          return (
            <button
              key={q.questionId}
              type="button"
              onClick={() => setCurrentQuestionIndex(idx)}
              className={`h-8 w-8 rounded-full text-xs font-medium flex items-center justify-center border transition
                ${
                  isCurrent
                    ? "bg-blue-600 text-white border-blue-600"
                    : answered
                    ? "bg-emerald-50 text-emerald-700 border-emerald-500 dark:bg-emerald-900/40 dark:text-emerald-200 dark:border-emerald-400"
                    : "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-600"
                }
              `}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Navigation + submit */}
      <div className="flex justify-between items-center gap-3">
        <button
          type="button"
          onClick={goPrevious}
          disabled={currentQuestionIndex === 0 || submitting}
          className="px-4 py-2 rounded-lg bg-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed dark:bg-slate-800 dark:text-slate-200"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={goNext}
          disabled={
            currentQuestionIndex === exam.questions.length - 1 || submitting
          }
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>

      <button
        type="button"
        onClick={() => handleSubmit(false)}
        disabled={submitting}
        className="w-full mt-2 py-3 rounded-lg bg-green-600 text-white text-lg font-semibold hover:bg-green-700 disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Submit Exam"}
      </button>
    </div>
  );
}
