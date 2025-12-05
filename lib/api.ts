// lib/api.ts
import { cookies } from "next/headers";

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function apiGet(path: string) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("id_token")?.value;

  if (!accessToken) {
    throw new Error("Not authenticated (no access_token cookie)");
  }

  const res = await fetch(`${apiBase}${path}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,  // <-- MUST be Bearer + token
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`API GET ${path} failed: ${res.status}`);
  }

  return res.json();
}

export async function apiPost(path: string, body: unknown) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("id_token")?.value;
  // const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    throw new Error("Not authenticated (no access_token cookie)");
  }

  const res = await fetch(`${apiBase}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,   // <-- same here
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`API POST ${path} failed: ${res.status}`);
  }

  return res.json();
}