// components/AdminUploadQuestionsForm.tsx
"use client";

import { useState } from "react";

const SAMPLE_JSON = `[
  {
    "questionId": "Q1",
    "text": "What is 2 + 2?",
    "choices": ["1", "2", "3", "4"],
    "correctAnswer": "4",
    "points": 1
  },
  {
    "questionId": "Q2",
    "text": "What is 5 - 3?",
    "choices": ["1", "2", "3", "4"],
    "correctAnswer": "2",
    "points": 1
  }
]`;

export default function AdminUploadQuestionsForm({
  examId,
  action,
}: {
  examId: string;
  action: (formData: FormData) => Promise<void>;
}) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openExam, setOpenExam] = useState(true);
  const [text, setText] = useState(SAMPLE_JSON);

  return (
    <form
      action={async (fd) => {
        setPending(true);
        setMessage(null);
        setError(null);

        fd.set("questionsJson", text);
        fd.set("openExam", openExam ? "on" : "");

        try {
          await action(fd);
          setMessage("Questions uploaded successfully.");
        } catch (e) {
          console.error(e);
          setError(
            "Failed to upload questions. Please verify the JSON format."
          );
        } finally {
          setPending(false);
        }
      }}
      className="max-w-4xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md px-6 py-6 space-y-5"
    >
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4 mb-2">
        <h2 className="text-xl font-semibold tracking-tight">
          Upload questions for {examId}
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Provide a JSON array of questions. Each question should include a
          unique{" "}
          <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded text-[11px]">
            questionId
          </code>
          .
        </p>
      </div>

      <details className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 px-3 py-2 text-xs">
        <summary className="cursor-pointer font-medium text-slate-700 dark:text-slate-200">
          View example JSON format
        </summary>
        <pre className="mt-2 overflow-x-auto whitespace-pre-wrap bg-slate-900 text-slate-50 text-[11px] rounded-lg p-3">
          {SAMPLE_JSON}
        </pre>
      </details>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Questions JSON
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full min-h-[220px] rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-950/60 px-3 py-2 text-xs font-mono text-slate-900 dark:text-slate-100
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Make sure the JSON is valid. Each question must include{" "}
          <code>questionId</code>, <code>text</code>, <code>choices</code>,{" "}
          <code>correctAnswer</code>, and <code>points</code>.
        </p>
      </div>

      <label className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
        <input
          type="checkbox"
          checked={openExam}
          onChange={(e) => setOpenExam(e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />
        Set exam status to <span className="font-semibold">OPEN</span> after
        upload
      </label>

      {message && (
        <div className="rounded-lg border border-emerald-300 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-900/40 px-3 py-2 text-xs text-emerald-800 dark:text-emerald-100">
          {message}
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/40 px-3 py-2 text-xs text-red-800 dark:text-red-100">
          {error}
        </div>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {pending ? "Uploading questions..." : "Upload questions"}
        </button>
      </div>
    </form>
  );
}
