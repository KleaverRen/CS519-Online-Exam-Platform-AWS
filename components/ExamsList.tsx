"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";

type AdminExam = {
  examId: string;
  examName?: string;
  status?: string;
  durationMinutes?: number;
};

export default function ExamsList({
  initialExams,
}: {
  initialExams: AdminExam[];
}) {
  const router = useRouter();
  const [isRefreshing, startTransition] = useTransition();

  // ✅ Use props directly so when the server re-renders with new data,
  // this component shows the latest list.
  const exams = initialExams || [];

  const totalExams = exams.length;
  const openExams = exams.filter((e) => e.status === "OPEN").length;

  function handleRefresh() {
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      {/* Header with counts + refresh */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">
            Existing exams
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Total: <span className="font-medium">{totalExams}</span> · Open:{" "}
            <span className="font-medium">{openExams}</span>
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw size={18} />
          {isRefreshing ? "Refreshing…" : "Refresh list"}
        </button>
      </div>

      {/* List */}
      {exams.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No exams yet. Create your first exam on the left.
        </p>
      ) : (
        <div className="space-y-3">
          {exams.map((exam) => (
            <div
              key={exam.examId}
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="flex flex-col">
                <span className="font-medium text-slate-900 dark:text-slate-50">
                  {exam.examName || "(Untitled exam)"}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  ID: {exam.examId}
                  {typeof exam.durationMinutes === "number" &&
                    ` · ${exam.durationMinutes} min`}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                    exam.status === "OPEN"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200"
                      : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200"
                  }`}
                >
                  {exam.status || "DRAFT"}
                </span>

                <Link
                  href={`/admin/exams/${exam.examId}/questions`}
                  className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
                >
                  Upload
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tip */}
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Tip: After uploading questions, set the exam status to{" "}
        <span className="font-semibold">OPEN</span> so students can see it.
      </p>
    </div>
  );
}
