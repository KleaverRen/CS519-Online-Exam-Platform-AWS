// lib/authServer.ts
import { cookies } from "next/headers";
import { parseJwt } from "./jwt";

export type CurrentUser = {
  sub: string;
  email?: string;
  groups: string[];
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  // 🚫 const idCookie = cookies().get("id_token");
  const cookieStore = await cookies();          // ⬅️ NEW
  const idCookie = cookieStore.get("id_token");

  if (!idCookie) return null;

  try {
    const decoded = parseJwt(idCookie.value);

    let groups: string[] = [];
    const rawGroups = decoded["cognito:groups"];
    if (Array.isArray(rawGroups)) groups = rawGroups;
    else if (typeof rawGroups === "string") groups = [rawGroups];

    return {
      sub: decoded.sub,
      email: decoded.email,
      groups,
    };
  } catch (e) {
    console.error("Failed to parse id_token", e);
    return null;
  }
}

export async function requireAdmin(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user || !user.groups.includes("admin")) {
    throw new Error("NOT_ADMIN");
  }
  return user;
}