// app/profile/page.tsx
import { redirect } from "next/navigation";
import { getCurrentUser } from "../../lib/authServer";
import Link from "next/link";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  const isAdmin = user.groups.includes("admin");

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">My Profile</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Basic information about your exam account.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-6 space-y-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Account
          </h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-600 dark:text-slate-300">
                User ID (sub)
              </dt>
              <dd className="text-slate-900 dark:text-slate-100">{user.sub}</dd>
            </div>

            <div className="flex justify-between">
              <dt className="text-slate-600 dark:text-slate-300">Email</dt>
              <dd className="text-slate-900 dark:text-slate-100">
                {user.email ?? "—"}
              </dd>
            </div>
          </dl>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Roles
          </h2>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
            {isAdmin ? (
              <>
                You are a member of the{" "}
                <span className="font-semibold">admin</span> group and have
                access to instructor tools.
              </>
            ) : (
              "You are a student user with access to assigned exams and your own results."
            )}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {user.groups.length > 0 ? (
              user.groups.map((g) => (
                <span
                  key={g}
                  className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-200"
                >
                  {g}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-500 dark:text-slate-400">
                No explicit groups assigned.
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
        >
          Back to dashboard
        </Link>
        <Link
          href="/exams"
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-medium text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          Go to exams
        </Link>
      </div>
    </div>
  );
}
