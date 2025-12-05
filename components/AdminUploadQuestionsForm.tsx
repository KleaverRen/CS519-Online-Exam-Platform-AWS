"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, CheckCircle2, Circle } from "lucide-react"; // Assuming you have lucide-react, or use text equivalents

// --- Types ---
interface QuestionState {
  questionId: string; // The actual ID sent to DB
  text: string;
  choices: string[];
  correctAnswer: string;
  points: number;
}

// --- Helpers ---
function randomId() {
  return "Q" + Math.random().toString(36).substring(2, 8).toUpperCase();
}

const EMPTY_QUESTION: QuestionState = {
  questionId: "",
  text: "",
  choices: ["", "", "", ""], // Default 4 empty choices
  correctAnswer: "",
  points: 1,
};

export default function AdminUploadQuestionsForm({
  examId,
  action,
}: {
  examId: string;
  action: (formData: FormData) => Promise<void>;
}) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openExam, setOpenExam] = useState(true);

  // State: Array of Question Objects
  // Use a lazy initializer so the shape is deterministic between server and client.
  // We intentionally keep `questionId` empty until client mount to avoid
  // generating different random IDs on server vs client (hydration mismatch).
  const [questions, setQuestions] = useState<QuestionState[]>(() => [
    { ...EMPTY_QUESTION },
  ]);

  // On first client mount, assign random IDs for any questions missing an ID.
  useEffect(() => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.questionId && q.questionId.trim() !== ""
          ? q
          : { ...q, questionId: randomId() }
      )
    );
  }, []);

  // --- Handlers ---

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        ...EMPTY_QUESTION,
        questionId: randomId(),
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuestion = (
    index: number,
    field: keyof QuestionState,
    value: string | number | boolean
  ) => {
    setQuestions((prev) => {
      const newQuestions = [...prev];
      newQuestions[index] = { ...newQuestions[index], [field]: value };
      return newQuestions;
    });
  };

  const updateChoice = (qIndex: number, cIndex: number, value: string) => {
    setQuestions((prev) => {
      const newQuestions = [...prev];
      const question = { ...newQuestions[qIndex] };
      const oldChoiceValue = question.choices[cIndex];

      // Update the choice text
      const newChoices = [...question.choices];
      newChoices[cIndex] = value;
      question.choices = newChoices;

      // If the modified choice was the correct answer, update the correct answer string too
      if (question.correctAnswer === oldChoiceValue) {
        question.correctAnswer = value;
      }

      newQuestions[qIndex] = question;
      return newQuestions;
    });
  };

  const addChoice = (qIndex: number) => {
    setQuestions((prev) => {
      const newQuestions = [...prev];
      newQuestions[qIndex] = {
        ...newQuestions[qIndex],
        choices: [...newQuestions[qIndex].choices, ""],
      };
      return newQuestions;
    });
  };

  const removeChoice = (qIndex: number, cIndex: number) => {
    setQuestions((prev) => {
      const newQuestions = [...prev];
      const question = newQuestions[qIndex];
      const choiceToRemove = question.choices[cIndex];

      // Remove choice
      question.choices = question.choices.filter((_, i) => i !== cIndex);

      // If we removed the correct answer, clear the correct answer field
      if (question.correctAnswer === choiceToRemove) {
        question.correctAnswer = "";
      }

      return newQuestions;
    });
  };

  const setCorrectChoice = (qIndex: number, choiceValue: string) => {
    updateQuestion(qIndex, "correctAnswer", choiceValue);
  };

  // --- Submission ---

  const handleSubmit = async (fd: FormData) => {
    setPending(true);
    setMessage(null);
    setError(null);

    // 1. Convert State to JSON String to match original backend expectation
    const cleanData = questions.map(({ ...rest }) => rest);

    // Basic Client-side Validation
    const isValid = cleanData.every(
      (q) => q.text && q.correctAnswer && q.choices.every((c) => c !== "")
    );

    if (!isValid) {
      setError(
        "Please fill out all question texts, choices, and select a correct answer for each."
      );
      setPending(false);
      return;
    }

    fd.set("questionsJson", JSON.stringify(cleanData));
    fd.set("openExam", openExam ? "on" : "");

    try {
      await action(fd);
      setMessage("Questions uploaded successfully.");
      // Optional: Reset form
      // setQuestions([EMPTY_QUESTION]);
    } catch (e) {
      console.error(e);
      setError("Failed to upload questions. Please try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <form
      action={handleSubmit}
      className="max-w-4xl bg-white dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-700 shadow p-6 space-y-8"
    >
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h2 className="text-xl font-semibold tracking-tight">
          Builder: Questions for {examId}
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Add questions, define choices, and click the circle to mark the
          correct answer.
        </p>
      </div>

      {/* --- Questions List --- */}
      <div className="space-y-6">
        {questions.map((q, qIndex) => (
          <div
            key={qIndex}
            className="relative rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/40 p-5 transition-all hover:border-blue-300 dark:hover:border-blue-800"
          >
            {/* Header: ID + Points + Delete */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-medium text-slate-500 bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded">
                  {q.questionId}
                </span>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase">
                    Points
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={q.points}
                    onChange={(e) =>
                      updateQuestion(
                        qIndex,
                        "points",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-16 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeQuestion(qIndex)}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                  title="Remove Question"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>

            {/* Question Text */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Question Text
              </label>
              <textarea
                value={q.text}
                onChange={(e) => updateQuestion(qIndex, "text", e.target.value)}
                placeholder="e.g. What is the capital of France?"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[60px]"
              />
            </div>

            {/* Choices */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Choices (Click circle to set correct answer)
              </label>

              {q.choices.map((choice, cIndex) => {
                const isCorrect = q.correctAnswer === choice && choice !== "";
                return (
                  <div key={cIndex} className="flex items-center gap-3">
                    {/* Correct Answer Toggle */}
                    <button
                      type="button"
                      onClick={() => setCorrectChoice(qIndex, choice)}
                      disabled={choice === ""}
                      className={`shrink-0 ${
                        isCorrect
                          ? "text-emerald-500"
                          : "text-slate-300 hover:text-slate-400"
                      }`}
                      title="Mark as correct answer"
                    >
                      {isCorrect ? (
                        <CheckCircle2 size={20} />
                      ) : (
                        <Circle size={20} />
                      )}
                    </button>

                    {/* Choice Input */}
                    <input
                      type="text"
                      value={choice}
                      onChange={(e) =>
                        updateChoice(qIndex, cIndex, e.target.value)
                      }
                      placeholder={`Choice ${cIndex + 1}`}
                      className={`flex-1 rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isCorrect
                          ? "border-emerald-500 bg-emerald-50/10 dark:border-emerald-800"
                          : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                      }`}
                    />

                    {/* Remove Choice */}
                    {q.choices.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeChoice(qIndex, cIndex)}
                        className="text-slate-300 hover:text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                );
              })}

              <button
                type="button"
                onClick={() => addChoice(qIndex)}
                className="mt-2 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <Plus size={14} /> Add another choice
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center py-2">
        <button
          type="button"
          onClick={addQuestion}
          className="flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <Plus size={16} /> Add New Question
        </button>
      </div>

      <hr className="border-slate-200 dark:border-slate-700" />

      {/* --- Footer Controls --- */}
      <div className="space-y-4">
        <label className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
          <input
            type="checkbox"
            checked={openExam}
            onChange={(e) => setOpenExam(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          Set exam status to <span className="font-semibold">OPEN</span> after
          upload
        </label>

        {message && (
          <div className="rounded-lg border border-emerald-300 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-900/40 px-3 py-2 text-xs text-emerald-800 dark:text-emerald-100 flex items-center gap-2">
            <CheckCircle2 size={16} /> {message}
          </div>
        )}
        {error && (
          <div className="rounded-lg border border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/40 px-3 py-2 text-xs text-red-800 dark:text-red-100">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
        >
          {pending ? "Uploading questions..." : "Save and Upload Questions"}
        </button>
      </div>
    </form>
  );
}
