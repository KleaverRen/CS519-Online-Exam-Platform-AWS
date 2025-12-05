// app/admin/exams/[examId]/results/page.tsx
import { requireAdmin } from "../../../../../lib/authServer";
import { apiGet } from "../../../../../lib/api";
import Link from "next/link";

type ExamResult = {
  studentId: string;
  email?: string;
  score?: number;
  maxScore?: number;
  submittedAt?: string;
};

type ExamInfo = {
  examId: string;
  examName?: string;
};

function formatDate(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminExamResultsPage({
  params,
}: {
  params: Promise<{ examId: string }>;
}) {
  await requireAdmin();

  const { examId } = await params;

  let results: ExamResult[] = [];
  let exam: ExamInfo = { examId };

  try {
    try {
      const examData = await apiGet(`/admin/exams/${examId}`);
      exam = { examId: examData.examId, examName: examData.examName };
    } catch {
      // ignore if not implemented
    }

    const data = await apiGet(`/admin/exams/${examId}/results`);
    results = data.results || [];
  } catch (err) {
    console.error("Failed to load exam results", err);
  }

  const attemptCount = results.length;
  const avgScore =
    attemptCount > 0
      ? results.reduce((sum, r) => sum + (r.score ?? 0), 0) / attemptCount
      : null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Results – {exam.examName || exam.examId}
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Viewing all submissions for{" "}
            <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1 rounded">
              {exam.examId}
            </span>
            .
          </p>
          {attemptCount > 0 && (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {attemptCount} attempt{attemptCount !== 1 && "s"} · Average score{" "}
              {avgScore != null ? avgScore.toFixed(1) : "—"}
            </p>
          )}
        </div>
        <Link
          href="/admin/results"
          className="inline-flex items-center rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          ← Back to results overview
        </Link>
      </div>

      {results.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 p-6 text-sm text-slate-600 dark:text-slate-300">
          No submissions yet for this exam.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-900/60">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Student Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Student ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Score
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Submitted
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {results.map((r, idx) => {
                const score =
                  r.maxScore != null
                    ? `${r.score ?? "—"} / ${r.maxScore}`
                    : r.score ?? "—";

                return (
                  <tr
                    key={`${r.studentId}-${idx}`}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/60"
                  >
                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-slate-100">
                      {r.email || "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-800 dark:text-slate-100">
                      {r.studentId}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-800 dark:text-slate-100">
                      {score}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200">
                      {formatDate(r.submittedAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
