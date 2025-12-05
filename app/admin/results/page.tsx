// app/admin/results/page.tsx
import { requireAdmin } from "../../../lib/authServer";
import { apiGet } from "../../../lib/api";
import Link from "next/link";

type AdminExam = {
  examId: string;
  examName?: string;
  status?: string;
  attempts?: number;
  averageScore?: number;
};

export default async function AdminResultsOverviewPage() {
  await requireAdmin();

  let exams: AdminExam[] = [];

  try {
    const data = await apiGet("/admin/exams");
    exams = data.exams || [];
  } catch (err) {
    console.error("Failed to load admin exams list", err);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Exam Results (Admin)
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Select an exam to review student scores and submission details.
        </p>
      </div>

      {exams.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 p-6 text-sm text-slate-600 dark:text-slate-300">
          No exams found. Create an exam first on the{" "}
          <Link
            href="/admin/exams"
            className="text-blue-600 dark:text-blue-400 underline"
          >
            Manage Exams
          </Link>{" "}
          page.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-900/60">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Exam
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Attempts
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Avg score
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {exams.map((exam) => (
                <tr
                  key={exam.examId}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/60"
                >
                  <td className="px-4 py-3 text-sm text-slate-900 dark:text-slate-100">
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {exam.examName || exam.examId}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {exam.examId}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium border ${
                        exam.status === "OPEN"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-200 dark:border-emerald-600"
                          : exam.status === "DRAFT"
                          ? "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-600"
                          : "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-900/40 dark:text-amber-200 dark:border-amber-600"
                      }`}
                    >
                      {exam.status ?? "Unknown"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-slate-800 dark:text-slate-100">
                    {exam.attempts ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-slate-800 dark:text-slate-100">
                    {exam.averageScore != null
                      ? exam.averageScore.toFixed(1)
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/exams/${exam.examId}/results`}
                      className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-700"
                    >
                      View results
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
