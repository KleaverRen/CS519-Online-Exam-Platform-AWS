// components/AppHeader.tsx
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { getCurrentUser } from "../lib/authServer";
import NavLinks from "./NavLinks";

export default async function AppHeader() {
  const user = await getCurrentUser();
  const isLoggedIn = !!user;
  const isAdmin = !!user?.groups?.includes("admin");

  const displayName = user?.email ?? user?.sub ?? "Guest";

  return (
    <header className="w-full bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
            EX
          </span>
          <div className="leading-tight">
            <div className="font-semibold text-sm">Online Exam Platform</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              CityU · CS519
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        {isLoggedIn && <NavLinks isAdmin={isAdmin} />}

        {/* Right side: Theme + Auth */}
        <div className="flex items-center gap-3 text-sm">
          <ThemeToggle />
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-xs text-slate-500 dark:text-slate-400 max-w-[120px] truncate">
                {displayName}
              </span>
              <Link
                href="/auth/logout"
                className="inline-flex items-center rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Sign out
              </Link>
            </div>
          ) : (
            <Link
              href="/"
              className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
