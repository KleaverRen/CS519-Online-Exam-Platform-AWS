// app/admin/exams/[examId]/questions/page.tsx
import { requireAdmin } from "../../../../../lib/authServer";
import { apiPost } from "../../../../../lib/api";
import AdminUploadQuestionsForm from "../../../../../components/AdminUploadQuestionsForm";
import Link from "next/link";

export default async function AdminQuestionsPage({
  params,
}: {
  params: { examId: string };
}) {
  await requireAdmin();
  const { examId } = params;

  async function uploadQuestions(formData: FormData) {
    "use server";

    const questionsJson = formData.get("questionsJson") as string;
    const openExamFlag = (formData.get("openExam") as string) || "";
    const openExam = openExamFlag === "on";

    let questions;
    try {
      questions = JSON.parse(questionsJson);
    } catch {
      throw new Error("Invalid JSON");
    }

    await apiPost(`/admin/exams/${examId}/questions`, {
      questions,
      openExam,
    });
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Upload Questions
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Attach questions to{" "}
            <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1 rounded">
              {examId}
            </span>{" "}
            and optionally open the exam for students.
          </p>
        </div>
        <Link
          href="/admin/exams"
          className="inline-flex items-center rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          ← Back to exams
        </Link>
      </div>

      <AdminUploadQuestionsForm examId={examId} action={uploadQuestions} />
    </div>
  );
}
