// app/admin/exams/page.tsx
import { requireAdmin } from "../../../lib/authServer";
import { apiGet, apiPost } from "../../../lib/api";
import AdminCreateExamForm from "../../../components/AdminCreateExamForm";
import Link from "next/link";

type AdminExam = {
  examId: string;
  examName?: string;
  status?: string;
  durationMinutes?: number;
};

export default async function AdminExamsPage() {
  await requireAdmin();

  async function createExam(formData: FormData) {
    "use server";
    const examId = formData.get("examId") as string;
    const examName = formData.get("examName") as string;
    const durationMinutes = Number(formData.get("durationMinutes") || 0);
    const startTime = (formData.get("startTime") as string) || null;
    const endTime = (formData.get("endTime") as string) || null;

    await apiPost("/admin/exams", {
      examId,
      examName,
      durationMinutes,
      startTime,
      endTime,
    });
  }

  let exams: AdminExam[] = [];
  try {
    const data = await apiGet("/admin/exams");
    exams = data.exams || [];
  } catch (e) {
    console.error("Failed to load exams for admin", e);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Manage Exams</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Create exams and upload questions. Students only see exams marked as
          OPEN.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] items-start">
        {/* Left: Create exam card */}
        <AdminCreateExamForm action={createExam} />

        {/* Right: exams list */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Existing exams
          </h2>

          {exams.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 p-6 text-sm text-slate-600 dark:text-slate-300">
              No exams yet. Create an exam using the form on the left.
            </div>
          ) : (
            <div className="space-y-3">
              {exams.map((exam) => (
                <div
                  key={exam.examId}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 flex items-center justify-between gap-4 shadow-sm"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {exam.examName || exam.examId}
                      </p>
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
                    </div>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      ID: {exam.examId} ·{" "}
                      {exam.durationMinutes
                        ? `${exam.durationMinutes} minutes`
                        : "Duration not set"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/exams/${exam.examId}/questions`}
                      className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-700"
                    >
                      Upload questions
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Tip: After uploading questions, make sure the exam status is set to{" "}
            <span className="font-semibold">OPEN</span> so students can see it.
          </p>
        </div>
      </div>
    </div>
  );
}
