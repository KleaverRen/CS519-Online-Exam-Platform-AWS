// app/admin/exams/page.tsx
import { requireAdmin } from "../../../lib/authServer";
import { apiGet, apiPost } from "../../../lib/api";
import AdminCreateExamForm from "../../../components/AdminCreateExamForm";
import ExamsList from "../../../components/ExamsList";
import { revalidatePath } from "next/cache";

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
    revalidatePath("/admin/exams");
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
        <ExamsList initialExams={exams} />
      </div>
    </div>
  );
}
