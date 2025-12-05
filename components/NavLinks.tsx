// components/NavLinks.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  isAdmin: boolean;
};

export default function NavLinks({ isAdmin }: Props) {
  const pathname = usePathname();

  // Student menu
  const studentLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Exams", href: "/exams" },
    { name: "Results", href: "/results" },
    { name: "Profile", href: "/profile" },
  ];

  // Admin menu
  const adminLinks = [
    { name: "Admin Dashboard", href: "/admin" },
    { name: "Manage Exams", href: "/admin/exams" },
    { name: "Results", href: "/admin/results" }, // ⬅ new
  ];

  const visibleLinks = isAdmin ? adminLinks : studentLinks;

  // Pick the *single* best/longest match as active
  const activeHref = (() => {
    const hrefs = visibleLinks.map((l) => l.href);
    const matches = hrefs.filter(
      (href) => pathname === href || pathname.startsWith(href + "/")
    );
    if (matches.length === 0) return null;
    // Longest path wins (/admin/exams beats /admin)
    return matches.sort((a, b) => b.length - a.length)[0];
  })();

  return (
    <nav className="hidden md:flex items-center gap-3 text-sm">
      {visibleLinks.map((link) => {
        const isActive = link.href === activeHref;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`
              px-3 py-1.5 rounded-lg transition font-medium
              ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
              }
            `}
          >
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
}
