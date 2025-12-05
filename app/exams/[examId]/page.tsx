import ExamRunner from "../../../components/ExamRunner";
import { apiGet, apiPost } from "../../../lib/api";

type Question = {
  questionId: string;
  text: string;
  choices: string[];
  points: number;
};

type ExamDetail = {
  examId: string;
  examName: string;
  durationMinutes: number;
  questions: Question[];
};

async function getExam(examId: string): Promise<ExamDetail> {
  return apiGet(`/exams/${examId}/questions`);
}

export default async function ExamPage({
  params,
}: {
  params: Promise<{ examId: string }>;
}) {
  const { examId } = await params;
  const exam = await getExam(examId);

  async function submitAnswers(answers: Record<string, string>) {
    "use server";
    // ❌ remove redirect("/exams") here
    await apiPost(`/exams/${exam.examId}/submit`, { answers });
    // just return; ExamRunner will show its “submitted” UI
  }

  if (!exam || !exam.questions || exam.questions.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p>No questions found for this exam.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <ExamRunner exam={exam} submitAction={submitAnswers} />
    </div>
  );
}
