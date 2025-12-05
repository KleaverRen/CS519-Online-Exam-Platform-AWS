// components/AdminCreateExamForm.tsx
"use client";

import { useState } from "react";

export default function AdminCreateExamForm({
  action,
}: {
  action: (formData: FormData) => Promise<void>;
}) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      action={async (fd) => {
        setPending(true);
        setMessage(null);
        setError(null);
        try {
          await action(fd);
          setMessage(
            "Exam created successfully. You can now upload questions."
          );
        } catch (e) {
          console.error(e);
          setError(
            "Failed to create exam. Please check the fields and try again."
          );
        } finally {
          setPending(false);
        }
      }}
      className="max-w-3xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md px-6 py-6 space-y-5"
    >
      {/* Card header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4 mb-2">
        <h3 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
          Create a New Exam
        </h3>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Define the basic details for this exam. You’ll add questions in the
          next step.
        </p>
      </div>

      {/* Exam ID */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Exam ID
        </label>
        <input
          name="examId"
          className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-950/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-100
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="EXAM_MATH_101"
          required
        />
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Use a stable identifier (no spaces) – students will not see this ID.
        </p>
      </div>

      {/* Exam name */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Exam name
        </label>
        <input
          name="examName"
          className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-950/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-100
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Basic Math Quiz"
          required
        />
      </div>

      {/* Duration */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Duration (minutes)
        </label>
        <input
          type="number"
          name="durationMinutes"
          min={1}
          className="w-40 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-950/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-100
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          defaultValue={30}
          required
        />
      </div>

      {/* Time window */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Time window (optional)
        </label>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Start time (ISO)
            </span>
            <input
              name="startTime"
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-950/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-100
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="2025-12-02T18:00:00Z"
            />
          </div>
          <div className="space-y-1">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              End time (ISO)
            </span>
            <input
              name="endTime"
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-950/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-100
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="2025-12-02T19:00:00Z"
            />
          </div>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Leave both blank to allow students to take the exam at any time. Times
          must be in UTC ISO format.
        </p>
      </div>

      {/* Messages */}
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

      {/* Submit button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {pending ? "Creating exam..." : "Create Exam"}
        </button>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400">
        After creating an exam, you&apos;ll upload questions at{" "}
        <code className="rounded bg-slate-100 dark:bg-slate-800 px-1 py-0.5 text-[11px]">
          /admin/exams/&lt;examId&gt;/questions
        </code>
        .
      </p>
    </form>
  );
}
