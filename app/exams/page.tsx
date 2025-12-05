// app/exams/page.tsx
import { apiGet } from "../../lib/api";
import Link from "next/link";

type Exam = {
  examId: string;
  examName: string;
  status: string;
  durationMinutes: number;
  startTime?: string;
  endTime?: string;
};

async function getExams(): Promise<Exam[]> {
  const data = await apiGet("/exams");
  return data.exams || [];
}

export default async function ExamsPage() {
  let exams: Exam[] = [];
  try {
    exams = await getExams();
  } catch {
    // if not authenticated, redirect to home
    return (
      <div className="p-6">
        <p>You must be signed in to view exams.</p>
        <Link href="/" className="text-blue-600 underline">
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-6 flex items-baseline justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">
            Available Exams
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Select an exam to begin. Make sure you have a stable connection and
            enough time to finish.
          </p>
        </div>
      </div>
      {exams.length === 0 && (
        <div className="mt-8 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 p-8 text-center">
          <p className="text-base font-medium text-slate-700 dark:text-slate-100">
            No open exams at the moment.
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Check back later or contact your instructor if you believe this is
            an error.
          </p>
        </div>
      )}

      <div className="space-y-4 mt-2">
        {exams.map((exam) => (
          <div
            key={exam.examId}
            className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm px-5 py-4 flex justify-between items-center gap-4 transition hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-lg tracking-tight">
                  {exam.examName}
                </h3>
                <span className="inline-flex items-center rounded-full border border-emerald-500/70 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:border-emerald-400/70 dark:bg-emerald-900/40 dark:text-emerald-200">
                  {exam.status === "OPEN" ? "Open" : exam.status}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Duration: {exam.durationMinutes} minutes
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {exam.startTime && exam.endTime
                  ? `Window: ${exam.startTime} – ${exam.endTime}`
                  : exam.startTime
                  ? `Opens at: ${exam.startTime}`
                  : exam.endTime
                  ? `Closes at: ${exam.endTime}`
                  : "No scheduled time window"}
              </p>
            </div>
            <Link
              href={`/exams/${exam.examId}`}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
            >
              Start
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
