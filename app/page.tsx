// app/page.tsx
import Link from "next/link";
import { getHostedLoginUrl } from "../lib/auth";

export default function HomePage() {
  const loginUrl = getHostedLoginUrl();

  return (
    <div className="flex flex-col items-center justify-center h-full py-24">
      <h2 className="text-2xl font-semibold mb-4">
        Welcome to the Exam Portal
      </h2>
      <p className="mb-8">Sign in to see and take your available exams.</p>
      <a
        href={loginUrl}
        className="px-6 py-3 rounded bg-blue-600 text-white hover:bg-blue-700"
      >
        Sign in with Cognito
      </a>
    </div>
  );
}
