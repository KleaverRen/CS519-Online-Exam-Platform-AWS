// app/admin/page.tsx
import { requireAdmin } from "../../lib/authServer";
import { apiGet } from "../../lib/api";
import Link from "next/link";

type AdminExam = {
  examId: string;
  examName?: string;
  status?: string;
};

export default async function AdminDashboardPage() {
  await requireAdmin();

  let exams: AdminExam[] = [];

  try {
    // If you don't have this endpoint yet, either add it on the backend
    // or temporarily comment out this call.
    const data = await apiGet("/admin/exams");
    exams = data.exams || [];
  } catch (e) {
    console.error("Failed to load admin exams list", e);
  }

  const totalExams = exams.length;
  const openExams = exams.filter((e) => e.status === "OPEN").length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Admin Area</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Create exams, upload questions, and review the status of your tests.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Total exams
          </p>
          <p className="mt-2 text-3xl font-semibold">{totalExams}</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            All exams you’ve created.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Open exams
          </p>
          <p className="mt-2 text-3xl font-semibold">{openExams}</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Currently available to students.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Actions
          </p>
          <ul className="mt-2 text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <li>• Create a new exam</li>
            <li>• Upload questions</li>
            <li>• Monitor exam status</li>
          </ul>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              Create and manage exams
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Define new exams and manage existing ones, including uploading
              questions.
            </p>
          </div>
          <div className="mt-4">
            <Link
              href="/admin/exams"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
            >
              Go to exams admin
            </Link>
          </div>
        </div>

        {/* RESULTS CARD (Updated) */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              View student results
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Review submission history and performance across all exams.
            </p>
          </div>
          <div className="mt-4">
            <Link
              href="/admin/results"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
            >
              Go to results
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
