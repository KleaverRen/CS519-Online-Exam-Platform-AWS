// lib/apiClient.ts
const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function apiClientGet(path: string) {
  const res = await fetch(`${apiBase}${path}`, {
    method: "GET",
    credentials: "include",   // <-- browser sends cookies
  });

  if (!res.ok) {
    throw new Error(`API GET (client) ${path} failed: ${res.status}`);
  }

  return res.json();
}

export async function apiClientPost(path: string, body: unknown) {
  const res = await fetch(`${apiBase}${path}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`API POST (client) ${path} failed: ${res.status}`);
  }

  return res.json();
}