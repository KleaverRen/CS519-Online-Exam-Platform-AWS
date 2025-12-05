// app/dashboard/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "../../lib/authServer";
import { apiGet } from "../../lib/api";

export default async function StudentDashboardPage() {
  const user = await getCurrentUser();

  // Not logged in → redirect to login
  if (!user) redirect("/");

  // If admin → go to admin dashboard
  if (user.groups.includes("admin")) redirect("/admin");

  const displayName = user.email ?? user.sub;

  // Fetch open exams
  let exams = [];
  try {
    const data = await apiGet("/exams");
    exams = data.exams || [];
  } catch (err) {
    console.error("Failed to load exams", err);
  }

  // Fetch recent results
  let latestResult = null;
  try {
    const data = await apiGet("/students/me/results");
    const results = data.results || [];

    // Sort newest → oldest
    results.sort((a: any, b: any) => {
      return (
        new Date(b.submissionTime).getTime() -
        new Date(a.submissionTime).getTime()
      );
    });

    latestResult = results[0] ?? null;
  } catch (err) {
    console.error("Failed to load results", err);
  }

  const openCount = exams.length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Student Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Welcome back, <span className="font-medium">{displayName}</span>.
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Open Exams */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Open Exams
          </p>
          <p className="mt-2 text-3xl font-semibold">{openCount}</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            You can start any available exam.
          </p>
        </div>

        {/* Latest Result */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm col-span-2">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Latest Result
          </p>

          {latestResult ? (
            <div className="mt-2 space-y-1">
              <p className="text-lg font-medium">
                {latestResult.examName ?? "Exam"}
              </p>
              <p className="text-slate-700 dark:text-slate-300">
                Score:{" "}
                <span className="font-semibold">{latestResult.score}</span>
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Submitted: {latestResult.submissionTime}
              </p>
            </div>
          ) : (
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              No results yet — complete an exam to see your scores here.
            </p>
          )}
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Take Exams */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              Take an exam
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              View all available exams and start when ready.
            </p>
          </div>
          <div className="mt-4">
            <Link
              href="/exams"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
            >
              Go to exams list
            </Link>
          </div>
        </div>

        {/* Results */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">My Results</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              See your exam scores and history.
            </p>
          </div>
          <div className="mt-4">
            <Link
              href="/results"
              className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700"
            >
              View results
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 px-4 py-3 text-xs text-slate-600 dark:text-slate-300">
        If an expected exam isn’t showing, try refreshing or contact your
        instructor.
      </div>
    </div>
  );
}
