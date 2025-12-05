// lib/jwt.ts
export function parseJwt(token: string) {
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Invalid JWT");

  const payload = Buffer.from(parts[1], "base64").toString("utf8");
  return JSON.parse(payload);
}