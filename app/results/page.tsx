// app/results/page.tsx
import { redirect } from "next/navigation";
import { apiGet } from "../../lib/api";
import { getCurrentUser } from "../../lib/authServer";

type StudentResult = {
  examId: string;
  examName?: string;
  score?: number;
  maxScore?: number;
  submissionTime?: string;
  submittedAt?: string;
  attemptKey?: string;
};

function formatDateTime(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (isNaN(date.getTime())) return value;
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function ResultsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  // If this is an admin, send them to admin area (optional)
  if (user.groups.includes("admin")) {
    redirect("/admin");
  }

  let results: StudentResult[] = [];

  try {
    const data = await apiGet("/students/me/results");
    results = (data.results || []) as StudentResult[];

    // Newest first
    results.sort((a, b) => {
      const aTime = a.submissionTime || a.submittedAt || "";
      const bTime = b.submissionTime || b.submittedAt || "";
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    });
  } catch (err) {
    console.error("Failed to load results", err);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">My Results</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Review your past exam attempts and scores.
        </p>
      </div>

      {results.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 p-8 text-center">
          <p className="text-base font-medium text-slate-700 dark:text-slate-100">
            No results yet.
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Once you complete an exam, your scores will appear here.
          </p>
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
                  Score
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Submitted
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {results.map((r, idx) => {
                const submitted =
                  r.submissionTime || r.submittedAt || undefined;
                const score =
                  r.maxScore !== undefined && r.maxScore !== null
                    ? `${r.score ?? "—"} / ${r.maxScore}`
                    : r.score ?? "—";

                return (
                  <tr
                    key={r.attemptKey || `${r.examId}-${idx}`}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/60"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-100">
                      <div className="flex flex-col">
                        <span>{r.examName || r.examId}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {r.examId}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-800 dark:text-slate-100">
                      {score}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200">
                      {formatDateTime(submitted)}
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
