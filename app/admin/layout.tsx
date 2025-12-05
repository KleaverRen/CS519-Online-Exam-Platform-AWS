// app/admin/layout.tsx
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "../../lib/authServer";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();

  // Not logged in or not in admin group → bounce to home
  if (!user || !user.groups.includes("admin")) {
    redirect("/");
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Admin Area</h2>
          <p className="text-sm text-slate-600">
            Signed in as {user.email ?? user.sub} (admin)
          </p>
        </div>
      </header>
      {children}
    </div>
  );
}
