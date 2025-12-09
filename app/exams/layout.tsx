import { getCurrentUser } from "../../lib/authServer";
import { redirect } from "next/navigation";

export default async function ExamsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/"); // must login

  if (user.groups.includes("admin")) {
    redirect("/admin");
  }

  return children;
}
